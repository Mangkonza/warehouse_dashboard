import { AppRole } from '@/config/permissions';

export interface User {
  id: string;
  nontriAccount: string;
  email?: string;
  nameTh: string;
  departmentName?: string;
  facultyName?: string;
  typePerson?: string;
  campus?: string;
  role: AppRole;
  isMock?: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  expiresAt: number | null;
  loginWithMock: (role: AppRole) => Promise<void>;
  loginWithCredentials: (
    username: string,
    password: string,
    otp?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoginModalOpen: boolean;
}
