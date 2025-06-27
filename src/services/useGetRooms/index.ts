import { useState, useEffect } from "react";
import apiClient from "../client";

export interface Room {
  id: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  name: string;
  capacity: number;
  location: string;
  status: string;
}

export const useGetRooms = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Array<Room>>([]);

  const getRooms = async () => {
    setIsPending(true);
    setError(null);
    try {
      const response = await apiClient.getInstance().get(`/room`);
      console.log("Response:", response);

      if (response.status !== 200) {
        setError("Failed to fetch rooms");
        return;
      }
      setRooms(response.data);
    } catch (err) {
      setError("Failed to fetch rooms");
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  return { isPending, error, rooms };
};
