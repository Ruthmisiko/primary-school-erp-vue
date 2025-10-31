import { api, generateUrl } from "@/api"

export const createPayment = async (postBody: any) => {
    return await api
        .post('payments', postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const fetchPayments = async (filter: any = {}) => {
    const url = generateUrl('payments', filter)

    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}

export const updatePayment = async (id: string, postBody: any) => {
    return await api
        .patch(`payments/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const getPayment = async (id: string) => {
    return await api
        .get(`payments/${id}`)
        .then(response => response)
        .catch(e => e.response)
}

export const removePayment = async (id: string) => {
    return await api
        .delete(`payments/${id}`)
        .then(response => response)
        .catch(e => e.response)
}

export const initiatePayment = async (postBody: any) => {
    return await api
        .post('payments/initiate', postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const fetchPaymentMethods = async () => {
    return await api
        .get('payment-methods')
        .then(response => response)
        .catch(e => e.response)
}
