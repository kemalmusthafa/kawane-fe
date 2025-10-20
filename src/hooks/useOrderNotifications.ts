import { useOrders } from "./useApi";
import { useNotifications } from "./useApi";
import { useEffect } from "react";
import { toast } from "sonner";

export const useOrderNotifications = () => {
  const { orders, mutateOrders } = useOrders();
  const { notifications, mutateNotifications } = useNotifications();

  // Function to create order-related notifications
  const createOrderNotification = async (orderData: {
    orderId: string;
    orderNumber: string;
    status: string;
    type:
      | "order_created"
      | "order_updated"
      | "order_cancelled"
      | "payment_received"
      | "order_shipped"
      | "order_delivered";
  }) => {
    try {
      // This would typically call an API to create notification
      // For now, we'll just show a toast and refresh notifications
      const messages = {
        order_created: `Order #${orderData.orderNumber} has been created successfully`,
        order_updated: `Order #${orderData.orderNumber} status updated to ${orderData.status}`,
        order_cancelled: `Order #${orderData.orderNumber} has been cancelled`,
        payment_received: `Payment received for Order #${orderData.orderNumber}`,
        order_shipped: `Order #${orderData.orderNumber} has been shipped`,
        order_delivered: `Order #${orderData.orderNumber} has been delivered`,
      };

      toast.success(messages[orderData.type] || "Order notification");

      // Refresh notifications
      mutateNotifications();
    } catch (error) {
      console.error("Failed to create order notification:", error);
    }
  };

  // Function to get order-related notifications
  const getOrderNotifications = () => {
    return notifications.filter(
      (notification: any) =>
        notification.type === "order" ||
        notification.type === "payment" ||
        notification.type === "shipping"
    );
  };

  // Function to get unread order notifications count
  const getUnreadOrderNotificationsCount = () => {
    return getOrderNotifications().filter(
      (notification: any) => !notification.isRead
    ).length;
  };

  return {
    orders,
    orderNotifications: getOrderNotifications(),
    unreadOrderNotificationsCount: getUnreadOrderNotificationsCount(),
    createOrderNotification,
    mutateOrders,
    mutateNotifications,
  };
};
