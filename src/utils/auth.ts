
/**
 * Authentication utility functions
 */

export interface User {
  email: string;
  name: string;
  profileImage: string;
  role?: string;
}

/**
 * Check if user is logged in
 */
export const isAuthenticated = (): boolean => {
  const userData = localStorage.getItem('salonifyUser');
  return !!userData;
};

/**
 * Get current user data
 */
export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem('salonifyUser');
  
  if (!userData) {
    return null;
  }
  
  try {
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Check if user has specific role
 */
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user?.role === role;
};

/**
 * Redirect to login with message if not authenticated
 */
export const requireAuth = (navigate: any, from: string, message: string = "Please login to access this feature"): boolean => {
  if (!isAuthenticated()) {
    navigate('/login', { 
      state: { 
        from,
        message 
      }
    });
    return false;
  }
  return true;
};
