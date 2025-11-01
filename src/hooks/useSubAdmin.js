import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import subAdminApi from "../api/sub-admin";
export function useSubAdmin() {
  const queryClient = useQueryClient();
  const useGetSubAdmin = (params) => {
    return useQuery({
      queryKey: ["subAdmins", params],
      queryFn: () => subAdminApi.getSubAdmin(params),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const useGetSubAdminById = (id) => {
    return useQuery({
      queryKey: ["subAdmins", id],
      queryFn: () => subAdminApi.getSubAdminById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const useCreateSubAdmin = () => {
    return useMutation({
      mutationFn: (formData) => subAdminApi.createSubAdmin(formData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subAdmins"] });
      },
    });
  };

  const useUpdateSubAdmin = () => {
    return useMutation({
      mutationFn: ({ id, formData }) =>
        subAdminApi.updateSubAdmin(id, formData),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["subAdmins"] });
        queryClient.invalidateQueries({
          queryKey: ["subAdmins", variables.id],
        });
      },
    });
  };

  const useDeleteSubAdmin = () => {
    return useMutation({
      mutationFn: (id) => subAdminApi.deleteSubAdmin(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subAdmins"] });
      },
    });
  };

  // Password Change Request hooks
  const useCreatePasswordChangeRequest = () => {
    return useMutation({
      mutationFn: () => subAdminApi.createPasswordChangeRequest(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["passwordChangeRequests"] });
      },
    });
  };

  const useGetAllPasswordChangeRequests = (params) => {
    return useQuery({
      queryKey: ["passwordChangeRequests", params],
      queryFn: () => subAdminApi.getAllPasswordChangeRequests(params),
      staleTime: 5 * 60 * 1000,
    });
  };

  const useGetMyPasswordChangeRequests = () => {
    return useQuery({
      queryKey: ["myPasswordChangeRequests"],
      queryFn: () => subAdminApi.getMyPasswordChangeRequests(),
      staleTime: 5 * 60 * 1000,
    });
  };

  const useApprovePasswordChangeRequest = () => {
    return useMutation({
      mutationFn: ({ requestId, data }) =>
        subAdminApi.approvePasswordChangeRequest(requestId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["passwordChangeRequests"] });
        queryClient.invalidateQueries({ queryKey: ["subAdmins"] });
      },
    });
  };

  const useRejectPasswordChangeRequest = () => {
    return useMutation({
      mutationFn: ({ requestId, data }) =>
        subAdminApi.rejectPasswordChangeRequest(requestId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["passwordChangeRequests"] });
      },
    });
  };

  return {
    useCreateSubAdmin,
    useGetSubAdmin,
    useGetSubAdminById,
    useUpdateSubAdmin,
    useDeleteSubAdmin,
    useCreatePasswordChangeRequest,
    useGetAllPasswordChangeRequests,
    useGetMyPasswordChangeRequests,
    useApprovePasswordChangeRequest,
    useRejectPasswordChangeRequest,
  };
}
