import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";

interface SortToggleProps {
  sortDescending: boolean;
  onToggle: () => void;
  loading?: boolean;
}

export function SortToggle({
  sortDescending,
  onToggle,
  loading = false,
}: SortToggleProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      disabled={loading}
      className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4" />
      {sortDescending ? "価格順（高→低）" : "標準順"}
    </Button>
  );
}
