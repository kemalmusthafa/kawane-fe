"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { ConfirmationDialog } from "./confirmation-dialog";

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onToggleVisibility?: () => void;
  isVisible?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showView?: boolean;
  showToggleVisibility?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
  deleteTitle?: string;
  deleteDescription?: string;
  deleteConfirmText?: string;
  deleteCancelText?: string;
}

export function ActionButtons({
  onEdit,
  onDelete,
  onView,
  onToggleVisibility,
  isVisible = true,
  showEdit = true,
  showDelete = true,
  showView = false,
  showToggleVisibility = false,
  size = "sm",
  className = "",
  deleteTitle = "Are you sure?",
  deleteDescription = "This action cannot be undone.",
  deleteConfirmText = "Delete",
  deleteCancelText = "Cancel",
}: ActionButtonsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    if (onDelete) {
      setShowDeleteConfirm(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete();
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <div
        className={`flex flex-col sm:flex-row gap-2 sm:gap-2 justify-end ${className}`}
      >
        {showView && onView && (
          <Button
            size={size}
            variant="outline"
            onClick={onView}
            className="w-full sm:w-auto"
            title="View Details"
          >
            <Eye className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">View</span>
          </Button>
        )}

        {showToggleVisibility && onToggleVisibility && (
          <Button
            size={size}
            variant="outline"
            onClick={onToggleVisibility}
            className="w-full sm:w-auto"
            title={isVisible ? "Hide" : "Show"}
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4 mr-1" />
            ) : (
              <Eye className="h-4 w-4 mr-1" />
            )}
            <span className="hidden sm:inline">
              {isVisible ? "Hide" : "Show"}
            </span>
          </Button>
        )}

        {showEdit && onEdit && (
          <Button
            size={size}
            variant="outline"
            onClick={onEdit}
            className="w-full sm:w-auto"
            title="Edit"
          >
            <Edit className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        )}

        {showDelete && onDelete && (
          <Button
            size={size}
            variant="destructive"
            onClick={handleDeleteClick}
            className="w-full sm:w-auto"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        )}
      </div>

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title={deleteTitle}
        description={deleteDescription}
        confirmText={deleteConfirmText}
        cancelText={deleteCancelText}
        variant="destructive"
      />
    </>
  );
}
