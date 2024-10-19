/* import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/hono"

export const useGetTransaction = (id?: string) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ["transactions", { id }],
        queryFn: async () => {
            const response = await client.api.transactions[":id"].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch transaction");
            }

            const { data } = await response.json();
            return data
        },
    })

    return query
} */

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

interface Transaction {
  accountId: string;
  categoryId: string;
  amount: number;
  date: string;
  payee: string;
  notes: string;
}

export const useGetTransaction = (id?: string) => {
  const query = useQuery<Transaction>({
    enabled: !!id,
    queryKey: ["transactions", { id }],
    queryFn: async (): Promise<Transaction> => {
      const response = await client.api.transactions[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transaction");
      }

      // Extract the `data` field properly
      const { data } = await response.json();

      // Ensure that `data` is typed as `Transaction`
      return data as Transaction;
    },
  });

  return query;
};
