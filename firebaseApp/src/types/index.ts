/**
 * Central export for all types
 */

export * from './user.types';
export * from './workout.types';

// Common API Response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
