"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, CheckCircle, AlertCircle } from "lucide-react";

interface ProfileFormProps {
  profile: {
    name: string;
    email: string;
    phone?: string;
    isVerified: boolean;
  };
  formData: {
    name: string;
    email: string;
    phone: string;
  };
  editing: boolean;
  onFormDataChange: (field: string, value: string) => void;
}

export function ProfileForm({
  profile,
  formData,
  editing,
  onFormDataChange,
}: ProfileFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Profile Information
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="group">
          <Label
            htmlFor="name"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
          >
            <User className="h-4 w-4" />
            Full Name
          </Label>
          {editing ? (
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onFormDataChange("name", e.target.value)}
              placeholder="Enter your full name"
              className="border-gray-300 focus:border-gray-400 focus:ring-gray-400 transition-colors"
            />
          ) : (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 group-hover:border-gray-300 dark:group-hover:border-gray-600 transition-colors">
              <p className="text-sm text-gray-900 dark:text-gray-100 font-medium break-words">
                {profile.name}
              </p>
            </div>
          )}
        </div>

        {/* Email Field */}
        <div className="group">
          <Label
            htmlFor="email"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
          >
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Email Address</span>
            {profile.isVerified && (
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            )}
          </Label>
          {editing ? (
            <div className="space-y-3">
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => onFormDataChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  className="border-gray-300 focus:border-gray-400 focus:ring-gray-400 transition-colors pr-10"
                />
                {profile.isVerified && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>
              {formData.email !== profile.email && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <AlertDescription className="text-amber-800 text-sm">
                    Changing your email will require verification. You will
                    receive a verification email.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 group-hover:border-gray-300 dark:group-hover:border-gray-600 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-sm text-gray-900 dark:text-gray-100 font-medium break-words overflow-wrap-anywhere">
                  {profile.email}
                </p>
                {profile.isVerified && (
                  <Badge
                    variant="outline"
                    className="text-gray-600 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0 w-fit"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span className="hidden xs:inline">Verified</span>
                    <span className="xs:hidden">✓</span>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Field */}
        <div className="group">
          <Label
            htmlFor="phone"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
          >
            <Phone className="h-4 w-4" />
            Phone Number
          </Label>
          {editing ? (
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onFormDataChange("phone", e.target.value)}
              placeholder="Enter your phone number"
              className="border-gray-300 focus:border-gray-400 focus:ring-gray-400 transition-colors"
            />
          ) : (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 group-hover:border-gray-300 dark:group-hover:border-gray-600 transition-colors">
              <p className="text-sm text-gray-900 dark:text-gray-100 font-medium break-words">
                {profile.phone || "Not provided"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
