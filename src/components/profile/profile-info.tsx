"use client";

import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, CheckCircle } from "lucide-react";

interface ProfileInfoProps {
  name: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export function ProfileInfo({
  name,
  role,
  isVerified,
  createdAt,
  updatedAt,
}: ProfileInfoProps) {
  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <div className="text-center space-y-2 md:space-y-3 lg:space-y-4">
        <div className="space-y-1 md:space-y-2">
          <CardTitle className="text-sm md:text-base lg:text-lg font-bold text-gray-900 dark:text-gray-100 break-words">
            {name}
          </CardTitle>
          {isVerified && (
            <Badge
              variant="secondary"
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 px-2 py-0.5 text-[9px] md:text-[10px] lg:text-xs font-medium"
            >
              <CheckCircle className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        <div className="flex justify-center">
          <div className="px-2 md:px-3 py-0.5 md:py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
            <span className="text-[10px] md:text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300">
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-2 md:space-y-3 lg:space-y-4">
        <div className="p-2 md:p-3 lg:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors group">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 group-hover:bg-gray-100 dark:group-hover:bg-gray-600 transition-colors">
              <User className="h-3 w-3 md:h-4 md:w-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Member Since
              </p>
              <p className="text-[10px] md:text-xs lg:text-sm font-medium text-gray-900 dark:text-gray-100 break-words">
                {new Date(createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="p-2 md:p-3 lg:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors group">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 group-hover:bg-gray-100 dark:group-hover:bg-gray-600 transition-colors">
              <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Last Updated
              </p>
              <p className="text-[10px] md:text-xs lg:text-sm font-medium text-gray-900 dark:text-gray-100 break-words">
                {new Date(updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
