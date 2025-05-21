import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type ComboBoxCategoryProps = {
  openCombobox: boolean;
  selectedCategory: string;
  setOpenCombobox: (open: boolean) => void;
  setSelectedCategory: (category: string) => void;
};

type CategoryProps = {
  id: string;
  name: string;
};

export const ComboBoxCategory = ({
  openCombobox,
  setOpenCombobox,
  selectedCategory,
  setSelectedCategory,
}: ComboBoxCategoryProps) => {
  const [categories, setCategories] = useState<CategoryProps[] | []>([]);

  const t = useTranslations("create");
  const queryClient = useQueryClient();

  const categoriesData = queryClient.getQueryData<CategoryProps[]>([
    "fetchCategories",
  ]);

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  const selectedCategoryName = categories.find(
    (category) => category.id === selectedCategory,
  )?.name;

  return (
    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openCombobox}
          className="w-full"
        >
          <p
            className={`w-full text-start text-sm ${selectedCategoryName ? "" : "text-gray-500"}`}
          >
            {selectedCategoryName
              ? selectedCategoryName.charAt(0).toUpperCase() +
                selectedCategoryName.slice(1)
              : t("formCategorySelect")}
          </p>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={t("formSearchCategory")} />
          <CommandList>
            <CommandEmpty className="px-1 py-2">
              <p className="py-1 text-center text-sm text-muted-foreground">
                {t("formCategoryNotFound")}
              </p>
            </CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.id}
                  onSelect={(currentValue) => {
                    setSelectedCategory(
                      currentValue === selectedCategory ? "" : currentValue,
                    );
                    setOpenCombobox(false);
                  }}
                  className="hover:cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCategory === category.id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {category.name.replace(
                    category.name.charAt(0),
                    category.name.charAt(0).toUpperCase(),
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
