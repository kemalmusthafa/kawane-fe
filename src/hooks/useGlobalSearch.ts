"use client";

import { useState, useCallback, useMemo } from "react";
import { apiClient } from "@/lib/api";

export interface SearchResult {
  id: string;
  type:
    | "order"
    | "product"
    | "user"
    | "notification"
    | "inventory"
    | "shipment";
  title: string;
  description: string;
  url: string;
  metadata?: {
    status?: string;
    amount?: number;
    date?: string;
    priority?: string;
    stock?: number;
    trackingNumber?: string;
  };
}

export interface GlobalSearchParams {
  query: string;
  limit?: number;
}

export const useGlobalSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async ({ query, limit = 10 }: GlobalSearchParams) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const results: SearchResult[] = [];

        // Simple search - just get basic results
        const [
          ordersResponse,
          productsResponse,
          usersResponse,
          notificationsResponse,
        ] = await Promise.allSettled([
          apiClient.getAdminOrders({ search: query, limit: 3 }),
          apiClient.getProducts({ search: query, limit: 3 }),
          apiClient.getUsers({ search: query, limit: 3 }),
          apiClient.getAdminNotifications({ search: query, limit: 3 }),
        ]);

        // Try to get inventory and shipments separately to avoid breaking the main search
        let inventoryResponse, shipmentsResponse;
        try {
          inventoryResponse = await apiClient.getInventory({
            search: query,
            limit: 3,
          });
        } catch (err) {
          console.warn("Inventory search failed:", err);
          inventoryResponse = null;
        }

        try {
          shipmentsResponse = await apiClient.getShipments({
            search: query,
            limit: 3,
          });
        } catch (err) {
          console.warn("Shipments search failed:", err);
          shipmentsResponse = null;
        }

        // Process orders
        if (
          ordersResponse.status === "fulfilled" &&
          ordersResponse.value.success &&
          ordersResponse.value.data
        ) {
          ordersResponse.value.data.orders.forEach((order: any) => {
            results.push({
              id: order.id,
              type: "order",
              title: `Order #${order.orderNumber || order.id}`,
              description: `${order.customer?.name || "Unknown"} - ${
                order.items?.length || 0
              } items`,
              url: `/admin/orders?search=${encodeURIComponent(query)}`,
              metadata: {
                status: order.status,
                amount: order.totalAmount,
                date: order.createdAt,
              },
            });
          });
        }

        // Process products
        if (
          productsResponse.status === "fulfilled" &&
          productsResponse.value.success &&
          productsResponse.value.data
        ) {
          const products = productsResponse.value.data?.products || [];
          products.forEach((product: any) => {
            results.push({
              id: product.id,
              type: "product",
              title: product.name,
              description: `${
                product.category?.name || "No Category"
              } - Stock: ${product.stock || 0}`,
              url: `/admin/products?search=${encodeURIComponent(query)}`,
              metadata: {
                status: product.stock > 0 ? "active" : "out_of_stock",
                amount: product.price,
              },
            });
          });
        }

        // Process users
        if (
          usersResponse.status === "fulfilled" &&
          usersResponse.value.success &&
          usersResponse.value.data
        ) {
          usersResponse.value.data.users.forEach((user: any) => {
            results.push({
              id: user.id,
              type: "user",
              title: user.name || user.email,
              description: user.email,
              url: `/admin/users?search=${encodeURIComponent(query)}`,
              metadata: {
                status: user.role?.toLowerCase() || "customer",
              },
            });
          });
        }

        // Process notifications
        if (
          notificationsResponse.status === "fulfilled" &&
          notificationsResponse.value.success &&
          notificationsResponse.value.data
        ) {
          notificationsResponse.value.data.notifications.forEach(
            (notification: any) => {
              results.push({
                id: notification.id,
                type: "notification",
                title: notification.title,
                description: notification.description || notification.message,
                url: `/admin/notifications?search=${encodeURIComponent(query)}`,
                metadata: {
                  priority: notification.priority,
                  status: notification.isRead ? "read" : "unread",
                },
              });
            }
          );
        }

        // Process inventory (if available)
        if (
          inventoryResponse &&
          inventoryResponse.success &&
          inventoryResponse.data
        ) {
          inventoryResponse.data.inventory.forEach((item: any) => {
            results.push({
              id: item.id,
              type: "inventory",
              title: item.productName || "Unknown Product",
              description: `SKU: ${item.sku || "N/A"} - Category: ${
                item.category || "Unknown"
              }`,
              url: `/admin/inventory?search=${encodeURIComponent(query)}`,
              metadata: {
                status: item.status?.toLowerCase() || "unknown",
                stock: item.currentStock,
              },
            });
          });
        }

        // Process shipments (if available)
        if (
          shipmentsResponse &&
          shipmentsResponse.success &&
          shipmentsResponse.data
        ) {
          shipmentsResponse.data.shipments.forEach((shipment: any) => {
            results.push({
              id: shipment.id,
              type: "shipment",
              title: `Shipment #${shipment.trackingNumber || shipment.id}`,
              description: `${
                shipment.order?.customer?.name || "Unknown Customer"
              } - ${shipment.carrier || "Unknown Carrier"}`,
              url: `/admin/shipments?search=${encodeURIComponent(query)}`,
              metadata: {
                status: shipment.status,
                trackingNumber: shipment.trackingNumber,
                date: shipment.createdAt,
              },
            });
          });
        }

        setSearchResults(results.slice(0, limit));
      } catch (err) {
        console.error("Search error:", err);
        setError(
          `Search failed: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  const groupedResults = useMemo(() => {
    const groups = {
      orders: searchResults.filter((r) => r.type === "order"),
      products: searchResults.filter((r) => r.type === "product"),
      users: searchResults.filter((r) => r.type === "user"),
      notifications: searchResults.filter((r) => r.type === "notification"),
      inventory: searchResults.filter((r) => r.type === "inventory"),
      shipments: searchResults.filter((r) => r.type === "shipment"),
    };
    return groups;
  }, [searchResults]);

  return {
    search,
    clearSearch,
    searchResults,
    groupedResults,
    isSearching,
    error,
  };
};
