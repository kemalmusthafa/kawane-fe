/**
 * WhatsApp utility functions
 */

export const getWhatsAppNumber = (): string => {
  // Get WhatsApp number from environment variable
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER;

  if (whatsappNumber && whatsappNumber !== "undefined") {
    // Remove any spaces and ensure it starts with country code
    const cleanedNumber = whatsappNumber.replace(/\s/g, "").replace(/^\+/, "");
    return cleanedNumber;
  }

  // Fallback to default number if not configured
  return process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP_NUMBER || "6281234567890";
};

export const getWhatsAppUrl = (message: string): string => {
  const phoneNumber = getWhatsAppNumber();
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

// Alternative function for mobile devices
export const getWhatsAppMobileUrl = (message: string): string => {
  const phoneNumber = getWhatsAppNumber();
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

// Universal function that detects platform and uses appropriate URL
export const getWhatsAppUniversalUrl = (message: string): string => {
  const phoneNumber = getWhatsAppNumber();
  const encodedMessage = encodeURIComponent(message);

  // Check if user is on mobile device
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Always use wa.me; browser/OS will route to app or web as needed
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

// Enhanced function that tries multiple URL formats for better compatibility
export const getWhatsAppEnhancedUrl = (message: string): string => {
  const phoneNumber = getWhatsAppNumber();
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

// Alternative function using api.whatsapp.com format (sometimes works better)
export const getWhatsAppApiUrl = (message: string): string => {
  const phoneNumber = getWhatsAppNumber();
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

// Most reliable function for desktop WhatsApp - uses the format that works best with WhatsApp Desktop
export const getWhatsAppDesktopUrl = (message: string): string => {
  const phoneNumber = getWhatsAppNumber();
  const encodedMessage = encodeURIComponent(message);

  // Force using wa.me so browser/device chooses the best handler (app or web)
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

export const createOrderMessage = (orderData: {
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt?: string;
  address?: {
    detail: string;
    city: string;
    postalCode: string;
    province: string;
    label?: string;
  };
  items?: Array<{
    product: {
      id?: string;
      name: string;
      images?: Array<{ url: string }>;
      deal?: {
        id: string;
        title: string;
        originalPrice: number;
        discountedPrice: number;
        discountAmount: number;
        discountPercentage: number;
        isFlashSale: boolean;
        endDate: string;
      } | null;
    };
    quantity: number;
    price: number;
    size?: string; // ✅ Added size field
  }>;
}): string => {
  // Try to surface ONE product link at the very top (alone on its own line)
  // so WhatsApp generates a rich link preview (image + title) reliably.
  let firstProductLink: string | null = null;
  if (orderData.items && orderData.items.length > 0) {
    const first = orderData.items.find((it) => (it.product as any).id);
    if (first && (first.product as any).id) {
      // Check if this item has deal information
      if (first.product.deal && first.product.deal.id) {
        // Use deal link instead of product link
        firstProductLink = `${
          process.env.NEXT_PUBLIC_APP_URL || "https://www.kawanestudio.com"
        }/deals/${first.product.deal.id}`;
      } else {
        // Use regular product link
        firstProductLink = `${
          process.env.NEXT_PUBLIC_APP_URL || "https://www.kawanestudio.com"
        }/products/${(first.product as any).id}`;
      }
    }
  }

  let message = ``;
  if (firstProductLink) {
    // Put link on its own line first to trigger preview
    message += `${firstProductLink}\n\n`;
  }

  message += `*PEMBAYARAN ORDER KAWANE STUDIO*\n\n`;
  message += `*Detail Order:*\n`;
  message += `• Order ID: ${orderData.orderNumber}\n`;
  message += `• Total: Rp ${orderData.totalAmount.toLocaleString("id-ID")}\n`;
  message += `• Status: ${orderData.status}`;

  // Add order date if available
  if (orderData.createdAt) {
    const orderDate = new Date(orderData.createdAt).toLocaleDateString(
      "id-ID",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
    message += `\n• Tanggal: ${orderDate}`;
  }

  if (orderData.items && orderData.items.length > 0) {
    message += `\n\n*Items yang dipesan:*`;
    orderData.items.forEach((item, index) => {
      message += `\n\n${index + 1}. *${item.product.name}*`;

      // Add size information if available
      if (item.size) {
        message += `\n   Ukuran: ${item.size}`;
      }

      message += `\n   Qty: ${item.quantity}`;
      message += `\n   Harga: Rp ${(item.price * item.quantity).toLocaleString(
        "id-ID"
      )}`;
      // Keep product link only for the first item (already placed on top) to avoid losing preview
      if ((item.product as any).id && !firstProductLink) {
        // Check if this item has deal information
        if (item.product.deal && item.product.deal.id) {
          message += `\n   Lihat deal: ${
            process.env.NEXT_PUBLIC_APP_URL || "https://www.kawanestudio.com"
          }/deals/${item.product.deal.id}`;
        } else {
          message += `\n   Lihat produk: ${
            process.env.NEXT_PUBLIC_APP_URL || "https://www.kawanestudio.com"
          }/products/${(item.product as any).id}`;
        }
      }
    });
  }

  // Add shipping address if available
  if (orderData.address) {
    message += `\n\n*Alamat Pengiriman:*`;
    message += `\n${orderData.address.detail}`;
    
    // Try to get phone from address, user, or notes
    const addressDataWithExtras = orderData.address as any;
    let addressPhone = addressDataWithExtras?.phone;
    if (!addressPhone && (orderData as any).user?.phone) {
      addressPhone = (orderData as any).user.phone;
    }
    if (!addressPhone && (orderData as any).notes) {
      const phoneMatch = (orderData as any).notes.match(/Phone:\s*([^|]+)/);
      if (phoneMatch) {
        addressPhone = phoneMatch[1].trim();
      }
    }
    if (addressPhone) {
      message += `\nPhone: ${addressPhone}`;
    }
    
    message += `\n${orderData.address.city}, ${orderData.address.postalCode}`;
    message += `\n${orderData.address.province}`;
    
    // Try to get country from address or notes
    let addressCountry = addressDataWithExtras?.country;
    if (!addressCountry && (orderData as any).notes) {
      const countryMatch = (orderData as any).notes.match(/Country:\s*([^|]+)/);
      if (countryMatch) {
        addressCountry = countryMatch[1].trim();
      }
    }
    if (addressCountry && addressCountry !== orderData.address.province) {
      message += `\n${addressCountry}`;
    }
    
    if (orderData.address.label) {
      message += `\n(${orderData.address.label})`;
    }
  }

  message += `\n\n*Mohon bantuan untuk menyelesaikan pembayaran.*`;
  message += `\n*Kawane Studio* - Premium E-commerce`;
  message += `\n\n*Kontak:* +${getWhatsAppNumber()}`;
  message += `\n\nTerima kasih!`;

  return message;
};

export const createCheckoutMessage = (cartData: {
  items: Array<{
    product: {
      name: string;
      images?: Array<{ url: string }>;
      deal?: {
        id: string;
        title: string;
        originalPrice: number;
        discountedPrice: number;
        discountAmount: number;
        discountPercentage: number;
        isFlashSale: boolean;
        endDate: string;
      } | null;
    };
    quantity: number;
    price: number;
    size?: string; // ✅ Added size field
  }>;
  totalAmount: number;
  shippingAddress?: string;
}): string => {
  // Promote first product link to the top to trigger rich preview
  let firstProductLink: string | null = null;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.kawanestudio.com";
  const firstWithId = cartData.items.find((it: any) => (it.product as any)?.id);
  if ((firstWithId as any)?.product?.id) {
    // Check if this item has deal information
    if (
      (firstWithId as any).product.deal &&
      (firstWithId as any).product.deal.id
    ) {
      // Use deal link instead of product link
      firstProductLink = `${appUrl}/deals/${
        (firstWithId as any).product.deal.id
      }`;
    } else {
      // Use regular product link
      firstProductLink = `${appUrl}/products/${
        (firstWithId as any).product.id
      }`;
    }
  }

  let message = ``;
  if (firstProductLink) {
    message += `${firstProductLink}\n\n`;
  }
  message += `*CHECKOUT ORDER KAWANE STUDIO*\n\n`;
  message += `Total: Rp ${cartData.totalAmount.toLocaleString("id-ID")}`;

  if (cartData.items && cartData.items.length > 0) {
    message += `\n\n*Items yang akan dibeli:*`;
    cartData.items.forEach((item, index) => {
      message += `\n\n${index + 1}. *${item.product.name}*`;

      // Add size information if available
      if (item.size) {
        message += `\n   Ukuran: ${item.size}`;
      }

      message += `\n   Qty: ${item.quantity}`;
      message += `\n   Harga: Rp ${(item.price * item.quantity).toLocaleString(
        "id-ID"
      )}`;

      // Keep link only for first product to not break preview
      if ((item as any).product?.id && !firstProductLink) {
        // Check if this item has deal information
        if ((item as any).product?.deal && (item as any).product?.deal?.id) {
          message += `\n   Lihat deal: ${appUrl}/deals/${
            (item as any).product.deal.id
          }`;
        } else {
          message += `\n   Lihat produk: ${appUrl}/products/${
            (item as any).product.id
          }`;
        }
      }
    });
  }

  if (cartData.shippingAddress) {
    message += `\n\n*Alamat Pengiriman:* ${cartData.shippingAddress}`;
  }

  message += `\n\n*Mohon bantuan untuk menyelesaikan checkout.*`;
  message += `\n\nTerima kasih!`;

  return message;
};
