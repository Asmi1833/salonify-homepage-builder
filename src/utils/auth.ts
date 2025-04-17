
/**
 * Authentication utility functions
 */

export type UserRole = 'admin' | 'manager' | 'client' | 'staff';

export interface User {
  id?: string;
  email: string;
  name: string;
  profileImage: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt?: string;
  lastLogin?: string;
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
export const hasRole = (role: UserRole | UserRole[]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  
  return user.role === role;
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
    lastLogin: new Date().toISOString(),
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

/**
 * Check if a user with the given email exists (for demo purposes)
 * This simulates a check against a database
 */
export const userExists = (email: string): boolean => {
  if (!email) return false;
  
  // For demo purposes, we're checking if the email includes specific keywords
  // In a real app, this would check against your backend database
  return email.includes('admin') || 
         email.includes('staff') || 
         email.includes('manager') || 
         email.includes('user') ||
         email.includes('client') ||
         email.includes('test');
};
