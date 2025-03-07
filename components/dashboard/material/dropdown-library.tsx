import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { ReactNode } from "react";

interface DropdownItem {
  label: string;
  onClick?: () => void;
  className?: string;
  separator?: boolean;
  icon?: ReactNode;
}

interface DropdownProps {
  items: DropdownItem[];
}

export function Dropdown({ items }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {items.map((item, index) => (
          <div key={index}>
            {item.separator && <DropdownMenuSeparator />}
            <DropdownMenuItem
              className={cn(item.className, "hover:cursor-pointer")}
              onClick={item.onClick}
            >
              {item.icon && <div className="mr-1">{item.icon}</div>}
              {item.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
