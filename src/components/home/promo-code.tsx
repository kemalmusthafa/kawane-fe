"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Check } from "lucide-react";

export function PromoCode() {
  const [code, setCode] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const handleApply = () => {
    if (code.trim()) {
      // TODO: Validate promo code with API
      setIsApplied(true);
      setDiscount(50); // Example discount
    }
  };

  const handleRemove = () => {
    setIsApplied(false);
    setDiscount(0);
    setCode("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Tag className="h-5 w-5" />
          <span>Promo Code</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isApplied ? (
          <div className="flex space-x-2">
            <Input
              placeholder="Enter promo code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button onClick={handleApply} disabled={!code.trim()}>
              Apply
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">
                Code applied! -${discount.toFixed(2)} off
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRemove}>
              Remove
            </Button>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Have a promo code? Enter it above to save on your order.
        </p>
      </CardContent>
    </Card>
  );
}
