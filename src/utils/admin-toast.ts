import { toast } from "sonner";

// Admin-specific toast notification utility functions

export const adminToast = {
  // Product Management
  product: {
    create: (productName: string) => toast.success("Product created successfully!", {
      description: `${productName} has been added to the product catalog.`,
      duration: 4000,
    }),
    
    update: (productName: string) => toast.success("Product updated successfully!", {
      description: `${productName} has been updated successfully.`,
      duration: 4000,
    }),
    
    delete: (productName: string) => toast.success("Product deleted successfully!", {
      description: `${productName} has been removed from the catalog.`,
      duration: 4000,
    }),
    
    createError: (error?: string) => toast.error("Failed to create product!", {
      description: error || "Unable to create product. Please try again.",
      duration: 4000,
    }),
    
    updateError: (error?: string) => toast.error("Failed to update product!", {
      description: error || "Unable to update product. Please try again.",
      duration: 4000,
    }),
    
    deleteError: (error?: string) => toast.error("Failed to delete product!", {
      description: error || "Unable to delete product. Please try again.",
      duration: 4000,
    }),
    
    exportSuccess: (count: number) => toast.success("Products exported successfully!", {
      description: `${count} products have been exported to CSV.`,
      duration: 4000,
    }),
    
    exportError: () => toast.error("Export failed!", {
      description: "Unable to export products. Please try again.",
      duration: 4000,
    }),
  },

  // Category Management
  category: {
    create: (categoryName: string) => toast.success("Category created successfully!", {
      description: `${categoryName} has been added to the category list.`,
      duration: 4000,
    }),
    
    update: (categoryName: string) => toast.success("Category updated successfully!", {
      description: `${categoryName} has been updated successfully.`,
      duration: 4000,
    }),
    
    delete: (categoryName: string) => toast.success("Category deleted successfully!", {
      description: `${categoryName} has been removed from the category list.`,
      duration: 4000,
    }),
    
    createError: (error?: string) => toast.error("Failed to create category!", {
      description: error || "Unable to create category. Please try again.",
      duration: 4000,
    }),
    
    updateError: (error?: string) => toast.error("Failed to update category!", {
      description: error || "Unable to update category. Please try again.",
      duration: 4000,
    }),
    
    deleteError: (error?: string) => toast.error("Failed to delete category!", {
      description: error || "Unable to delete category. Please try again.",
      duration: 4000,
    }),
    
    hasProducts: () => toast.warning("Cannot delete category!", {
      description: "This category contains products. Remove all products first.",
      duration: 4000,
    }),
  },

  // Deal Management
  deal: {
    create: (dealTitle: string) => toast.success("Deal created successfully!", {
      description: `${dealTitle} has been added to the deals list.`,
      duration: 4000,
    }),
    
    update: (dealTitle: string) => toast.success("Deal updated successfully!", {
      description: `${dealTitle} has been updated successfully.`,
      duration: 4000,
    }),
    
    delete: (dealTitle: string) => toast.success("Deal deleted successfully!", {
      description: `${dealTitle} has been removed from the deals list.`,
      duration: 4000,
    }),
    
    createError: (error?: string) => toast.error("Failed to create deal!", {
      description: error || "Unable to create deal. Please try again.",
      duration: 4000,
    }),
    
    updateError: (error?: string) => toast.error("Failed to update deal!", {
      description: error || "Unable to update deal. Please try again.",
      duration: 4000,
    }),
    
    deleteError: (error?: string) => toast.error("Failed to delete deal!", {
      description: error || "Unable to delete deal. Please try again.",
      duration: 4000,
    }),
    
    activate: (dealTitle: string) => toast.success("Deal activated!", {
      description: `${dealTitle} is now active and visible to customers.`,
      duration: 4000,
    }),
    
    deactivate: (dealTitle: string) => toast.success("Deal deactivated!", {
      description: `${dealTitle} has been deactivated and is no longer visible.`,
      duration: 4000,
    }),
  },

  // Order Management
  order: {
    updateStatus: (orderId: string, status: string) => toast.success("Order status updated!", {
      description: `Order #${orderId} status has been updated to ${status}.`,
      duration: 4000,
    }),
    
    cancel: (orderId: string) => toast.success("Order cancelled!", {
      description: `Order #${orderId} has been cancelled successfully.`,
      duration: 4000,
    }),
    
    updateStatusError: (error?: string) => toast.error("Failed to update order status!", {
      description: error || "Unable to update order status. Please try again.",
      duration: 4000,
    }),
    
    cancelError: (error?: string) => toast.error("Failed to cancel order!", {
      description: error || "Unable to cancel order. Please try again.",
      duration: 4000,
    }),
  },

  // User Management
  user: {
    update: (userName: string) => toast.success("User updated successfully!", {
      description: `${userName}'s information has been updated.`,
      duration: 4000,
    }),
    
    delete: (userName: string) => toast.success("User deleted successfully!", {
      description: `${userName} has been removed from the system.`,
      duration: 4000,
    }),
    
    updateError: (error?: string) => toast.error("Failed to update user!", {
      description: error || "Unable to update user. Please try again.",
      duration: 4000,
    }),
    
    deleteError: (error?: string) => toast.error("Failed to delete user!", {
      description: error || "Unable to delete user. Please try again.",
      duration: 4000,
    }),
    
    verify: (userName: string) => toast.success("User verified!", {
      description: `${userName} has been verified successfully.`,
      duration: 4000,
    }),
    
    unverify: (userName: string) => toast.success("User unverified!", {
      description: `${userName} has been unverified.`,
      duration: 4000,
    }),
  },

  // Shipment Management
  shipment: {
    create: (trackingNumber: string) => toast.success("Shipment created successfully!", {
      description: `Shipment with tracking number ${trackingNumber} has been created.`,
      duration: 4000,
    }),
    
    update: (trackingNumber: string) => toast.success("Shipment updated successfully!", {
      description: `Shipment ${trackingNumber} has been updated.`,
      duration: 4000,
    }),
    
    delete: (trackingNumber: string) => toast.success("Shipment deleted successfully!", {
      description: `Shipment ${trackingNumber} has been removed.`,
      duration: 4000,
    }),
    
    createError: (error?: string) => toast.error("Failed to create shipment!", {
      description: error || "Unable to create shipment. Please try again.",
      duration: 4000,
    }),
    
    updateError: (error?: string) => toast.error("Failed to update shipment!", {
      description: error || "Unable to update shipment. Please try again.",
      duration: 4000,
    }),
    
    deleteError: (error?: string) => toast.error("Failed to delete shipment!", {
      description: error || "Unable to delete shipment. Please try again.",
      duration: 4000,
    }),
    
    updateStatus: (trackingNumber: string, status: string) => toast.success("Shipment status updated!", {
      description: `Shipment ${trackingNumber} status updated to ${status}.`,
      duration: 4000,
    }),
  },

  // Lookbook Management
  lookbook: {
    create: (photoTitle: string) => toast.success("Lookbook photo added!", {
      description: `${photoTitle} has been added to the lookbook.`,
      duration: 4000,
    }),
    
    update: (photoTitle: string) => toast.success("Lookbook photo updated!", {
      description: `${photoTitle} has been updated successfully.`,
      duration: 4000,
    }),
    
    delete: (photoTitle: string) => toast.success("Lookbook photo deleted!", {
      description: `${photoTitle} has been removed from the lookbook.`,
      duration: 4000,
    }),
    
    createError: (error?: string) => toast.error("Failed to add lookbook photo!", {
      description: error || "Unable to add lookbook photo. Please try again.",
      duration: 4000,
    }),
    
    updateError: (error?: string) => toast.error("Failed to update lookbook photo!", {
      description: error || "Unable to update lookbook photo. Please try again.",
      duration: 4000,
    }),
    
    deleteError: (error?: string) => toast.error("Failed to delete lookbook photo!", {
      description: error || "Unable to delete lookbook photo. Please try again.",
      duration: 4000,
    }),
    
    reorder: () => toast.success("Lookbook order updated!", {
      description: "The lookbook photos have been reordered successfully.",
      duration: 4000,
    }),
    
    reorderError: () => toast.error("Failed to update lookbook order!", {
      description: "Unable to reorder lookbook photos. Please try again.",
      duration: 4000,
    }),
  },

  // Inventory Management
  inventory: {
    update: (productName: string) => toast.success("Inventory updated!", {
      description: `${productName} inventory has been updated successfully.`,
      duration: 4000,
    }),
    
    updateError: (error?: string) => toast.error("Failed to update inventory!", {
      description: error || "Unable to update inventory. Please try again.",
      duration: 4000,
    }),
    
    lowStock: (productName: string, stock: number) => toast.warning("Low stock alert!", {
      description: `${productName} has only ${stock} items left in stock.`,
      duration: 4000,
    }),
    
    outOfStock: (productName: string) => toast.error("Out of stock!", {
      description: `${productName} is now out of stock.`,
      duration: 4000,
    }),
  },

  // General Admin Operations
  general: {
    loading: (operation: string) => toast.loading(`${operation}...`, {
      description: "Please wait while we process your request.",
      duration: 0,
    }),
    
    success: (operation: string, details?: string) => toast.success(`${operation} successful!`, {
      description: details,
      duration: 4000,
    }),
    
    error: (operation: string, details?: string) => toast.error(`${operation} failed!`, {
      description: details || "Please try again.",
      duration: 4000,
    }),
    
    warning: (message: string, details?: string) => toast.warning(message, {
      description: details,
      duration: 4000,
    }),
    
    info: (message: string, details?: string) => toast.info(message, {
      description: details,
      duration: 3000,
    }),
  },

  // Promise-based notifications for async operations
  promise: {
    product: (promise: Promise<any>, operation: string) => toast.promise(promise, {
      loading: `${operation} product...`,
      success: `Product ${operation} successfully!`,
      error: `Failed to ${operation} product.`,
    }),
    
    category: (promise: Promise<any>, operation: string) => toast.promise(promise, {
      loading: `${operation} category...`,
      success: `Category ${operation} successfully!`,
      error: `Failed to ${operation} category.`,
    }),
    
    deal: (promise: Promise<any>, operation: string) => toast.promise(promise, {
      loading: `${operation} deal...`,
      success: `Deal ${operation} successfully!`,
      error: `Failed to ${operation} deal.`,
    }),
    
    order: (promise: Promise<any>, operation: string) => toast.promise(promise, {
      loading: `${operation} order...`,
      success: `Order ${operation} successfully!`,
      error: `Failed to ${operation} order.`,
    }),
    
    user: (promise: Promise<any>, operation: string) => toast.promise(promise, {
      loading: `${operation} user...`,
      success: `User ${operation} successfully!`,
      error: `Failed to ${operation} user.`,
    }),
    
    shipment: (promise: Promise<any>, operation: string) => toast.promise(promise, {
      loading: `${operation} shipment...`,
      success: `Shipment ${operation} successfully!`,
      error: `Failed to ${operation} shipment.`,
    }),
    
    lookbook: (promise: Promise<any>, operation: string) => toast.promise(promise, {
      loading: `${operation} lookbook photo...`,
      success: `Lookbook photo ${operation} successfully!`,
      error: `Failed to ${operation} lookbook photo.`,
    }),
  },

  // Dismiss notifications
  dismiss: (toastId?: string | number) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },
};

// Export individual functions for easier use
export const {
  product: adminProductToast,
  category: adminCategoryToast,
  deal: adminDealToast,
  order: adminOrderToast,
  user: adminUserToast,
  shipment: adminShipmentToast,
  lookbook: adminLookbookToast,
  inventory: adminInventoryToast,
  general: adminGeneralToast,
  promise: adminPromiseToast,
  dismiss: adminDismissToast,
} = adminToast;
