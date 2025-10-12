import { api ,generateUrl } from "@/api"

export const createMethod = async (postBody: any) => {
    return await api
        .post('payment-methods', postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const fetchMethods = async (filter: any) => {
    const url = generateUrl('payment-methods', filter)

    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}

export const updateMethod = async (id: string, postBody: any) => {
    return await api
        .patch(`payment-methods/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const getMethod = async (id: string) => {
    return await api
        .get(`payment-methods/${id}`)
        .then(response => response)
        .catch(e => e.response)
}
export const removeMethod = async (id: string) => {
    return await api
        .delete(`payment-methods/${id}`)
        .then(response => response)
        .catch(e => e.response)
}