import { api ,generateUrl } from "@/api"

export const addResult = async (postBody: any) => {
    return await api
        .post('results', postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const fetchResults = async (filter: any) => {
    const url = generateUrl('results', filter)

    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}

export const updateResult = async (id: string, postBody: any) => {
    return await api
        .patch(`results/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const getResult = async (id: string) => {
    return await api
        .get(`results/${id}`)
        .then(response => response)
        .catch(e => e.response)
}
export const removeResult = async (id: string) => {
    return await api
        .delete(`results/${id}`)
        .then(response => response)
        .catch(e => e.response)
}

 