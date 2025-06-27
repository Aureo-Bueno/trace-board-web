import apiClient from "@/services/client";
import { useState } from "react";

export const useUpdateUserByUser = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (userData: any) => {
    setIsPending(true);
    setError(null);
    try {
      const response = await apiClient.getInstance().put(`/user/update-profile`, userData);
      if (response.status !== 200) {
        setError("Failed to update user");
        return;
      }
      return response.data;
    } catch (err) {
      setError("Failed to update user");
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, error, updateUser };
};
