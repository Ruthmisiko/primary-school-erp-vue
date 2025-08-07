import { api } from "@/api"

export const getAdminUsers = async () => {
    return await api
        .get('admin/users')
        .then(response => response)
        .catch(e => e.response)
}

export const getAdminSchools = async () => {
    return await api
        .get('admin/schools')
        .then(response => response)
        .catch(e => e.response)
}

export const assignSchoolToUser = async (postBody: any) => {
    return await api
        .post('admin/assign-school', postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const createAdminUser = async (postBody: any) => {
    return await api
        .post('admin/create-user', postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const updateAdminUser = async (id: string, postBody: any) => {
    return await api
        .patch(`admin/update-user/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const removeSchoolAssignment = async (user_id: string) => {
    return await api
        .delete(`admin/remove-school/${user_id}`)
        .then(response => response)
        .catch(e => e.response)
}

export const getAdminStatistics = async () => {
    return await api
        .get('admin/statistics')
        .then(response => response)
        .catch(e => e.response)
} 