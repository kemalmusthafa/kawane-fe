"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: string;
  orderId?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  sku?: string;
  productName?: string;
  customerEmail?: string;
  customerName?: string;
  status?: string;
}

export const useNotifications = () => {
  const [isSending, setIsSending] = useState(false);

  const sendOrderConfirmation = async (data: NotificationData) => {
    setIsSending(true);
    try {
      const response = await apiClient.sendNotification({
        title: data.title,
        message: data.message,
        type: data.type,
        priority: "normal",
        target: "customer",
      });
      if (response.success) {
        toast.success("Notifikasi konfirmasi pesanan berhasil dikirim");
        return true;
      } else {
        toast.error("Gagal mengirim notifikasi konfirmasi");
        return false;
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim notifikasi");
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const sendStatusUpdate = async (data: NotificationData) => {
    setIsSending(true);
    try {
      const response = await apiClient.sendNotification({
        title: data.title,
        message: data.message,
        type: data.type,
        priority: "normal",
        target: "customer",
      });
      if (response.success) {
        toast.success("Notifikasi update status berhasil dikirim");
        return true;
      } else {
        toast.error("Gagal mengirim notifikasi update status");
        return false;
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim notifikasi");
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const sendShippingNotification = async (
    data: NotificationData & {
      trackingNumber?: string;
      estimatedDelivery?: string;
    }
  ) => {
    setIsSending(true);
    try {
      const response = await apiClient.sendNotification({
        title: data.title,
        message: data.message,
        type: data.type,
        priority: "normal",
        target: "customer",
      });
      if (response.success) {
        toast.success("Notifikasi pengiriman berhasil dikirim");
        return true;
      } else {
        toast.error("Gagal mengirim notifikasi pengiriman");
        return false;
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim notifikasi");
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return {
    isSending,
    sendOrderConfirmation,
    sendStatusUpdate,
    sendShippingNotification,
  };
};
