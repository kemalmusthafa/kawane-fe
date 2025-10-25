import { toast } from "sonner";

// Toast notification utility functions for better user feedback

export const toastNotifications = {
  // Success notifications
  success: {
    login: () => toast.success("Successfully logged in!", {
      description: "Welcome back! You can now access all features.",
      duration: 3000,
    }),
    
    logout: () => toast.success("Successfully logged out!", {
      description: "You have been logged out successfully.",
      duration: 2000,
    }),
    
    register: () => toast.success("Account created successfully!", {
      description: "Please check your email to verify your account.",
      duration: 4000,
    }),
    
    addToCart: (productName: string) => toast.success("Added to cart!", {
      description: `${productName} has been added to your cart.`,
      duration: 3000,
    }),
    
    addToWishlist: (productName: string) => toast.success("Added to wishlist!", {
      description: `${productName} has been added to your wishlist.`,
      duration: 3000,
    }),
    
    removeFromWishlist: (productName: string) => toast.success("Removed from wishlist!", {
      description: `${productName} has been removed from your wishlist.`,
      duration: 3000,
    }),
    
    updateProfile: () => toast.success("Profile updated!", {
      description: "Your profile information has been updated successfully.",
      duration: 3000,
    }),
    
    updateAddress: () => toast.success("Address updated!", {
      description: "Your shipping address has been updated.",
      duration: 3000,
    }),
    
    orderCreated: (orderId: string) => toast.success("Order created!", {
      description: `Your order #${orderId} has been created successfully.`,
      duration: 4000,
    }),
    
    paymentSuccess: (amount: number) => toast.success("Payment successful!", {
      description: `Payment of Rp ${amount.toLocaleString("id-ID")} has been processed.`,
      duration: 4000,
    }),
    
    emailSent: () => toast.success("Email sent!", {
      description: "Your message has been sent successfully.",
      duration: 3000,
    }),
  },

  // Error notifications
  error: {
    login: (message?: string) => toast.error("Login failed!", {
      description: message || "Invalid email or password. Please try again.",
      duration: 4000,
    }),
    
    register: (message?: string) => toast.error("Registration failed!", {
      description: message || "Failed to create account. Please try again.",
      duration: 4000,
    }),
    
    addToCart: (message?: string) => toast.error("Failed to add to cart!", {
      description: message || "Unable to add item to cart. Please try again.",
      duration: 4000,
    }),
    
    addToWishlist: (message?: string) => toast.error("Failed to update wishlist!", {
      description: message || "Unable to update wishlist. Please try again.",
      duration: 4000,
    }),
    
    updateProfile: (message?: string) => toast.error("Failed to update profile!", {
      description: message || "Unable to update profile. Please try again.",
      duration: 4000,
    }),
    
    updateAddress: (message?: string) => toast.error("Failed to update address!", {
      description: message || "Unable to update address. Please try again.",
      duration: 4000,
    }),
    
    orderFailed: (message?: string) => toast.error("Order failed!", {
      description: message || "Unable to create order. Please try again.",
      duration: 4000,
    }),
    
    paymentFailed: (message?: string) => toast.error("Payment failed!", {
      description: message || "Payment could not be processed. Please try again.",
      duration: 4000,
    }),
    
    networkError: () => toast.error("Network error!", {
      description: "Please check your internet connection and try again.",
      duration: 4000,
    }),
    
    serverError: () => toast.error("Server error!", {
      description: "Something went wrong on our end. Please try again later.",
      duration: 4000,
    }),
  },

  // Warning notifications
  warning: {
    selectSize: () => toast.warning("Please select a size!", {
      description: "You need to select a size before adding to cart.",
      duration: 3000,
    }),
    
    lowStock: (stock: number) => toast.warning("Low stock!", {
      description: `Only ${stock} items left in stock.`,
      duration: 3000,
    }),
    
    outOfStock: () => toast.warning("Out of stock!", {
      description: "This item is currently out of stock.",
      duration: 3000,
    }),
    
    loginRequired: () => toast.warning("Login required!", {
      description: "Please login to access this feature.",
      duration: 3000,
    }),
    
    emailVerification: () => toast.warning("Email verification required!", {
      description: "Please verify your email address to continue.",
      duration: 4000,
    }),
    
    cartEmpty: () => toast.warning("Cart is empty!", {
      description: "Add some items to your cart before checkout.",
      duration: 3000,
    }),
  },

  // Info notifications
  info: {
    loading: (message: string) => toast.loading(message, {
      description: "Please wait while we process your request.",
      duration: 0, // Loading toasts don't auto-dismiss
    }),
    
    processing: () => toast.info("Processing...", {
      description: "Your request is being processed.",
      duration: 2000,
    }),
    
    saved: () => toast.info("Changes saved!", {
      description: "Your changes have been saved automatically.",
      duration: 2000,
    }),
    
    copied: () => toast.info("Copied to clipboard!", {
      description: "The text has been copied to your clipboard.",
      duration: 2000,
    }),
  },

  // Promise-based notifications
  promise: {
    login: (promise: Promise<any>) => toast.promise(promise, {
      loading: "Logging in...",
      success: "Successfully logged in!",
      error: "Login failed. Please try again.",
    }),
    
    register: (promise: Promise<any>) => toast.promise(promise, {
      loading: "Creating account...",
      success: "Account created successfully!",
      error: "Registration failed. Please try again.",
    }),
    
    addToCart: (promise: Promise<any>) => toast.promise(promise, {
      loading: "Adding to cart...",
      success: "Added to cart!",
      error: "Failed to add to cart.",
    }),
    
    updateProfile: (promise: Promise<any>) => toast.promise(promise, {
      loading: "Updating profile...",
      success: "Profile updated!",
      error: "Failed to update profile.",
    }),
    
    createOrder: (promise: Promise<any>) => toast.promise(promise, {
      loading: "Creating order...",
      success: "Order created successfully!",
      error: "Failed to create order.",
    }),
  },

  // Custom notifications
  custom: {
    success: (title: string, description?: string) => toast.success(title, {
      description,
      duration: 3000,
    }),
    
    error: (title: string, description?: string) => toast.error(title, {
      description,
      duration: 4000,
    }),
    
    warning: (title: string, description?: string) => toast.warning(title, {
      description,
      duration: 3000,
    }),
    
    info: (title: string, description?: string) => toast.info(title, {
      description,
      duration: 3000,
    }),
    
    loading: (title: string, description?: string) => toast.loading(title, {
      description,
      duration: 0,
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
  success: toastSuccess,
  error: toastError,
  warning: toastWarning,
  info: toastInfo,
  promise: toastPromise,
  custom: toastCustom,
  dismiss: toastDismiss,
} = toastNotifications;
