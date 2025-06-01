import { api ,generateUrl } from "@/api"

export const updateSettings = async (id: string, postBody: any) => {
    return await api
        .patch(`settings/${id}`, postBody)
        .then(response => response)
        .catch(e => e.response)
}

export const getSettings = async (id: string) => {
    return await api
        .get(`settings/${id}`)
        .then(response => response)
        .catch(e => e.response)
}



  
  
  