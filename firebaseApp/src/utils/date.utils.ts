/**
 * Date utility functions
 */

/**
 * Format date to YYYY-MM-DD
 */
export const formatDate = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Get date range for period
 */
export const getDateRange = (period: 'daily' | 'weekly' | 'monthly') => {
  const endDate = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'daily':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'weekly':
      startDate.setDate(endDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'monthly':
      startDate.setDate(endDate.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
      break;
  }
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

/**
 * Format relative time (e.g., "5m ago", "2h ago")
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = new Date().getTime();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return new Date(timestamp).toLocaleDateString();
};

/**
 * Get current date formatted
 */
export const getCurrentDate = (): string => {
  const date = new Date();
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

/**
 * Get day of week initial
 */
export const getDayInitial = (dateStr: string): string => {
  const date = new Date(dateStr);
  return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];
};
