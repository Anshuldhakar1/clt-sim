
import React from "react";

interface FormulaProps {
  children: React.ReactNode;
}

export function Formula({ children }: FormulaProps) {
  return (
    <div className="bg-muted/80 p-3 rounded-lg overflow-x-auto dark:bg-muted/20 text-base font-mono tracking-wide whitespace-pre-line leading-normal border border-muted-foreground/20 my-1">
      {children}
    </div>
  );
}
