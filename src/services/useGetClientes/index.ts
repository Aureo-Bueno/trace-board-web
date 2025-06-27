import { useEffect, useState } from "react";
import apiClient from "../client";

export interface Client {
  id: string;
  email: string;
  name: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  address: Address;
  isAdmin: boolean;
}

export interface Address {
  id: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export const useGetClients = () => {
  const [pending, setPending] = useState<boolean>(true);
  const [clients, setClients] = useState<Array<Client>>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      const response = await apiClient.getInstance().get("/user/clients");

      if (response.status !== 200) {
        throw new Error(`Error fetching clients: ${response.statusText}`);
      }
      setClients(response.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { pending, clients, error, refetchClients: fetchClients };
};
