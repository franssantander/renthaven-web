import axios from "axios";

const isServer = typeof window === "undefined";

export const apiClient = axios.create({
  baseURL: isServer ? "http://renthaven-api/api" : "http://localhost:81/api",
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!isServer) window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
