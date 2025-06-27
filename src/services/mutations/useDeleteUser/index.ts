import apiClient from "@/services/client";
import { useState } from "react";

export const useDeleteUser = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (userId: string, currentStatus: boolean) => {
    setIsPending(true);
    setError(null);
    try {
      const response = await apiClient
        .getInstance()
        .put(`/user/${userId}/delete`, { status: currentStatus });
      if (response.status !== 200) {
        setError("Failed to delete user");
        return;
      }
      return response.data;
    } catch (err) {
      setError("Failed to delete user");
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, error, deleteUser };
};
