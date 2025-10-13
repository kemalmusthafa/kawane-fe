"use client";

import { SWRConfig } from "swr";
import { apiClient } from "@/lib/api";

interface SWRProviderProps {
  children: React.ReactNode;
}

export const SWRProvider: React.FC<SWRProviderProps> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher: async (url: string) => {
          // Use apiClient for SWR calls to handle authentication
          try {
            // Remove /api prefix from url since baseURL already contains it
            const endpoint = url.startsWith("/api/") ? url.substring(5) : url;

            // Ensure endpoint starts with /
            const cleanEndpoint = endpoint.startsWith("/")
              ? endpoint
              : `/${endpoint}`;

            const response = await apiClient.request(cleanEndpoint, {
              method: "GET",
            });
            return response;
          } catch (error: any) {
            // Don't throw error for authentication issues, let components handle it
            if (error.message?.includes("Login required")) {
              return null;
            }
            throw error;
          }
        },
        onError: (error) => {
          console.error("SWR Error:", error);
        },
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 2000,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
      }}
    >
      {children}
    </SWRConfig>
  );
};
