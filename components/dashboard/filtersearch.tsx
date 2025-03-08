import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type FilterSearchProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
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
}: FilterSearchProps) => {
  return (
    <div className="mb-8 w-full space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
        <Input
          type="text"
          placeholder="Search saved materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-gray-200 bg-white py-3 pl-10 text-xs"
        />
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            className={`rounded-full ${
              category.toLowerCase() === selectedCategory
                ? "bg-primary text-white hover:bg-gray-500 hover:text-white"
                : "hover:bg-slate-100 hover:text-slate-900"
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
  );
};
