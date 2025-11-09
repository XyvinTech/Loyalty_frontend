import apiClient from "./client";

const rootUrl = "/trigger-events";

const triggerEventsApi = {

    // Get all trigger events
    getTriggerEvents: async (params) => {
        const response = await apiClient.get(rootUrl,{
            params
        });
        return response.data;
    },  

    // Get trigger event by ID
    getTriggerEventById: async (id) => {
        const response = await apiClient.get(`${rootUrl}/${id}`);
        return response.data;
    },  

    // Create new trigger event
    createTriggerEvent: async (triggerEventData) => {
        alert(JSON.stringify(triggerEventData));
        const response = await apiClient.post(rootUrl, triggerEventData);
        return response.data;
    },  

    // Update trigger event
    updateTriggerEvent: async (id, triggerEventData) => {
        
        const response = await apiClient.put(`${rootUrl}/${id}`, triggerEventData);
        return response.data;
    },      

    // Delete trigger event
    deleteTriggerEvent: async (id) => {
        const response = await apiClient.delete(`${rootUrl}/${id}`);
        return response.data;
    },    

}

export default triggerEventsApi;
    
    
