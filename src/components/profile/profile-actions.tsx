"use client";

import { Button } from "@/components/ui/button";
import { X, Save, Loader2 } from "lucide-react";

interface ProfileActionsProps {
  editing: boolean;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileActions({
  editing,
  saving,
  onSave,
  onCancel,
}: ProfileActionsProps) {
  if (!editing) return null;

  return (
    <div className="flex justify-end space-x-3">
      <Button
        variant="outline"
        onClick={onCancel}
        className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
      >
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>
      <Button
        onClick={onSave}
        disabled={saving}
        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white border-0 transition-all duration-200 disabled:opacity-50"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
}
