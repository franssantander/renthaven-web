import axios from "axios";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    const excludeStatus = [400, 422];

    if (status === 401) {
      useAuthStore.getState().clearAuth();

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }

    if (status === 403)
      return toast.error("You do not have permision to perform this action", {
        position: "top-center",
      });

    if (status === 500)
      return toast.error("A server error occured. Please try again later.", {
        position: "top-center",
      });

    if (message && !excludeStatus.includes(status))
      return toast.error(message, { position: "top-center" });

    return Promise.reject(error);
  },
);
