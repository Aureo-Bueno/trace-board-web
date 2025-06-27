import { useEffect, useState } from "react";
import apiClient from "../client";

export interface Logs {
  id: string;
  actionType: string;
  tableName: string;
  recordId: string;
  createdAt: string;
  user: User;
  ipAddress: any;
}

export interface User {
  id: string;
  name: string;
  lastName: string;
}

export const useGetAllLogs = () => {
  const [pending, setPending] = useState<boolean>(true);
  const [logs, setLogs] = useState<Array<Logs>>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const response = await apiClient.getInstance().get("/logs");

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
