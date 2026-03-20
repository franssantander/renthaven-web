export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: "superadmin" | "admin" | "tenant";
}

export interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    access_token: string;
    user: User;
  };
}
