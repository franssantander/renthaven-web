import { api } from "@/shared/lib/axios";
import { LoginFormValues } from "./auth.index";

export const authApi = {
  login: (credentials: LoginFormValues) =>
    api.post("/authentication/login", credentials),
  me: () => api.post("/authentication/me"),
  refreshToken: () => api.post("/authentication/refresh-token"),
  logout: () => api.post("/authentication/logout"),
};
