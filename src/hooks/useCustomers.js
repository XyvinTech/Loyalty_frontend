/* eslint-disable no-unused-vars */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import customersApi from "../api/customers";

/**
 * Custom hook for customer management using TanStack Query
 */
export function useCustomers() {
  const queryClient = useQueryClient();

  // Get selected customer ID

  // Get all customers
  const useGetCustomers = (params = {}) => {
    return useQuery({
      queryKey: ["customers", params],
      queryFn: () => customersApi.getCustomers(params),
      staleTime: 2 * 60 * 1000, // 2 minutes
      keepPreviousData: true,
    });
  };

  // Get customer by ID
  const useGetCustomerById = (id) => {
    return useQuery({
      queryKey: ["customers", id],
      queryFn: () => customersApi.getCustomerById(id),
      enabled: !!id,
      staleTime: 2 * 60 * 1000, // 2 minutes
      keepPreviousData: true,
    });
  };

  // Create customer
  const useCreateCustomer = () => {
    return useMutation({
      mutationFn: (customerData) => customersApi.createCustomer(customerData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["customers"] });
      },
    });
  };

  // Update customer
  const useUpdateCustomer = () => {
    return useMutation({
      mutationFn: ({ id, customerData }) =>
        customersApi.updateCustomer(id, customerData),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        queryClient.invalidateQueries({
          queryKey: ["customers", variables.id],
        });
      },
    });
  };

  // Delete customer
  const useDeleteCustomer = () => {
    return useMutation({
      mutationFn: (id) => customersApi.deleteCustomer(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["customers"] });
      },
    });
  };

  // Get customer transactions
  const useGetCustomerTransactions = (customerId, params = {}) => {
    return useQuery({
      queryKey: ["customers", customerId, "transactions", params],
      queryFn: () => customersApi.getCustomerTransactions(customerId, params),
      enabled: !!customerId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Get customer points history
  const useGetCustomerPointsHistory = (customerId, params = {}) => {
    return useQuery({
      queryKey: ["customers", customerId, "points-history", params],
      queryFn: () => customersApi.getCustomerPointsHistory(customerId, params),
      enabled: !!customerId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Get customer tier history
  const useGetCustomerTierHistory = (customerId, params = {}) => {
    return useQuery({
      queryKey: ["customers", customerId, "tier-history", params],
      queryFn: () => customersApi.getCustomerTierHistory(customerId, params),
      enabled: !!customerId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Export customers
  const useExportCustomers = () => {
    return useMutation({
      mutationFn: (params) => customersApi.exportCustomers(params),
    });
  };

  return {
    // UI state actions
  

    // Customers hooks
    useGetCustomers,
    useGetCustomerById,
    useCreateCustomer,
    useUpdateCustomer,
    useDeleteCustomer,

    // Customer details hooks
    useGetCustomerTransactions,
    useGetCustomerPointsHistory,
    useGetCustomerTierHistory,

    // Export hooks
    useExportCustomers,
  };
}

//example for using the useCustomers hook
/**

import { useCustomers } from './useCustomers';

const { useCustomersList, useCustomerById, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } = useCustomers();


const handleCreateCustomer = async (customerData) => {
  try {
    await createCustomer(customerData);
  } catch (error) {
    console.error('Error creating customer:', error);
  }
};

const handleUpdateCustomer = async (customerData) => {
  try {
    await updateCustomer(customerData);
  } catch (error) {
    console.error('Error updating customer:', error);
  }
};

const handleDeleteCustomer = async (customerId) => {
  try {
    await deleteCustomer(customerId);
  } catch (error) {
    console.error('Error deleting customer:', error);
  }
};

  return (
    <div>
        <h1>Customers</h1>
      <div>
        <h2>Customers List</h2>
        {isCustomersLoading ? (
          <p>Loading customers...</p>
        ) : (
          <ul>
            {customers.map((customer) => (
              <li key={customer.id}>{customer.name}</li>
            ))}
          </ul>
        )}
      </div>
        </div>
        <div>
            <h2>Customer Details</h2>
            {isCustomerLoading ? (
                <p>Loading customer...</p>
            ) : (
                <p>{customer.name}</p>
            )}
        </div>
        <div>
            <h2>Create Customer</h2>
            <form onSubmit={handleCreateCustomer}>
                <input type="text" value={customerData.name} onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} />
                <button type="submit">Create Customer</button>
            </form>
        </div>  
  );
};


*/
