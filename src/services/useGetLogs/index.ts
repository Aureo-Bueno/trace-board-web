import { useEffect, useState } from "react";
import apiClient from "../client";

export interface Log {
  id: string
  type: string
  module: string
  recordId: string
  createdAt: string
}

export const useGetLogsByUserLogged = () => {
  const [pending, setPending] = useState<boolean>(true);
  const [logs, setLogs] = useState<Array<Log>>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const response = await apiClient.getInstance().get("/logs/user-logs");

      if (response.status !== 200) {
        throw new Error(`Error fetching logs: ${response.statusText}`);
      } 
      setLogs(response.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return { pending, logs, error };
};
