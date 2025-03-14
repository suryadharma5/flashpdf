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
import { useIsMobile } from "@/hooks/use-mobile";
import { axiosInstance } from "@/lib/axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const pathName = usePathname();
  const pathArray = pathName.split("/").filter(Boolean);
  const router = useRouter();
  const isMobile = useIsMobile();

  const [validPaths, setValidPaths] = useState<Record<string, boolean>>({});

  // Pre-validate current path segments on component mount or path change
  useEffect(() => {
    const validatePaths = async () => {
      const pathChecks: Record<string, boolean> = { "/": true }; // Root is always valid

      for (let i = 0; i < pathArray.length; i++) {
        const currentPath = `/${pathArray.slice(0, i + 1).join("/")}`;
        try {
          const response = await axiosInstance.get(currentPath, {
            method: "HEAD",
          });
          pathChecks[currentPath] =
            response.status >= 200 && response.status < 400;
        } catch {
          pathChecks[currentPath] = false;
        }
      }

      setValidPaths(pathChecks);
    };

    validatePaths();
  }, [pathName]);

  const handleClick = async (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    index: number,
  ) => {
    event.preventDefault();

    // If we already know the path is valid, navigate directly
    if (validPaths[href]) {
      router.push(href);
      return;
    }

    try {
      const response = await axiosInstance.get(href, { method: "HEAD" });

      if (response.status >= 200 && response.status < 400) {
        // Path is valid, update cache and navigate
        setValidPaths((prev) => ({ ...prev, [href]: true }));
        router.push(href);
      } else {
        throw new Error("Page not found");
      }
    } catch (error) {
      // Find the most recent valid path
      let validIndex = index - 1;
      while (validIndex >= 0) {
        const prevHref = `/${pathArray.slice(0, validIndex + 1).join("/")}`;
        if (validPaths[prevHref]) {
          router.push(prevHref);
          return;
        }
        validIndex--;
      }

      // If no valid parent paths found, go to home
      router.push("/");
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className={isMobile ? "hidden" : ""}>
          <BreadcrumbList className="flex flex-wrap items-center gap-1.5">
            {/* Home link */}
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/");
                }}
              >
                home
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pathArray.length > 0 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}

            {pathArray.map((segment, index) => {
              const isId = /^[a-zA-Z0-9_-]{10,}$/.test(segment);
              const displayText = isId ? "detail" : segment;

              const hrefSegments = pathArray.slice(0, index + 1);
              const href = `/${hrefSegments.join("/")}`;

              const isLastItem = index === pathArray.length - 1;

              return (
                <div key={href} className="inline-flex items-center gap-1.5">
                  <BreadcrumbItem>
                    {isLastItem ? (
                      <BreadcrumbPage>{displayText}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={href}
                        onClick={(event) => handleClick(event, href, index)}
                      >
                        {displayText}
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
