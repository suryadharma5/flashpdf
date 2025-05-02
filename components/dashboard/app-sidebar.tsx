"use client";

import {
  BookmarkIcon,
  ChartLine,
  Files,
  History,
  House,
  LayoutDashboard,
  MessagesSquare,
  Plus,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import { TeamSwitcher } from "@/components/dashboard/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathName = usePathname();
  const t = useTranslations("sidebar");

  const data = {
    user: {
      name: "shadcn",
      email: "shadcn@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Flash AI",
        plan: "AI Powered",
      },
    ],
    navMain: [
      {
        title: t("home"),
        url: "/dashboard/home",
        icon: House,
        isActive: pathName === "/dashboard/home",
      },
      {
        title: t("materials"),
        url: "#",
        icon: LayoutDashboard,
        isActive: pathName.includes("/dashboard/material"),
        items: [
          {
            title: t("createFlashcard"),
            icon: Plus,
            url: "/dashboard/material/create",
            isActive: pathName === "/dashboard/material/create",
          },
          {
            title: t("myFlashcard"),
            icon: Files,
            url: "/dashboard/material/library",
            isActive: pathName.includes("/dashboard/material/library"),
          },
          {
            title: t("savedFlashcard"),
            icon: BookmarkIcon,
            url: "/dashboard/material/saved",
            isActive: pathName.includes("/dashboard/material/saved"),
          },
        ],
      },
      {
        title: t("testHistory"),
        url: "/dashboard/history",
        icon: History,
        isActive: pathName.includes("/dashboard/history"),
      },
      {
        title: t("progress"),
        url: "/dashboard/progress",
        icon: ChartLine,
        isActive: pathName === "/dashboard/progress",
      },
      {
        title: "Forum",
        url: "/dashboard/forum",
        icon: MessagesSquare,
        isActive: pathName.includes("/dashboard/forum"),
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
