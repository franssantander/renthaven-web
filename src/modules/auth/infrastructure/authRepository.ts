import axios from "axios";
import { LoginCredentials } from "../domain/login.schema";
import { apiClient } from "@/core/api/apiClient";

export const authRepository = {
  getCsrfToken: async () => {
    const rootUrl =
      typeof window === "undefined"
        ? "http://renthaven-api"
        : "http://localhost:81";
    return axios.get(`${rootUrl}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  },
  login: async (credentials: LoginCredentials) => {
    await authRepository.getCsrfToken();
    const { data } = await apiClient.post("/login", credentials);
    return data;
  },
  me: async () => {
    const { data } = await apiClient.get("/user");
    return data;
  },
  logout: async () => {
    await apiClient.post("/logout");
  },
};
