import { useState, useEffect } from "react";
import apiClient from "../client";

export interface Schedule {
  id: string
  userId: string
  fullNameUser: string
  roomId: string
  status: string
  startTime: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  room: Room
}

export interface Room {
  id: string
  name: string
}


export const useGetSchedules = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<Array<Schedule>>([]);

  const getSchedules = async () => {
    setIsPending(true);
    setError(null);
    try {
      const response = await apiClient
        .getInstance()
        .get(`/schedule/schedules`);
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
