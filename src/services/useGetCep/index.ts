import axios from "axios";
import { useState } from "react";

export interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export const useGetCep = () => {
  const [pending, setPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const getCep = async (cep: string) => {
    try {
      setPending(true);
      setIsError(false);
      const response = await axios.get<CepResponse>(
        `https://viacep.com.br/ws/${cep}/json/`
      );
      return response.data;
    } catch (error) {
      setIsError(true);
      throw error;
    } finally {
      setPending(false);
    }
  };

  return { getCep, pending, isError };
};
