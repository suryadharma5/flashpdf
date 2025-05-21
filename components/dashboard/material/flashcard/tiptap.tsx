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
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
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

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { LoadingPage } from "../../loading";

export default function Tiptap({ documentId }: { documentId: string }) {
  const isMobile = useIsMobile();
  const { data: session } = useSession();
  const userId = session?.user?.id;

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
    content: <span style={{ fontFamily: "Inter, sans-serif" }}>{notes}</span>, // Set initial cont
    onBlur: ({ editor }) => {
      if (userId) {
        saveNotesMutation.mutate(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    if (data && editor) {
      editor.commands.setContent(data);
      editor.setEditable(true);
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
    <div
      className={`tiptap-container flex ${isMobile ? "" : "h-[calc(100vh-60px)]"} w-full flex-col rounded-lg border bg-white p-4`}
    >
      {/* Toolbar */}
      <div className="mb-2 flex gap-2 rounded-lg border p-2 shadow-sm">
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-md p-2 hover:bg-gray-600 hover:text-white ${
            editor.isActive("bold") ? "bg-primary text-white" : ""
          }`}
        >
          <BoldIcon size={18} />
        </Button>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-md p-2 hover:bg-gray-600 hover:text-white ${
            editor.isActive("italic") ? "bg-primary text-white" : ""
          }`}
        >
          <ItalicIcon size={18} />
        </Button>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded-md p-2 hover:bg-gray-600 hover:text-white ${
            editor.isActive("underline") ? "bg-primary text-white" : ""
          }`}
        >
          <UnderlineIcon size={18} />
        </Button>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded-md p-2 hover:bg-gray-600 hover:text-white ${
            editor.isActive("strike") ? "bg-primary text-white" : ""
          }`}
        >
          <StrikethroughIcon size={18} />
        </Button>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded-md p-2 hover:bg-gray-600 hover:text-white ${
            editor.isActive("blockquote") ? "bg-primary text-white" : ""
          }`}
        >
          <BlockquoteIcon size={18} />
        </Button>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded-md p-2 hover:bg-gray-600 hover:text-white ${
            editor.isActive("bulletList") ? "bg-primary text-white" : ""
          }`}
        >
          <ListIcon size={18} />
        </Button>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`rounded-md p-2 hover:bg-gray-600 hover:text-white ${
            editor.isActive("codeBlock") ? "bg-primary text-white" : ""
          }`}
        >
          <CodeIcon size={18} />
        </Button>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`rounded-md p-2 hover:bg-gray-600 hover:text-white ${
            editor.isActive({ textAlign: "left" })
              ? "bg-primary text-white"
              : ""
          }`}
        >
          <AlignLeftIcon size={18} />
        </Button>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`rounded-md p-2 hover:bg-gray-600 hover:text-white ${
            editor.isActive({ textAlign: "center" })
              ? "bg-primary text-white"
              : ""
          }`}
        >
          <AlignCenterIcon size={18} />
        </Button>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`rounded-md p-2 hover:bg-gray-600 hover:text-white ${
            editor.isActive({ textAlign: "right" })
              ? "bg-primary text-white"
              : ""
          }`}
        >
          <AlignRightIcon size={18} />
        </Button>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`rounded-md p-2 hover:bg-gray-600 hover:text-white ${
            editor.isActive("heading", { level: 1 })
              ? "bg-primary text-white"
              : ""
          }`}
        >
          <H1Icon size={18} />
        </Button>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`rounded-md p-2 hover:bg-gray-600 hover:text-white ${
            editor.isActive("heading", { level: 2 })
              ? "bg-primary text-white"
              : ""
          }`}
        >
          <H2Icon size={18} />
        </Button>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`rounded-md p-2 hover:bg-gray-600 hover:text-white ${
            editor.isActive("heading", { level: 3 })
              ? "bg-primary text-white"
              : ""
          }`}
        >
          <H3Icon size={18} />
        </Button>
      </div>

      {/* Bubble Menu */}
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100 }}
        className="space-x-2 rounded-lg border bg-white px-2 shadow-sm"
      >
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </Button>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </Button>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          Strike
        </Button>
      </BubbleMenu>

      <div className="flex-1 overflow-auto rounded-lg border p-4 shadow-sm">
        <EditorContent
          editor={editor}
          className="prose min-h-full w-full border-none focus:outline-none"
        />
      </div>
    </div>
  );
}
