export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "textarea"
    | "checkbox"
    | "radio"
    | "file";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: "required" | "minLength" | "maxLength" | "pattern" | "custom";
  value?: any;
  message: string;
}

export interface FormState<T = any> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormAction {
  type:
    | "SET_VALUE"
    | "SET_ERROR"
    | "SET_TOUCHED"
    | "SET_SUBMITTING"
    | "RESET"
    | "SET_VALID";
  field?: string;
  value?: any;
  errors?: Record<string, string>;
}

// Common form interfaces
export interface SearchForm {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterForm {
  categories: string[];
  priceRange: [number, number];
  brands: string[];
  availability: "inStock" | "outOfStock" | "all";
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterForm {
  email: string;
  preferences?: string[];
}

export interface ReviewForm {
  rating: number;
  comment: string;
  productId: string;
}

export interface FeedbackForm {
  type: "bug" | "feature" | "general";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  contactEmail?: string;
}
