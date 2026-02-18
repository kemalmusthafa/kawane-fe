export enum Role {
  CUSTOMER = "CUSTOMER",
  STAFF = "STAFF",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  phone?: string;
  isVerified: boolean;
  token?: string;
  tokenExpiresIn?: Date;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  role: Role;
}

export interface UserCreatePayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UserUpdatePayload {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  user: User;
  token: string;
}

export interface Address {
  id: string;
  userId: string;
  label?: string;
  detail: string;
  city: string;
  province: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddressCreatePayload {
  label?: string;
  detail: string;
  city: string;
  province: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface AddressUpdatePayload {
  label?: string;
  detail?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}
