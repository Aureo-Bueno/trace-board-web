import apiClient from "@/services/client";
import { useState } from "react";

export const useCreateScheduleByUser = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createSchedule = async (scheduleData: any) => {
    setIsPending(true);
    setError(null);
    try {
      const response = await apiClient
        .getInstance()
        .post("/schedule/create-schedule-by-user", scheduleData);

      if (response.status !== 201) {
        throw new Error("Failed to create schedule");
      }
      return response.data;
    } catch (err) {
      setError("Failed to create schedule");
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, error, createSchedule };
};
