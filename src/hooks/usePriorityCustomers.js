import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import priorityCustomersApi from "../api/priorityCustomers";

export function usePriorityCustomers() {
  const queryClient = useQueryClient();

  const useGetPriorityCustomers = (params = {}) =>
    useQuery({
      queryKey: ["priority-customers", params],
      queryFn: () => priorityCustomersApi.getPriorityCustomers(params),
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000,
    });

  const useGetPriorityCustomerById = (id) =>
    useQuery({
      queryKey: ["priority-customers", id],
      queryFn: () => priorityCustomersApi.getPriorityCustomerById(id),
      enabled: !!id,
      staleTime: 2 * 60 * 1000,
    });

  const useCheckPriorityStatus = (customerId) =>
    useQuery({
      queryKey: ["priority-customers", "status", customerId],
      queryFn: () => priorityCustomersApi.checkPriorityStatus(customerId),
      enabled: !!customerId,
      staleTime: 2 * 60 * 1000,
    });

  const useCreatePriorityCustomer = () =>
    useMutation({
      mutationFn: (payload) =>
        priorityCustomersApi.createPriorityCustomer(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["priority-customers"] });
      },
    });

  const useUpdatePriorityCustomer = () =>
    useMutation({
      mutationFn: ({ id, payload }) =>
        priorityCustomersApi.updatePriorityCustomer(id, payload),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["priority-customers"] });
        if (variables?.id) {
          queryClient.invalidateQueries({
            queryKey: ["priority-customers", variables.id],
          });
        }
      },
    });

  const useDeletePriorityCustomer = () =>
    useMutation({
      mutationFn: (id) => priorityCustomersApi.deletePriorityCustomer(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["priority-customers"] });
      },
    });

  return {
    useGetPriorityCustomers,
    useGetPriorityCustomerById,
    useCheckPriorityStatus,
    useCreatePriorityCustomer,
    useUpdatePriorityCustomer,
    useDeletePriorityCustomer,
  };
}

