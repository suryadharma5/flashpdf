"use client";

import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import CodeBlock from "@tiptap/extension-code-block";
import Heading from "@tiptap/extension-heading";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./tiptap.css";

import {
  AlignCenter as AlignCenterIcon,
  AlignLeft as AlignLeftIcon,
  AlignRight as AlignRightIcon,
  Quote as BlockquoteIcon,
  Bold as BoldIcon,
  Code as CodeIcon,
  Heading1 as H1Icon,
  Heading2 as H2Icon,
  Heading3 as H3Icon,
  Italic as ItalicIcon,
  List as ListIcon,
  Strikethrough as StrikethroughIcon,
  Underline as UnderlineIcon,
} from "lucide-react";

import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { LoadingPage } from "../../loading";

export default function Tiptap({ documentId }: { documentId: string }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  const [notes, setNotes] = useState<string>("");

  const saveNotesMutation = useMutation({
    mutationFn: async (data: string) => {
      const res = await axiosInstance.put(
        `/api/material/notes?documentId=${documentId}`,
        { notes: data },
      );

      return res.data;
    },
    onSuccess: (data) => {
      console.log(data);
      setNotes(data.notes); // Update local state
      // queryClient.invalidateQueries(["notes", documentId]);
    },
    onError: (e) => {
      console.log(e.message);
    },
  });

  const { data, isLoading, isError, error } = useQuery<string>({
    queryKey: ["fetchNotes", documentId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/material/notes?documentId=${documentId}`,
      );
      return res.data.data;
    },
    refetchOnWindowFocus: true, // Refetch when tab is focused
    refetchOnReconnect: true, // Refetch when network is reconnected
    staleTime: 0, // Ensures data is always fresh
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Strike,
      Blockquote,
      BulletList,
      ListItem,
      CodeBlock,
      Heading.configure({ levels: [1, 2, 3] }),
      TextAlign.configure({ types: ["paragraph", "heading"] }),
      Placeholder.configure({
        placeholder: "Start writing here...",
      }),
    ],
    content: notes, // Set initial cont
    onBlur: ({ editor }) => {
      if (userId) {
        saveNotesMutation.mutate(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    if (data && editor) {
      editor.commands.setContent(data);
    }
  }, [data, editor]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    console.error(error);
    return <div>Error loading notes</div>;
  }

  if (!editor) {
    return null;
  }

  console.log(data);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex h-[calc(100vh-60px)] w-full flex-col p-4">
      {/* Toolbar */}
      <div className="mb-2 flex gap-2 rounded-lg bg-gray-100 p-2 shadow-sm">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-md p-2 ${
            editor.isActive("bold") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <BoldIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-md p-2 ${
            editor.isActive("italic") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <ItalicIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded-md p-2 ${
            editor.isActive("underline")
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          <UnderlineIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded-md p-2 ${
            editor.isActive("strike") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <StrikethroughIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded-md p-2 ${
            editor.isActive("blockquote")
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          <BlockquoteIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded-md p-2 ${
            editor.isActive("bulletList")
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          <ListIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`rounded-md p-2 ${
            editor.isActive("codeBlock")
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          <CodeIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`rounded-md p-2 ${
            editor.isActive({ textAlign: "left" })
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          <AlignLeftIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`rounded-md p-2 ${
            editor.isActive({ textAlign: "center" })
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          <AlignCenterIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`rounded-md p-2 ${
            editor.isActive({ textAlign: "right" })
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          <AlignRightIcon size={18} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`rounded-md p-2 ${
            editor.isActive("heading", { level: 1 })
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          <H1Icon size={18} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`rounded-md p-2 ${
            editor.isActive("heading", { level: 2 })
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          <H2Icon size={18} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`rounded-md p-2 ${
            editor.isActive("heading", { level: 3 })
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          <H3Icon size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-auto rounded-lg border bg-white p-4 shadow-sm">
        <EditorContent
          editor={editor}
          className="prose min-h-full w-full border-none focus:outline-none"
        />
      </div>
    </div>
  );
}
