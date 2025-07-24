import { Search, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminFiltersProps {
  filters: {
    status: string;
    emotion: string;
    search: string;
  };
  onFiltersChange: (filters: { status: string; emotion: string; search: string }) => void;
}

export default function AdminFilters({ filters, onFiltersChange }: AdminFiltersProps) {
  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value === "all" ? "" : value });
  };

  const handleEmotionChange = (value: string) => {
    onFiltersChange({ ...filters, emotion: value === "all" ? "" : value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const clearFilters = () => {
    onFiltersChange({ status: "", emotion: "", search: "" });
  };

  const hasActiveFilters = filters.status || filters.emotion || filters.search;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-blush-100 mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="text-blush-400" size={16} />
          <span className="text-sm font-medium text-warm-gray-700">Filters:</span>
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray-400" size={16} />
          <Input
            type="text"
            placeholder="Search messages..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-10 border-blush-200 focus:border-blush-300"
            data-testid="input-search"
          />
        </div>

        {/* Status Filter */}
        <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-32 border-blush-200 focus:border-blush-300" data-testid="select-status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
          </SelectContent>
        </Select>

        {/* Emotion Filter */}
        <Select value={filters.emotion || "all"} onValueChange={handleEmotionChange}>
          <SelectTrigger className="w-32 border-blush-200 focus:border-blush-300" data-testid="select-emotion">
            <SelectValue placeholder="Emotion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Emotions</SelectItem>
            <SelectItem value="angry">😤 Angry</SelectItem>
            <SelectItem value="sad">😢 Sad</SelectItem>
            <SelectItem value="anxious">😰 Anxious</SelectItem>
            <SelectItem value="other">🤔 Other</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="border-blush-200 hover:bg-blush-50"
            data-testid="button-clear-filters"
          >
            <RotateCcw size={16} className="mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}