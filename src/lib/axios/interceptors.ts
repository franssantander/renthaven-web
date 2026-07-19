import { toast } from "sonner";

import { axiosClient } from "./client";
import { parseApiError } from "./errors";

axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },

  (error) => {
    return Promise.reject(parseApiError(error));
  },
);

let isRedirectingToLogin = false;

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const apiError = parseApiError(error);
    const requestUrl: string = error?.config?.url ?? "";
    const isLoginRequest = requestUrl.includes("/auth/login");

    switch (apiError.status) {
      case 401:
        if (isLoginRequest) {
          console.warn("Login attempt failed.");
          break;
        }

        console.warn("Session expired or user is unauthenticated.");

        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login" &&
          !isRedirectingToLogin
        ) {
          isRedirectingToLogin = true;
          toast.error("Your session has expired. Please log in again.");
          window.location.assign("/login");
        }
        break;

      case 403:
        console.warn("User is not authorized.");
        break;

      case 422:
        console.warn("Validation error:", apiError.validationErrors);
        break;

      case 429:
        console.warn("Too many requests.");
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        console.error("Server error.");
        break;
    }

    return Promise.reject(apiError);
  },
);
