import { api, generateUrl } from "@/api"

export const createSchool = async (postBody: any) => {
    console.log('Creating school with data:', postBody)
    return await api
        .post('schools', postBody)
        .then(response => {
            console.log('School creation response:', response)
            return response
        })
        .catch(e => {
            console.error('School creation error:', e)
            return e.response
        })
}

export const fetchSchools = async (filter: any = {}) => {
    const url = generateUrl('schools', filter)

    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}

export const updateSchool = async (id: string, postBody: any) => {
    console.log('Updating school with data:', { id, postBody })
    return await api
        .patch(`schools/${id}`, postBody)
        .then(response => {
            console.log('School update response:', response)
            return response
        })
        .catch(e => {
            console.error('School update error:', e)
            return e.response
        })
}

export const getSchool = async (id: string) => {
    return await api
        .get(`schools/${id}`)
        .then(response => response)
        .catch(e => e.response)
}

export const removeSchool = async (id: string) => {
    return await api
        .delete(`schools/${id}`)
        .then(response => response)
        .catch(e => e.response)
} 