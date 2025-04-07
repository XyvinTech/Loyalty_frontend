import apiClient from "./client";

const rootUrl = "/sub-admin";

const subAdminApi = {
    getSubAdmin: async () => {
        const response = await apiClient.get(rootUrl);
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

}

export default subAdminApi;