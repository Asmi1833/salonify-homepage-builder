
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
