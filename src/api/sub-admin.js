import apiClient from "./client";

const rootUrl = "/sub-admin";

const subAdminApi = {
    getSubAdmin: async (params) => {
        const response = await apiClient.get(rootUrl,{
            params
        });
        return response.data;
    },

    getSubAdminById: async (id) => {
        const response = await apiClient.get(`${rootUrl}/${id}`);
        return response.data;
    },

    createSubAdmin: async (data) => {
        const response = await apiClient.post(rootUrl, data);
        return response.data;
    },  

    updateSubAdmin: async (id, data) => {
        const response = await apiClient.put(`${rootUrl}/${id}`, data);
        return response.data;
    },
    deleteSubAdmin: async (id) => {
        const response = await apiClient.delete(`${rootUrl}/${id}`);
        return response.data;
    },
    adminResetPassword: async (id, data) => {
        const response = await apiClient.put(`${rootUrl}/${id}/reset-password`, data);
        return response.data;
    },

}

export default subAdminApi;