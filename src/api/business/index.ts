import { api } from "@/api";

export const getSettings = async () => {
    return await api
        .get('settings')
        .then(response => response)
        .catch(e => e.response);
};

export const updateSettings = async (postBody: any) => {
    return await api
        .patch('settings', postBody)
        .then(response => response)
        .catch(e => e.response);
};