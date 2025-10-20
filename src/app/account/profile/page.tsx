"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/auth-provider";
import { apiClient } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, User } from "lucide-react";
import { toast } from "sonner";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { ProfileInfo } from "@/components/profile/profile-info";
import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileSecurity } from "@/components/profile/profile-security";
import { ProfileActions } from "@/components/profile/profile-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 mb-4">
            Silakan login untuk melihat profil Anda
          </p>
          <Link href="/auth/sign-in">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProfile();
      if (response.success && response.data) {
        setProfile(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone || "",
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await apiClient.updateProfile(formData);
      if (response.success) {
        toast.success("Profile updated successfully");
        setEditing(false);
        await fetchProfile();
        await refreshUser();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setSaving(true);
      const response = await apiClient.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (response.success) {
        toast.success("Password changed successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpdate = async (url: string) => {
    try {
      const response = await apiClient.updateAvatar(url);
      if (response.success) {
        toast.success("Avatar updated successfully!");
        await fetchProfile();
        await refreshUser();
      }
    } catch (error: any) {
      throw error;
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || "",
      });
    }
    setEditing(false);
  };

  const handleFormDataChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load profile</AlertDescription>
        </Alert>
      </div>
    );
  }

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="flex items-center justify-between mb-4 md:mb-8"
        variants={headerVariants}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <div>
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Profile
          </h1>
          <p className="text-[11px] md:text-xs lg:text-sm text-gray-600 dark:text-gray-300">
            Manage your profile information and settings
          </p>
        </div>
        <Button
          onClick={() => setEditing(true)}
          size="sm"
          className="text-[10px] md:text-xs py-1.5 md:py-2 px-2 md:px-3"
        >
          <User className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
          Edit Profile
        </Button>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
        variants={contentVariants}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {/* Left Column - Avatar & Info */}
        <div className="xl:col-span-1">
          <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-fit">
            <CardHeader className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
              <ProfileAvatar
                avatar={profile.avatar || user?.avatar}
                name={profile.name}
                isVerified={profile.isVerified}
                onAvatarUpdate={handleAvatarUpdate}
              />
            </CardHeader>
            <CardContent className="p-3 md:p-4 lg:p-6">
              <ProfileInfo
                name={profile.name}
                role={profile.role}
                isVerified={profile.isVerified}
                createdAt={profile.createdAt}
                updatedAt={profile.updatedAt}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Form & Security */}
        <div className="xl:col-span-2 space-y-3 md:space-y-4 lg:space-y-6">
          <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-3 md:p-4 lg:p-6">
              <ProfileForm
                profile={profile}
                formData={formData}
                editing={editing}
                onFormDataChange={handleFormDataChange}
              />
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-3 md:p-4 lg:p-6">
              <ProfileSecurity
                onPasswordChange={handleChangePassword}
                saving={saving}
              />
            </CardContent>
          </Card>

          {editing && (
            <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-3 md:p-4 lg:p-6">
                <ProfileActions
                  editing={editing}
                  saving={saving}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
