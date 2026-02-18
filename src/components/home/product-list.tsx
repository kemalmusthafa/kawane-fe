"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useApi";
import { Product } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Search,
  Filter,
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useApi";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { toast } from "sonner";

interface ProductListProps {
  categoryId?: string;
  showFilters?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({
  categoryId,
  showFilters = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000000,
  });
  const [inStock, setInStock] = useState<boolean | undefined>(undefined);

  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { requireAuth } = useAuthRedirect();
  const { toggleWishlist } = useWishlist();

  const { products, error, isLoading, mutateProducts } = useProducts({
    search: searchTerm || undefined,
    categoryId,
    minPrice: priceRange.min > 0 ? priceRange.min : undefined,
    maxPrice: priceRange.max < 1000000 ? priceRange.max : undefined,
    inStock,
    sortBy,
    sortOrder,
    limit: 20,
  });

  const handleWishlistToggle = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error(
        "Silakan login terlebih dahulu untuk menambahkan ke wishlist"
      );
      return;
    }

    try {
      const response = await toggleWishlist(productId);
      if (response.success) {
        toast.success("Produk berhasil ditambahkan ke wishlist");
        mutateProducts();
      } else {
        toast.error(response.message || "Gagal menambahkan ke wishlist");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menambahkan ke wishlist");
    }
  };

  const handleAddToCart = (product: Product) => {
    const addToCartAction = async () => {
      try {
        await addItem(product.id, 1);
        toast.success("Produk ditambahkan ke keranjang");
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Gagal menambahkan produk ke keranjang");
      }
    };

    requireAuth(addToCartAction);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          Terjadi kesalahan saat memuat produk: {error.message}
        </p>
        <Button
          onClick={() => mutateProducts()}
          className="mt-4"
          variant="outline"
        >
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Cari Produk</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Urutkan Berdasarkan
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nama</SelectItem>
                    <SelectItem value="price">Harga</SelectItem>
                    <SelectItem value="createdAt">Terbaru</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Urutan</label>
                <Select
                  value={sortOrder}
                  onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">A-Z / Rendah-Tinggi</SelectItem>
                    <SelectItem value="desc">Z-A / Tinggi-Rendah</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stock Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Stok</label>
                <Select
                  value={inStock === undefined ? "all" : inStock.toString()}
                  onValueChange={(value) => {
                    if (value === "all") setInStock(undefined);
                    else setInStock(value === "true");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="true">Tersedia</SelectItem>
                    <SelectItem value="false">Habis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Harga Minimum</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({
                      ...prev,
                      min: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Harga Maksimum</label>
                <Input
                  type="number"
                  placeholder="1000000"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({
                      ...prev,
                      max: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada produk yang ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <Card
              key={product.id}
              className="group hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 overflow-hidden">
                  {/* Placeholder image - replace with actual product images */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      Gambar Produk
                    </span>
                  </div>
                </div>
                <CardTitle className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 whitespace-pre-line">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Price and Rating */}
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-primary">
                    {formatPrice(product.price)}
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(4.5)} {/* Placeholder rating */}
                    <span className="text-sm text-gray-500">(4.5)</span>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="flex items-center justify-between">
                  <Badge
                    variant={product.stock > 0 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {product.stock > 0 ? `${product.stock} tersedia` : "Habis"}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    SKU: {product.id.slice(0, 8)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1"
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.stock > 0 ? "Tambah ke Keranjang" : "Stok Habis"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleWishlistToggle(product.id)}
                    className="shrink-0"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {products.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => mutateProducts()}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memuat...
              </>
            ) : (
              "Muat Lebih Banyak"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
