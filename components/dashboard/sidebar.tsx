"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/useSidebar";
import PlaceHolderImage from "@/public/placeholder.svg";
import {
  BarChart2,
  Bot,
  ChevronsLeft,
  History,
  MessageSquare,
  User,
} from "lucide-react";
import Image from "next/image";
import SidebarItem from "./sidebar-item";

export default function Sidebar() {
  const { isOpen: isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`border-r border-gray-300 bg-black ${
        isSidebarOpen ? "w-64" : "w-[85px]"
      } flex flex-col overflow-hidden transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between p-4">
        <Image
          src={PlaceHolderImage}
          alt="FlashAI Logo"
          width={32}
          height={32}
          className="ml-2 invert"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleSidebar(isSidebarOpen)}
          className={`text-white hover:bg-gray-800 ${isSidebarOpen ? "flex" : "hidden"} justify-center`}
        >
          <ChevronsLeft className="h-6 w-6" />
        </Button>
      </div>
      <nav className="flex-1 pt-4">
        <ul className="space-y-2">
          <SidebarItem href="material" icon={Bot} text="Create Material" />
          <SidebarItem href="history" icon={History} text="History" />
          <SidebarItem href="forum" icon={MessageSquare} text="Forum" />
          <SidebarItem href="progress" icon={BarChart2} text="Progress" />
        </ul>
      </nav>
      <div className="mt-auto border-t border-gray-800 py-3">
        <SidebarItem href="profile" icon={User} text="Profile" />
      </div>
    </aside>
  );
}
