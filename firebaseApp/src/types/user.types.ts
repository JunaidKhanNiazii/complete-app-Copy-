/**
 * User-related TypeScript types
 */

export interface User {
  id: string;
  userId?: number;
  email: string;
  name: string;
  username?: string;
  phone?: string;
  joinDate?: string;
  createdAt?: number;
  images?: string[];
  role?: 'member' | 'admin';
}

export interface Admin {
  adminId: string;
  email: string;
  name: string;
  role: 'admin';
  gymName?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  admin?: Admin;
  error?: string;
}
