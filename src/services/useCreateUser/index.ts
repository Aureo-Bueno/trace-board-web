import { useState } from "react";
import apiClient from "../client";

export const useCreateUser = () => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreateUser = async (userData: any) => {
    setPending(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await apiClient
        .getInstance()
        .post("/register", userData);

      if (response.data) {
        setSuccess(true);
      } else {
        throw new Error("Failed to create user");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setPending(false);
    }
  };

  return { pending, error, success, handleCreateUser };
};
