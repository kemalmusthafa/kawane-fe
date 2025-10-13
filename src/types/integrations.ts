// Types untuk external integrations

// Payment Gateway Integration
export interface PaymentGateway {
  id: string;
  name: string;
  type: "midtrans" | "xendit" | "ovo" | "gopay" | "shopeepay";
  isActive: boolean;
  config: PaymentGatewayConfig;
  supportedMethods: PaymentMethod[];
  fees: PaymentFee[];
}

export interface PaymentGatewayConfig {
  merchantId: string;
  apiKey: string;
  secretKey: string;
  environment: "sandbox" | "production";
  webhookUrl?: string;
  callbackUrl?: string;
}

export interface PaymentFee {
  method: PaymentMethod;
  percentage: number;
  fixed: number;
  minAmount: number;
  maxAmount: number;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  gatewayId: string;
  externalId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  gatewayResponse: any;
  createdAt: Date;
  updatedAt: Date;
}

// Shipping Integration
export interface ShippingProvider {
  id: string;
  name: string;
  code: string; // JNE, J&T, SiCepat, dll
  isActive: boolean;
  config: ShippingProviderConfig;
  supportedServices: ShippingService[];
  coverage: ShippingCoverage[];
}

export interface ShippingProviderConfig {
  apiKey: string;
  apiUrl: string;
  username?: string;
  password?: string;
  accountNumber?: string;
}

export interface ShippingService {
  code: string;
  name: string;
  description: string;
  estimatedDays: number;
  isActive: boolean;
}

export interface ShippingCoverage {
  province: string;
  city: string;
  postalCode: string;
  isCovered: boolean;
  estimatedDays: number;
}

export interface ShippingRate {
  providerId: string;
  serviceCode: string;
  origin: string;
  destination: string;
  weight: number;
  cost: number;
  estimatedDays: number;
  isAvailable: boolean;
}

// Email Service Integration
export interface EmailProvider {
  id: string;
  name: string;
  type: "smtp" | "sendgrid" | "mailgun" | "aws-ses";
  isActive: boolean;
  config: EmailProviderConfig;
  templates: EmailTemplate[];
  quotas: EmailQuota;
}

export interface EmailProviderConfig {
  apiKey?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  fromEmail: string;
  fromName: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
}

export interface EmailQuota {
  dailyLimit: number;
  monthlyLimit: number;
  usedToday: number;
  usedThisMonth: number;
  resetDate: Date;
}

// SMS Service Integration
export interface SmsProvider {
  id: string;
  name: string;
  type: "twilio" | "nexmo" | "infobip" | "local";
  isActive: boolean;
  config: SmsProviderConfig;
  quotas: SmsQuota;
}

export interface SmsProviderConfig {
  apiKey: string;
  apiSecret: string;
  fromNumber: string;
  accountSid?: string;
  authToken?: string;
}

export interface SmsQuota {
  dailyLimit: number;
  monthlyLimit: number;
  usedToday: number;
  usedThisMonth: number;
  resetDate: Date;
}

// Social Media Integration
export interface SocialMediaProvider {
  id: string;
  name: string;
  type: "facebook" | "instagram" | "twitter" | "youtube" | "tiktok";
  isActive: boolean;
  config: SocialMediaConfig;
  connectedAccounts: SocialMediaAccount[];
}

export interface SocialMediaConfig {
  appId: string;
  appSecret: string;
  accessToken: string;
  pageId?: string;
  webhookUrl?: string;
}

export interface SocialMediaAccount {
  id: string;
  name: string;
  username: string;
  profilePicture?: string;
  isConnected: boolean;
  lastSync?: Date;
}

// Analytics Integration
export interface AnalyticsProvider {
  id: string;
  name: string;
  type: "google-analytics" | "facebook-pixel" | "hotjar" | "mixpanel";
  isActive: boolean;
  config: AnalyticsConfig;
  trackingEvents: TrackingEvent[];
}

export interface AnalyticsConfig {
  trackingId: string;
  apiKey?: string;
  secretKey?: string;
  measurementId?: string;
}

export interface TrackingEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  isActive: boolean;
}

// Import types yang dibutuhkan
import { PaymentMethod, PaymentStatus } from "./order";
