"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";

interface ProfileHeaderProps {
  editing: boolean;
  onEditClick: () => void;
}

export function ProfileHeader({ editing, onEditClick }: ProfileHeaderProps) {
  const { user } = useAuth();

  const getBackLink = () => {
    if (user?.role === "ADMIN" || user?.role === "STAFF") {
      return "/admin/dashboard";
    }
    return "/";
  };

  const getBackLabel = () => {
    if (user?.role === "ADMIN" || user?.role === "STAFF") {
      return "Back to Dashboard";
    }
    return "Back to Homepage";
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href={getBackLink()}>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {getBackLabel()}
          </Button>
        </Link>
        <div className="h-6 w-px bg-gray-300" />
        
      </div>
      {!editing && (
        <Button onClick={onEditClick} variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      )}
    </div>
    
  );
}
