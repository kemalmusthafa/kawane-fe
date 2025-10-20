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
    };
    quantity: number;
    price: number;
    size?: string; // ✅ Added size field
  }>;
}): string => {
  let message = ` *PEMBAYARAN ORDER KAWANE STUDIO* 

📋 *Detail Order:*
Order ID: ${orderData.orderNumber} 
Total: Rp ${orderData.totalAmount.toLocaleString("id-ID")}
Status: ${orderData.status}`;

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
    message += `\nTanggal: ${orderDate}`;
  }

  if (orderData.items && orderData.items.length > 0) {
    message += `\n\n📦 *Items yang dipesan:*`;
    orderData.items.forEach((item, index) => {
      message += `\n\n${index + 1}. *${item.product.name}*`;

      // Add size information if available
      if (item.size) {
        message += `\n   Ukuran: ${item.size}`;
      }

      message += `\n   Qty: ${item.quantity}`;
      message += `\n   Harga: Rp ${item.price.toLocaleString("id-ID")}`;

      // Include product link for better WhatsApp preview
      // WhatsApp will show image preview if the product page has proper Open Graph metadata
      if ((item.product as any).id) {
        message += `\n   🔗 Lihat produk: ${
          process.env.NEXT_PUBLIC_APP_URL || "https://kawane-fe.vercel.app"
        }/products/${(item.product as any).id}`;
      }
    });
  }

  // Add shipping address if available
  if (orderData.address) {
    message += `\n\n📍 *Alamat Pengiriman:*`;
    message += `\n${orderData.address.detail}`;
    message += `\n${orderData.address.city}, ${orderData.address.province}`;
    message += `\n${orderData.address.postalCode}`;
    if (orderData.address.label) {
      message += `\n(${orderData.address.label})`;
    }
  }

  message += `\n\n💬 *Mohon bantuan untuk menyelesaikan pembayaran.*`;
  message += `\n🏪 *Kawane Studio* - Premium E-commerce`;
  message += `\n\n📞 *Kontak:* +${getWhatsAppNumber()}`;
  message += `\n\nTerima kasih! 🙏`;

  return message;
};

export const createCheckoutMessage = (cartData: {
  items: Array<{
    product: {
      name: string;
      images?: Array<{ url: string }>;
    };
    quantity: number;
    price: number;
    size?: string; // ✅ Added size field
  }>;
  totalAmount: number;
  shippingAddress?: string;
}): string => {
  let message = `🛒 *CHECKOUT ORDER KAWANE STUDIO* 🛒

💰 Total: Rp ${cartData.totalAmount.toLocaleString("id-ID")}`;

  if (cartData.items && cartData.items.length > 0) {
    message += `\n\n📦 *Items yang akan dibeli:*`;
    cartData.items.forEach((item, index) => {
      message += `\n\n${index + 1}. *${item.product.name}*`;

      // Add size information if available
      if (item.size) {
        message += `\n   Ukuran: ${item.size}`;
      }

      message += `\n   Qty: ${item.quantity}`;
      message += `\n   Harga: Rp ${item.price.toLocaleString("id-ID")}`;

      // Include product link for better WhatsApp preview
      // WhatsApp will show image preview if the product page has proper Open Graph metadata
      if ((item.product as any).id) {
        message += `\n   🔗 Lihat produk: ${
          process.env.NEXT_PUBLIC_APP_URL || "https://kawane-fe.vercel.app"
        }/products/${(item.product as any).id}`;
      }
    });
  }

  if (cartData.shippingAddress) {
    message += `\n\n📍 *Alamat Pengiriman:* ${cartData.shippingAddress}`;
  }

  message += `\n\n💬 *Mohon bantuan untuk menyelesaikan checkout.*`;
  message += `\n\nTerima kasih! 🙏`;

  return message;
};
