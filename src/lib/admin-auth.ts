// Admin authentication utility
// In a production app, this would check against a backend admin list or role system
// For now, we use a simple password-based approach stored in environment variables

const ADMIN_PASSWORD = import.meta.env.PUBLIC_ADMIN_PASSWORD || 'admin123';

export const isAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('adminAuthenticated') === 'true';
};

export const authenticateAdmin = (password: string): boolean => {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem('adminAuthenticated', 'true');
    return true;
  }
  return false;
};

export const logoutAdmin = (): void => {
  localStorage.removeItem('adminAuthenticated');
};
