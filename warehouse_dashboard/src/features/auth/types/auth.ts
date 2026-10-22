export interface User {
  id: string;
  nontriAccount: string;
  email?: string;
  nameTh: string;
  departmentName?: string;
  facultyName?: string;
  typePerson?: string;
  role: 'admin' | 'viewer';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  loginWithMock: (role: 'admin' | 'viewer') => Promise<void>;
  loginWithCredentials: (username: string, password: string, otp?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoginModalOpen: boolean;
}
