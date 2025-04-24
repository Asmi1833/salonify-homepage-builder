
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'manager' | 'client' | 'staff';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
}

export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session?.user;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  
  if (!user) return null;

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
    role: profileData.role as UserRole,
    profileImage: profileData.profile_image || ''
  };
};

export const hasRole = async (allowedRoles: UserRole | UserRole[]): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;
  
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(user.role);
};

export const logoutUser = async () => {
  await supabase.auth.signOut();
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const userExists = (email: string): boolean => {
  return email.includes('admin') || 
         email.includes('staff') || 
         email.includes('manager') || 
         email.includes('user') ||
         email.includes('example');
};

export const loginUser = (user: User) => {
  localStorage.setItem('salonifyUser', JSON.stringify(user));
};

// Add the missing isSessionExpired function
export const isSessionExpired = (): boolean => {
  try {
    const storedUser = localStorage.getItem('salonifyUser');
    if (!storedUser) return false;
    
    // In a real app with JWT, we would check the token expiration
    // For now, let's just assume sessions never expire automatically
    return false;
  } catch (error) {
    console.error('Error checking session expiration:', error);
    return false;
  }
};

