import apiClient from "@/services/client";
import { useState } from "react";

export const useCreateSchedule = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createSchedule = async (scheduleData: any) => {
    setIsPending(true);
    setError(null);
    try {
      const response = await apiClient.getInstance().post(`/schedule`, scheduleData);
      if (response.status !== 201) {
        setError("Failed to create schedule");
        return;
      }
      return response.data;
    } catch (err) {
      setError("Failed to create schedule");
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, error, createSchedule };
};
