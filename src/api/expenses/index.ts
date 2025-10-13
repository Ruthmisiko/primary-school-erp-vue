import { api, generateUrl } from "@/api"

export const createExpense = async (postBody: any) => {
    return await api
        .post('expenses', postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const fetchExpenses = async (filter: any) => {
    const url = generateUrl('expenses', filter)

    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}

export const updateExpense = async (id: string, postBody: any) => {
    return await api
        .patch(`expenses/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const getExpense = async (id: string) => {
    return await api
        .get(`expenses/${id}`)
        .then(response => response)
        .catch(e => e.response)
}

export const removeExpense = async (id: string) => {
    return await api
        .delete(`expenses/${id}`)
        .then(response => response)
        .catch(e => e.response)
}
