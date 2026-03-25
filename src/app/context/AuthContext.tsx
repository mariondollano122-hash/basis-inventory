import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllUsers, updateUser, initializeUsers, User as DBUser } from '../data/users';

export type Department = 
  | 'Health' 
  | 'Education' 
  | 'Justice' 
  | 'Appropriation' 
  | 'Peace and Order' 
  | 'Sports' 
  | 'Agriculture' 
  | 'Infrastructure';

export type Role = 'Barangay Captain' | 'Secretary' | 'Committee Head';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: Role;
  department?: Department; // Optional for Captain and Secretary
  email: string;
  contactNumber: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  canEdit: () => boolean;
  canPrint: () => boolean;
  canAccessAllCommittees: () => boolean;
  canAccessCommittee: (committee: Department) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Initialize users database on mount
  useEffect(() => {
    initializeUsers();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const users = getAllUsers();
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );
    
    if (foundUser) {
      // Update last login timestamp
      const now = new Date().toISOString();
      updateUser(foundUser.id, { lastLogin: now });
      
      setUser({
        id: foundUser.id,
        username: foundUser.username,
        fullName: foundUser.fullName,
        role: foundUser.role,
        department: foundUser.department,
        email: foundUser.email,
        contactNumber: foundUser.contactNumber,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  // Permission helpers
  const canEdit = (): boolean => {
    if (!user) return false;
    // Only Secretary and Committee Heads can edit (Captain is view-only)
    return user.role === 'Secretary' || user.role === 'Committee Head';
  };

  const canPrint = (): boolean => {
    if (!user) return false;
    // Only Secretary can print
    return user.role === 'Secretary';
  };

  const canAccessAllCommittees = (): boolean => {
    if (!user) return false;
    // Captain and Secretary can access all committees
    return user.role === 'Barangay Captain' || user.role === 'Secretary';
  };

  const canAccessCommittee = (committee: Department): boolean => {
    if (!user) return false;
    // Captain and Secretary can access all
    if (user.role === 'Barangay Captain' || user.role === 'Secretary') return true;
    // Committee heads can only access their committee
    return user.role === 'Committee Head' && user.department === committee;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, canEdit, canPrint, canAccessAllCommittees, canAccessCommittee }}>
      {children}
    </AuthContext.Provider>
  );
};