import axios, { AxiosInstance } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_HOST as string,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );
  }

  setToken(token?: string) {
    let finalToken = token;
    if (!finalToken) {
      try {
        finalToken = useAuthStore.getState().token || undefined;
      } catch {
        finalToken = undefined;
      }
    }
    if (finalToken) {
      this.client.defaults.headers.common["Authorization"] = `Bearer ${finalToken}`;
    } else {
      delete this.client.defaults.headers.common["Authorization"];
    }
  }

  getToken() {
    return this.client.defaults.headers.common["Authorization"];
  }

  getInstance(): AxiosInstance {
    return this.client;
  }
}

const apiClient = new ApiClient();
export default apiClient;
