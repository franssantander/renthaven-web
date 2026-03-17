import { api } from "@/shared/lib/axios";
import { AuthResponse } from "./types";
import { LoginFormValues } from "./schemas";

export const authApi = {
  login: async (credentials: LoginFormValues): Promise<AuthResponse> => {
    const { data } = await api.post("/authentication/login", credentials);
    return data;
  },
  logout: async () => {
    await api.post("/authentication/logout");
  },
};
