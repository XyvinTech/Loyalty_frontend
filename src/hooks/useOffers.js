/* eslint-disable no-unused-vars */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import offersApi from "../api/offers";

export function useOffers() {
  const queryClient = useQueryClient();

  const useCreateMerchantOffer = () => {
    return useMutation({
      mutationFn: (offerData) => offersApi.createMerchantOffer(offerData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["merchantOffersList"] });
        queryClient.invalidateQueries({ queryKey: ["activeOffers"] });
      },
    });
  };

  const useCreateBulkMerchantOffer = () => {
    return useMutation({
      mutationFn: (offerData) => offersApi.createBulkMerchantOffer(offerData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["merchantOffersList"] });
        queryClient.invalidateQueries({ queryKey: ["activeOffers"] });
      },
    });
  };

  const getMerchantOffers = (params) => {
    return useQuery({
      queryKey: ["merchantOffersList", params],
      queryFn: () => offersApi.getMerchantOffers(params),
    });
  };

  const offerById = (id) => {
    return useQuery({
      queryKey: ["merchantOfferDetail", id],
      queryFn: () => offersApi.getMerchantOfferById(id),
      enabled: !!id,
      staleTime: 0, // Always fresh for details
    });
  };

  const updateMerchantOffer = () => {
    return useMutation({
      mutationFn: ({ id, offerData }) =>
        offersApi.updateMerchantOffer(id, offerData),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["merchantOffersList"] });
        queryClient.invalidateQueries({
          queryKey: ["merchantOfferDetail", variables.id],
        });
      },
    });
  };

  const deleteMerchantOffer = () => {
    return useMutation({
      mutationFn: (id) => offersApi.deleteMerchantOffer(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["merchantOffersList"] });
      },
    });
  };

  return {
    useCreateMerchantOffer,
    getMerchantOffers,
    offerById,
    updateMerchantOffer,
    deleteMerchantOffer,
    useCreateBulkMerchantOffer,
  };
}
