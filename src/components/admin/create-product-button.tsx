"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function CreateProductButton() {
  return (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Create Product
    </Button>
  );
}
