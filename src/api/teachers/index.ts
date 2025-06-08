import { api ,generateUrl } from "@/api"

export const createTeacher = async (postBody: any) => {
    return await api
        .post('teachers', postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const fetchTeachers = async (filter: any) => {
    const url = generateUrl('teachers', filter)

    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}

export const updateTeacher = async (id: string, postBody: any) => {
    return await api
        .patch(`teachers/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const getTeacher = async (id: string) => {
    return await api
        .get(`teachers/${id}`)
        .then(response => response)
        .catch(e => e.response)
}
export const removeTeacher = async (id: string) => {
    return await api
        .delete(`teachers/${id}`)
        .then(response => response)
        .catch(e => e.response)
}


export const exportTeachers = async () => {
    return await api
        .get('teachers/report/pdf', { responseType: 'blob' })
        .then(response => response)
        .catch(e => e.response)
}