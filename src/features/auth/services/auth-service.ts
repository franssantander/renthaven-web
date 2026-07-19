import { axiosClient } from "@/lib/axios";

export const authService = {
  login(data: { username: string; password: string }) {
    return axiosClient.post("/login", data);
  },
  logout() {
    return axiosClient.post("/logout");
  },
  getCurrentUser() {
    return axiosClient.get("/");
  },
};
