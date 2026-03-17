export interface User {
  username: string;
  email: string;
  name: string;
  role: "admin" | "user" | "landlord";
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
