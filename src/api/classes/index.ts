import { api ,generateUrl } from "@/api"

export const createClass = async (postBody: any) => {
    return await api
        .post('sclasses', postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const fetchClasses = async (filter: any) => {
    const url = generateUrl('sclasses', filter)

    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}

export const updateClass = async (id: string, postBody: any) => {
    return await api
        .patch(`sclasses/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const getClass = async (id: string) => {
    return await api
        .get(`sclasses/${id}`)
        .then(response => response)
        .catch(e => e.response)
}
export const removeClass = async (id: string) => {
    return await api
        .delete(`sclasses/${id}`)
        .then(response => response)
        .catch(e => e.response)
}