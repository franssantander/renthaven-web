export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "tenant";
}

export interface AuthState {
  user: User | null;
  isAuth: boolean;
  setAuth: (user: User) => void;
  clearAuth: () => void;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    user: User;
  };
}
