import { api ,generateUrl } from "@/api"

export const createSubject = async (postBody: any) => {
    return await api
        .post('subjects', postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const fetchSubjects = async (filter: any) => {
    const url = generateUrl('subjects', filter)

    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}

export const updateSubject = async (id: string, postBody: any) => {
    return await api
        .patch(`subjects/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const getSubject = async (id: string) => {
    return await api
        .get(`subjects/${id}`)
        .then(response => response)
        .catch(e => e.response)
}
export const removeSubject = async (id: string) => {
    return await api
        .delete(`subjects/${id}`)
        .then(response => response)
        .catch(e => e.response)
}