
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

/**
 * Login user and store data in localStorage with expiration
 */
export const loginUser = (userData: User): void => {
  // Set expiration to 30 days from now
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);
  
  const userDataWithExpiration = {
    ...userData,
    expiration: expirationDate.getTime()
  };
  
  localStorage.setItem('salonifyUser', JSON.stringify(userDataWithExpiration));
};

/**
 * Check if user's session is expired
 */
export const isSessionExpired = (): boolean => {
  const userData = localStorage.getItem('salonifyUser');
  
  if (!userData) {
    return true;
  }
  
  try {
    const parsedData = JSON.parse(userData);
    const expiration = parsedData.expiration;
    
    if (!expiration) {
      return false; // No expiration set (legacy data)
    }
    
    return Date.now() > expiration;
  } catch (error) {
    console.error('Error checking session expiration:', error);
    return true;
  }
};

/**
 * Logout user by removing data from localStorage
 */
export const logoutUser = (): void => {
  localStorage.removeItem('salonifyUser');
};
