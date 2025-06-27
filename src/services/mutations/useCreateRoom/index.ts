import apiClient from "@/services/client";
import { useState } from "react";

export const useCreateRoom = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createRoom = async (roomData: any) => {
    setIsPending(true);
    setError(null);
    try {
      const response = await apiClient.getInstance().post(`/room`, roomData);
      if (response.status !== 201) {
        setError("Failed to create room");
        return;
      }
      return response.data;
    } catch (err) {
      setError("Failed to create room");
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, error, createRoom };
};
