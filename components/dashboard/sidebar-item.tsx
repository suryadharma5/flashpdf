"use client";

import { LucideIcon } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/hooks/useSidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarItemProps = {
  href: string;
  icon: LucideIcon;
  text: string;
  onClick?: () => void;
};

const SidebarItem = ({ href, icon: Icon, text }: SidebarItemProps) => {
  const pathName = usePathname().replace("/dashboard/", "");

  const { isOpen: isSidebarOpen } = useSidebar();
  const isactive = pathName === href;

  return (
    <li className="list-none px-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href}
              className={`flex items-center rounded-lg px-4 py-2 ${
                isactive
                  ? "bg-gray-800 text-white"
                  : "text-gray-600 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className={`ml-3 ${isSidebarOpen ? "flex" : "hidden"}`}>
                {text}
              </span>
            </Link>
          </TooltipTrigger>
          {!isSidebarOpen && (
            <TooltipContent side="right" className="ml-1">
              {text}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </li>
  );
};

export default SidebarItem;
