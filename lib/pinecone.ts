import {
  Pinecone,
  PineconeRecord,
  RecordMetadata,
} from "@pinecone-database/pinecone";
import { randomUUID } from "crypto";
import { Document } from "langchain/document";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import md5 from "md5";
import { getEmbeddings } from "./util/openai-helper";
import { PDFPage, prepareDocument } from "./util/pdf-helper";

let pinecone: Pinecone | null = null;

type MetaData = {
  text: string;
  pageNumber: number;
};

export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }

  return pinecone;
};

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    console.log("Success");
    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord<RecordMetadata>;
  } catch (error) {
    console.log("error embedding document", error);
    return {
      id: "",
      values: [],
      metadata: {
        text: "",
        pageNumber: 0,
      },
    } as PineconeRecord<RecordMetadata>;
  }
}

export async function loadDocumentIntoPineCone(
  file: File | null,
  title: string,
) {
  console.log("Loading document into PineCone");

  if (!file) {
    return null;
  }

  // get the pdf
  const loader = new PDFLoader(file);
  const pages = (await loader.load()) as PDFPage[];

  // split and segment the pdf
  const documents = await Promise.all(
    pages.map((page) => prepareDocument(page)),
  );

  // vectorize the document
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  if (vectors.some((vector) => vector.id === "")) {
    return null;
  }

  // upload the document to pinecone
  const client = await getPineconeClient();
  const pineconeIndex = client.index("flashai");

  console.log("Inserting vectors into PineCone");

  const uuid = randomUUID();
  const namespaceId = `${title}-${uuid}`;
  const namespace = pineconeIndex.namespace(namespaceId);

  await namespace.upsert(vectors);

  return { documents, namespaceId };
}

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  namespace: string,
) {
  const client = await getPineconeClient();
  const pineconeIndex = client.index("flashai");

  try {
    const queryResult = await pineconeIndex.namespace(namespace).query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });

    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying pinecone", error);
    throw error;
  }
}

export async function getContext(query: string, namespace: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, namespace);

  matches.forEach((match) => {
    console.log(`Match score: ${match.score}`);
    console.log(match.metadata as MetaData);
  });

  const qualifiedMatches = matches.filter(
    (match) => match.score && match.score > 0.4,
  );

  const docs = qualifiedMatches.map(
    (match) => (match.metadata as MetaData).text,
  );

  return docs.join("\n").substring(0, 2000);
}
