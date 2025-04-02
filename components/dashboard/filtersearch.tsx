import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ArrowDown10,
  ArrowUp10,
  Heart,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type FilterSearchProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  placeHolder?: string;
  isNeedSorting?: boolean;
  selectedSort?: string | null;
  setSelectedSort?: (value: string | null) => void;
};

const categories = [
  "Programming",
  "Social study",
  "Science",
  "Math",
  "Language",
  "Others",
];

export const FilterSearch = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  onCategoryChange,
  placeHolder,
  isNeedSorting = false,
  selectedSort,
  setSelectedSort,
}: FilterSearchProps) => {
  const isMobile = useIsMobile();
  const t = useTranslations("search");

  const sortOptions = [
    { value: "latest", label: t("recent"), icon: ArrowDown10 },
    { value: "oldest", label: t("oldest"), icon: ArrowUp10 },
    { value: "like", label: t("popular"), icon: Heart },
  ];

  const getSelectedSortOption = (value: string) => {
    return sortOptions.find((opt) => opt.value === value);
  };

  return (
    <div className="mb-8 w-full space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          type="text"
          placeholder={placeHolder ? placeHolder : "Search saved materials..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-gray-200 bg-white py-3 pl-10 text-xs"
        />
      </div>

      {/* Category Buttons */}
      {isMobile ? (
        <div className="flex w-full flex-col gap-5">
          {isNeedSorting && (
            <div className="flex w-full items-center justify-between">
              <h3 className="text-sm font-medium">{t("title")}</h3>
              <DropdownMenu>
                {selectedSort ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 gap-1 border-2 border-blue-300 bg-white hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (setSelectedSort) {
                        setSelectedSort(null);
                      }
                    }}
                  >
                    {/* Get and display the icon for the selected sort */}
                    {(() => {
                      const option = getSelectedSortOption(selectedSort);
                      if (option) {
                        const IconComponent = option.icon;
                        return (
                          <IconComponent className="mr-1 h-3.5 w-3.5 text-blue-500" />
                        );
                      }
                      return null;
                    })()}
                    <p className="text-sm text-blue-500">
                      {getSelectedSortOption(selectedSort)?.label ||
                        selectedSort}
                    </p>
                    <X
                      className="ml-0.5 h-3.5 w-3.5 text-blue-500 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (setSelectedSort) {
                          setSelectedSort(null);
                        }
                      }}
                    />
                  </Button>
                ) : (
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span className="text-sm">{t("title")}</span>
                    </Button>
                  </DropdownMenuTrigger>
                )}
                <DropdownMenuContent align="end" className="w-fit">
                  <DropdownMenuRadioGroup
                    value={selectedSort ?? ""}
                    onValueChange={setSelectedSort}
                  >
                    <DropdownMenuRadioItem
                      value="latest"
                      className="px-3 py-2 hover:cursor-pointer"
                    >
                      <ArrowDown10 className="mr-2 h-4 w-4" />
                      <span>{t("recent")}</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="oldest"
                      className="px-3 py-2 hover:cursor-pointer"
                    >
                      <ArrowUp10 className="mr-2 h-4 w-4" />
                      <span>{t("oldest")}</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="like"
                      className="px-3 py-2 hover:cursor-pointer"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      <span>{t("popular")}</span>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="default"
                className={`rounded-full ${
                  category.toLowerCase() === selectedCategory
                    ? "bg-primary text-white hover:bg-gray-500 hover:text-white"
                    : "bg-secondary text-gray-900 hover:bg-gray-300 hover:text-slate-900"
                }`}
                size="sm"
                onClick={() =>
                  onCategoryChange(
                    category.toLowerCase() === selectedCategory
                      ? null
                      : category.toLowerCase(),
                  )
                }
              >
                <p className="text-xs">{category}</p>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="default"
                className={`rounded-full ${
                  category.toLowerCase() === selectedCategory
                    ? "bg-primary text-white hover:bg-gray-500 hover:text-white"
                    : "bg-secondary text-gray-900 hover:bg-gray-300 hover:text-slate-900"
                }`}
                size="sm"
                onClick={() =>
                  onCategoryChange(
                    category.toLowerCase() === selectedCategory
                      ? null
                      : category.toLowerCase(),
                  )
                }
              >
                <p className="text-xs">{category}</p>
              </Button>
            ))}
          </div>
          {isNeedSorting && (
            <DropdownMenu>
              {selectedSort ? (
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 gap-1 border-2 border-blue-300 bg-white hover:bg-blue-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (setSelectedSort) {
                      setSelectedSort(null);
                    }
                  }}
                >
                  {/* Get and display the icon for the selected sort */}
                  {(() => {
                    const option = getSelectedSortOption(selectedSort);
                    if (option) {
                      const IconComponent = option.icon;
                      return (
                        <IconComponent className="mr-1 h-3.5 w-3.5 text-blue-500" />
                      );
                    }
                    return null;
                  })()}
                  <p className="text-blue-500">
                    {getSelectedSortOption(selectedSort)?.label || selectedSort}
                  </p>
                  <X
                    className="ml-0.5 h-3.5 w-3.5 text-blue-500 hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (setSelectedSort) {
                        setSelectedSort(null);
                      }
                    }}
                  />
                </Button>
              ) : (
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    {t("title")}
                  </Button>
                </DropdownMenuTrigger>
              )}
              <DropdownMenuContent align="start" className="w-fit">
                <DropdownMenuRadioGroup
                  value={selectedSort ?? ""}
                  onValueChange={setSelectedSort}
                >
                  <DropdownMenuRadioItem
                    value="latest"
                    className="px-3 py-2 hover:cursor-pointer"
                  >
                    <ArrowDown10 className="mr-2 h-4 w-4" />
                    <span>{t("recent")}</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="oldest"
                    className="px-3 py-2 hover:cursor-pointer"
                  >
                    <ArrowUp10 className="mr-2 h-4 w-4" />
                    <span>{t("oldest")}</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="like"
                    className="px-3 py-2 hover:cursor-pointer"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    <span>{t("popular")}</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
    </div>
  );
};
