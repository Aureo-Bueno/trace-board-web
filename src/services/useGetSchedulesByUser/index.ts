import { useState, useEffect } from "react";
import apiClient from "../client";

export interface Schedule {
  id: string
  status: string
  startTime: string
  room: Room
}

export interface Room {
  id: string
  name: string
}

export const useGetSchedulesByUser = (userId: string) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<Array<Schedule>>([]);

  const getSchedules = async () => {
    setIsPending(true);
    setError(null);
    try {
      const response = await apiClient
        .getInstance()
        .get(`/schedule/get-schedule-user/${userId}`);
      setSchedules(response.data);
    } catch (err) {
      setError("Failed to fetch schedules");
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    getSchedules();
  }, []);

  return { isPending, error, schedules, refetch: getSchedules };
};
