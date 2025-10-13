"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useApi";
import { Product } from "@/lib/api";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

interface AddToWishlistButtonProps {
  product: Product;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
}

export const AddToWishlistButton: React.FC<AddToWishlistButtonProps> = ({
  product,
  variant = "outline",
  size = "default",
  className,
  disabled = false,
}) => {
  const { toggleWishlist, isInWishlist, isLoading } = useWishlist();
  const { requireAuth } = useAuthRedirect();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleWishlist = async () => {
    if (disabled || isLoading || isToggling) return;

    const toggleWishlistAction = async () => {
      try {
        setIsToggling(true);
        await toggleWishlist(product.id);
        toast.success(
          isInWishlist(product.id)
            ? "Dihapus dari wishlist"
            : "Ditambahkan ke wishlist"
        );
      } catch (error) {
        console.error("Error toggling wishlist:", error);
        toast.error("Gagal mengupdate wishlist");
      } finally {
        setIsToggling(false);
      }
    };

    requireAuth(toggleWishlistAction);
  };

  const isInWishlistProduct = isInWishlist(product.id);
  const isDisabled = disabled || isLoading || isToggling;

  return (
    <Button
      variant={variant}
      size={size}
      className={`${className} ${
        isInWishlistProduct ? "text-red-500 border-red-500 hover:bg-red-50" : ""
      }`}
      disabled={isDisabled}
      onClick={handleToggleWishlist}
    >
      {isToggling ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Heart
          className={`w-4 h-4 ${isInWishlistProduct ? "fill-current" : ""}`}
        />
      )}
    </Button>
  );
};
