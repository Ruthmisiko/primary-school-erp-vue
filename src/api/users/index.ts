import { api ,generateUrl } from "@/api"

export const updateSettings = async (id: string, postBody: any) => {
    return await api
        .patch(`users/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const getUser = async (id: string) => {
    return await api
        .get(`users/${id}`)
        .then(response => response)
        .catch(e => e.response)
}

export const fetchUsers = async (filter: any) => {
    const url = generateUrl('users', filter)
    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}

export const addUser = async (postBody: any) => {
    return await api
        .post('users', postBody)
        .then(response => response)
        .catch(e => e.response)
}
  
export const removeUser = async (id: string) => {
    return await api
        .delete(`users/${id}`)
        .then(response => response)
        .catch(e => e.response)
} 
  
export const updateUser = async (id: string, postBody: any) => {
    return await api
        .patch(`users/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}