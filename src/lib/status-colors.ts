// Status Color Scheme - Consistent across the application

export const ORDER_STATUS_COLORS = {
  // Completed/Delivered states
  delivered:
    "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",
  completed:
    "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",

  // Pending states
  pending:
    "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  PENDING:
    "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",

  // In progress states
  shipped:
    "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  SHIPPED:
    "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800",

  // Payment received but not delivered
  paid: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  PAID: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",

  // Initial/Processing states
  checkout:
    "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  CHECKOUT:
    "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",

  // Failed/Cancelled states
  cancelled:
    "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800",
  CANCELLED:
    "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800",

  // Default/Unknown states
  default:
    "bg-gray-100 dark:bg-gray-800/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
} as const;

export const PAYMENT_STATUS_COLORS = {
  // Successful payment
  succeeded:
    "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",
  SUCCEEDED:
    "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",
  paid: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",

  // Pending payment
  pending:
    "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  PENDING:
    "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",

  // Failed payment
  failed:
    "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800",
  FAILED:
    "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800",

  // Cancelled payment
  cancelled:
    "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  CANCELLED:
    "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800",

  // Refunded payment
  refunded:
    "bg-gray-100 dark:bg-gray-800/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
  REFUNDED:
    "bg-gray-100 dark:bg-gray-800/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",

  // Expired payment
  expired:
    "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800",
  EXPIRED:
    "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800",

  // Default/Unknown states
  default:
    "bg-gray-100 dark:bg-gray-800/20 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
} as const;

// Helper functions for consistent status badge creation
export const getOrderStatusColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  return (
    ORDER_STATUS_COLORS[normalizedStatus as keyof typeof ORDER_STATUS_COLORS] ||
    ORDER_STATUS_COLORS.default
  );
};

export const getPaymentStatusColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  return (
    PAYMENT_STATUS_COLORS[
      normalizedStatus as keyof typeof PAYMENT_STATUS_COLORS
    ] || PAYMENT_STATUS_COLORS.default
  );
};

// Status display text mapping
export const ORDER_STATUS_LABELS = {
  delivered: "Delivered",
  completed: "Completed",
  pending: "Pending",
  PENDING: "Pending",
  shipped: "Shipped",
  SHIPPED: "Shipped",
  paid: "Paid",
  PAID: "Paid",
  checkout: "Checkout",
  CHECKOUT: "Checkout",
  cancelled: "Cancelled",
  CANCELLED: "Cancelled",
} as const;

export const PAYMENT_STATUS_LABELS = {
  succeeded: "Succeeded",
  SUCCEEDED: "Succeeded",
  paid: "Paid",
  pending: "Pending",
  PENDING: "Pending",
  failed: "Failed",
  FAILED: "Failed",
  cancelled: "Cancelled",
  CANCELLED: "Cancelled",
  refunded: "Refunded",
  REFUNDED: "Refunded",
  expired: "Expired",
  EXPIRED: "Expired",
} as const;

export const getOrderStatusLabel = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  return (
    ORDER_STATUS_LABELS[normalizedStatus as keyof typeof ORDER_STATUS_LABELS] ||
    status
  );
};

export const getPaymentStatusLabel = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  return (
    PAYMENT_STATUS_LABELS[
      normalizedStatus as keyof typeof PAYMENT_STATUS_LABELS
    ] || status
  );
};
