import apiClient from "@/services/client";
import { useState } from "react";

export const useCancelScheduleByUser = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cancelSchedule = async (scheduleId: string) => {
    setIsPending(true);
    setError(null);
    try {
      const response = await apiClient.getInstance().put(`/schedule`, {
        id: scheduleId,
      });

      if (response.status !== 200) {
        throw new Error("Failed to cancel schedule");
      }
      return response.data;
    } catch (err) {
      setError("Failed to cancel schedule");
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, error, cancelSchedule };
};
