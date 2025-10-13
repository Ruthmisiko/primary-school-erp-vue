import { api, generateUrl } from "@/api"

export const createSupplier = async (postBody: any) => {
    return await api
        .post('suppliers', postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const fetchSuppliers = async (filter: any) => {
    const url = generateUrl('suppliers', filter)

    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}

export const updateSupplier = async (id: string, postBody: any) => {
    return await api
        .patch(`suppliers/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const getSupplier = async (id: string) => {
    return await api
        .get(`suppliers/${id}`)
        .then(response => response)
        .catch(e => e.response)
}

export const removeSupplier = async (id: string) => {
    return await api
        .delete(`suppliers/${id}`)
        .then(response => response)
        .catch(e => e.response)
}
