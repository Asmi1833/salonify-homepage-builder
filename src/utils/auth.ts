
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'manager' | 'client' | 'staff';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
}

/**
 * Check if user is authenticated with Supabase
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session?.user;
};

/**
 * Get current user data from Supabase
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  
  if (!user) return null;

  // Fetch additional user profile data
  const { data: profileData, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profileData) return null;

  return {
    id: user.id,
    email: user.email || '',
    name: profileData.name,
    role: profileData.role,
    profileImage: profileData.profile_image || ''
  };
};

/**
 * Check if user has specific role
 */
export const hasRole = async (allowedRoles: UserRole | UserRole[]): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;
  
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(user.role);
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  await supabase.auth.signOut();
};

/**
 * Check if login session is expired
 */
export const isSessionExpired = (): boolean => {
  const expiryStr = localStorage.getItem('supabase.auth.token.expires_at');
  if (!expiryStr) return true;

  const expiryTime = parseInt(expiryStr, 10);
  return Date.now() >= expiryTime;
};

/**
 * Login user and store their data
 */
export const loginUser = (user: User) => {
  localStorage.setItem('salonifyUser', JSON.stringify({
    ...user,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 // 24 hours expiration
  }));
};

/**
 * Check if a user with given email exists
 */
export const userExists = (email: string): boolean => {
  // In a real app, this would check the database
  // For demo purposes, we'll consider certain email patterns exist
  return email.includes('admin') || 
         email.includes('staff') || 
         email.includes('manager') || 
         email.includes('user') ||
         email.includes('example');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password requirements
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Require auth for a route and redirect if not authenticated
 */
export const requireAuth = (
  navigate: (path: string, state?: any) => void,
  redirectTo: string,
  message: string
): boolean => {
  if (!isAuthenticated()) {
    navigate('/login', { 
      state: { 
        from: redirectTo,
        message 
      }
    });
    return false;
  }
  return true;
};

