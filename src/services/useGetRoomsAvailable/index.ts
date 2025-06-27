import { useEffect, useState } from "react";
import apiClient from "../client";

interface Room {
  id: string;
  name: string;
}

export const useGetRoomsAvailable = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [roomsAvailable, setRoomsAvailable] = useState<Array<Room>>([]);

  const getRoomsAvailable = async () => {
    setIsPending(true);
    setError(null);
    try {
      const response = await apiClient
        .getInstance()
        .get("/room/get-rooms-available");
      setRoomsAvailable(response.data);
    } catch (err) {
      setError("Failed to fetch available rooms");
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    getRoomsAvailable();
  }, []);

  return { isPending, error, roomsAvailable, refetch: getRoomsAvailable };
}