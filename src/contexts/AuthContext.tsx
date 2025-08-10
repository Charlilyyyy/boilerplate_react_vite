"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

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

interface User {
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
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

function normalizeUser(raw: any): User {
  const legacyMembership = raw.user_membership;
  const userMembership = raw.userMembership ?? (Array.isArray(legacyMembership) ? legacyMembership[0] : legacyMembership);
  const membershipType = userMembership?.membership_type
    ? (Array.isArray(userMembership.membership_type) ? userMembership.membership_type[0] : userMembership.membership_type)
    : undefined;
  return {
    ...raw,
    userMembership: userMembership ? { ...userMembership, membership_type: membershipType } : undefined,
  } as User;
}

// Mock function to generate a JWT
const generateMockToken = (user: User) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify(user));
    const signature = btoa('mock-signature');
    return `${header}.${payload}.${signature}`;
};

// Hardcoded credentials for demonstration
const MOCK_EMAIL = 'user@example.com';
const MOCK_PASSWORD = 'password123';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        const decodedRaw = jwtDecode<any>(storedToken);
        const normalized = normalizeUser(decodedRaw);
        setUser(normalized);
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
      localStorage.removeItem('authToken');
    }
    setIsLoading(false);
  }, []);

  const internalSetLoginState = (newToken: string) => {
    try {
        const decodedRaw = jwtDecode<any>(newToken);
        const normalized = normalizeUser(decodedRaw);
        localStorage.setItem('authToken', newToken);
        setUser(normalized);
        setToken(newToken);
    } catch (error) {
        console.error("Failed to decode new token on login:", error);
    }
  };

  const login = (email: string, password?: string): boolean => {
    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
        const mockUser: User = {
            id: '0eb9defc-d361-451d-ae19-dc2377065fd9',
            email: 'renter@gmail.com',
            username: 'renter',
            name: 'Renter',
            country: {
                id: '1',
                name: 'Malaysia',
                iso_code: 'MY',
                country_code: '+60',
            },
            phone: '0123456789',
            profile_image_url: '/pub/ada2.png',
            created_at: '2025-06-23T02:19:24.742Z',
            updated_at: '2025-06-23T02:19:24.742Z',
            deleted_at: null,
            userMembership: {
              id: 'b48c7353-8b0a-483e-89e4-ab69aa1d5269',
              membership_type_id: 'aefd4352-9cac-4a2c-99ae-c8c69c6c9653',
              user_id: '8259a119-8255-4140-b3d1-72623e8f32a6',
              is_active: true,
              created_at: '2025-08-09T16:10:12.029Z',
              updated_at: '2025-08-09T16:10:12.029Z',
              membership_type: {
                id: 'aefd4352-9cac-4a2c-99ae-c8c69c6c9653',
                name: 'Normal',
                description: 'normal membership',
                is_active: true,
                created_at: '2025-06-23T04:05:00.770Z',
                updated_at: '2025-06-23T04:05:00.770Z'
              }
            },
            user_roles: [
                {
                    id: '5e738dee-d691-4ecb-8180-e0ab6aa535fb',
                    user_id: '0eb9defc-d361-451d-ae19-dc2377065fd9',
                    role_id: '01824f22-c647-47a9-8fbb-303c4e2a5895',
                    assigned_at: '2025-06-23T02:21:23.348Z',
                    roles: {
                        id: '01824f22-c647-47a9-8fbb-303c4e2a5895',
                        name: 'renter',
                        description: 'for seller or renter',
                        is_active: true,
                        role_permissions: [],
                    },
                },
            ],
        };
        const mockToken = generateMockToken(mockUser);
        internalSetLoginState(mockToken);
        return true;
    }
    return false;
  };

  const loginWithToken = (token: string) => {
    internalSetLoginState(token);
  };

  const ssoLogin = () => {
    // Implement SSO if needed
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
  };
  
  const value = { user, token, login, loginWithToken, ssoLogin, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 