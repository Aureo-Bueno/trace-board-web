import apiClient from "@/services/client";
import { useState } from "react";

export const useLogout = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setIsPending(true);
    setError(null);
    try {
      const response = await apiClient.getInstance().post(`/logs/logout`);
      if (response.status !== 200) {
        setError("Failed to logout");
        return;
      }
      return response.data;
    } catch (err) {
      setError("Failed to logout");
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, error, logout };
};
