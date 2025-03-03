import { api ,generateUrl } from "@/api"

export const addStudent = async (postBody: any) => {
    return await api
        .post('students', postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const fetchStudents = async (filter: any) => {
    const url = generateUrl('students', filter)

    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}

export const updateStudent = async (id: string, postBody: any) => {
    return await api
        .patch(`students/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const getStudent = async (id: string) => {
    return await api
        .get(`students/${id}`)
        .then(response => response)
        .catch(e => e.response)
}
export const removeStudent = async (id: string) => {
    return await api
        .delete(`students/${id}`)
        .then(response => response)
        .catch(e => e.response)
}