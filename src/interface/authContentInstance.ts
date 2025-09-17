import { createContext } from 'react';

// Define the shape of the user object and the auth context
interface Role {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  role_permissions: unknown[];
}

interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  assigned_at: string;
  roles: Role;
}

interface Country {
  id: string;
  name: string;
  iso_code: string;
  country_code: string;
}

interface MembershipType {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface UserMembership {
  id: string;
  membership_type_id: string;
  user_id: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  membership_type?: MembershipType;
}

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  phone?: string;
  country?: Country;
  profile_image_url?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user_roles?: UserRole[];
  userMembership?: UserMembership; // singular, camelCase
  iat?: number;
  exp?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password?: string) => boolean;
  loginWithToken: (token: string) => void;
  ssoLogin: () => void;
  logout: () => void;
  isLoading: boolean;
}

// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined); 