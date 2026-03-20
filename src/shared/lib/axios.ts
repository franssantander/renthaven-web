import axios from "axios";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response.data,
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

      return Promise.reject(error);
    }

    if (status === 403) {
      toast.error("You do not have permission to perform this action.");
      return Promise.reject(error);
    }

    if (status === 500) {
      toast.error("A server error occurred. Please try again later.");
      return Promise.reject(error);
    }

    if (message && !excludeStatus.includes(status)) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);
