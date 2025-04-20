import { api ,generateUrl } from "@/api"

export const createExam = async (postBody: any) => {
    return await api
        .post('exams', postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const fetchExams = async (filter: any) => {
    const url = generateUrl('exams', filter)

    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}

export const updateExam = async (id: string, postBody: any) => {
    return await api
        .patch(`exams/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const getExam = async (id: string) => {
    return await api
        .get(`exams/${id}`)
        .then(response => response)
        .catch(e => e.response)
}
export const removeExam = async (id: string) => {
    return await api
        .delete(`exams/${id}`)
        .then(response => response)
        .catch(e => e.response)
}