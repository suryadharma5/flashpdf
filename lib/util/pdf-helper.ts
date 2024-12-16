import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import md5 from "md5";
import { embedDocument } from "./openai-helper";

export type PDFPage = {
  pageContent: string;
  metadata: {
    loc: {
      pageNumber: number;
    };
  };
};

const truncateStringByByte = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

const preprocessText = (text: string) => {
  return text
    .replace(/\n/g, "")
    .replace(/\s+/g, " ")
    .replace(/[^\w\s,]/g, "");
};

const filterRelevantContent = (text: string) => {
  const cleanedText = text
    .replace(/\b(page\s+\d+)\b/gi, "") // Hapus nomor halaman
    .replace(/\b(copyright|disclaimer).*$/gim, ""); // Hapus copyright

  return cleanedText;
};

export async function prepareDocument(page: PDFPage) {
  let { metadata, pageContent } = page; // eslint-disable-line prefer-const
  pageContent = filterRelevantContent(pageContent);
  pageContent = preprocessText(pageContent);

  // split the document
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByByte(pageContent, 36000),
      },
    }),
  ]);

  return docs;
}

export async function vectoriseDocument(doc: Document) {
  const embeddings = await embedDocument(doc.pageContent);
  const hash = md5(doc.pageContent);

  return {
    id: hash,
    values: embeddings,
    metadata: {
      text: doc.metadata.text,
      pageNumber: doc.metadata.pageNumber,
    },
  };
}
