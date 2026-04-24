export interface User {
  id?: number;
  email: string;
  name: string;
  username: string;
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
    access_token: string;
  };
}
