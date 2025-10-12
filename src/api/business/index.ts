import { api } from "@/api";

export const getSettings = async () => {
    return await api
        .get('settings')
        .then(response => response)
        .catch(e => e.response);
};

export const updateSettings = async (postBody: any) => {
    return await api
        .post('settings', postBody, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => response)
        .catch(e => e.response);
};

export const getSchoolLogo = async () => {
    return await api
        .get('settings/logo')
        .then(response => response)
        .catch(e => e.response);
};