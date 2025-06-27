import { useEffect, useState } from "react";
import apiClient from "../client";

export interface Address {
  id: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  userId: string
  zipCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
}

export const useGetAddressByUser = (userId: string) => {
  const [pending, setPending] = useState<boolean>(true);
  const [address, setAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = async () => {
    try {
      const response = await apiClient.getInstance().get(`/address/get-by-user/${userId}`);

      if (response.status !== 200) {
        throw new Error(`Error fetching address: ${response.statusText}`);
      }
      setAddress(response.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  return { pending, address, error, refetchAddress: fetchAddress };
};
