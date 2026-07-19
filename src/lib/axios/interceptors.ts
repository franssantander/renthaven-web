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

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const apiError = parseApiError(error);

    switch (apiError.status) {
      case 401:
        console.warn("User is unauthenticated.");
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
