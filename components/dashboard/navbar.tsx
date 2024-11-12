"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathName = usePathname();
  const pathArray = pathName.split("/").filter(Boolean);
  console.log(pathName);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList className="flex flex-wrap items-center gap-1.5">
            {pathArray.map((segment, index) => {
              const href = `/${pathArray.slice(0, index + 1).join("/") + "/home"}`;
              const isLastItem = index === pathArray.length - 1;
              const isFirstItem = index === 0;

              return (
                <div key={href} className="inline-flex items-center gap-1.5">
                  <BreadcrumbItem>
                    {isLastItem ? (
                      <BreadcrumbPage>{segment}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href="/dashboard/home">
                        {isFirstItem
                          ? segment.charAt(0).toLowerCase() + segment.slice(1)
                          : "..."}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLastItem && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};
