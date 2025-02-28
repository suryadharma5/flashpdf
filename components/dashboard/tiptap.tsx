"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Blockquote from "@tiptap/extension-blockquote";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import CodeBlock from "@tiptap/extension-code-block";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from '@tiptap/extension-placeholder';

import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough as StrikethroughIcon,
  Quote as BlockquoteIcon,
  List as ListIcon,
  Code as CodeIcon,
  AlignLeft as AlignLeftIcon,
  AlignCenter as AlignCenterIcon,
  AlignRight as AlignRightIcon,
  Heading1 as H1Icon,
  Heading2 as H2Icon,
  Heading3 as H3Icon,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { saveNotes, getNotes } from "@/lib/repository/material/noteRepository";
import { useMutation, useQuery, useQueryClient  } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { LoadingPage } from "./loading";

export default function Tiptap({ documentId }: { documentId: string }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();
  
  const [notes, setNotes] = useState<string>("");


  const saveNotesMutation = useMutation({
    mutationFn: async (data: string) => {
      const res = await axiosInstance.put(
        `/api/material/notes?documentId=${documentId}`, { notes: data }
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

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<string>({
    queryKey: ["fetchNotes", documentId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/material/notes?documentId=${documentId}`);
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
        placeholder: 'Start writing here...', 
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
  }, [data,editor]);

  if(isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    console.error(error);
    return <div>Error loading notes</div>;
  }

  if(!editor) {
    return null;
  }

  console.log(data);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col w-full h-[calc(100vh-60px)] p-4">
      {/* Toolbar */}
      <div className="flex gap-2 mb-2 bg-gray-100 p-2 rounded-lg shadow-sm">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-md ${
            editor.isActive("bold") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <BoldIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-md ${
            editor.isActive("italic") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <ItalicIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-md ${
            editor.isActive("underline") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <UnderlineIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded-md ${
            editor.isActive("strike") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <StrikethroughIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-md ${
            editor.isActive("blockquote") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <BlockquoteIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-md ${
            editor.isActive("bulletList") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <ListIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded-md ${
            editor.isActive("codeBlock") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <CodeIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded-md ${
            editor.isActive({ textAlign: "left" }) ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <AlignLeftIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded-md ${
            editor.isActive({ textAlign: "center" }) ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <AlignCenterIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded-md ${
            editor.isActive({ textAlign: "right" }) ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <AlignRightIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-md ${
            editor.isActive("heading", { level: 1 }) ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <H1Icon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-md ${
            editor.isActive("heading", { level: 2 }) ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <H2Icon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-md ${
            editor.isActive("heading", { level: 3 }) ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <H3Icon size={18} />
        </button>
      </div>

      <div className="flex-1 border rounded-lg bg-white p-4 shadow-sm overflow-auto">
        <EditorContent editor={editor} className="prose w-full min-h-full focus:outline-none border-none" />
      </div>
    </div>
  );
}
