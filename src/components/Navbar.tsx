
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { ChartBar } from "lucide-react";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  return (
    <header className={cn("w-full border-b bg-background px-4 py-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChartBar className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Chart Tales Explorer</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
