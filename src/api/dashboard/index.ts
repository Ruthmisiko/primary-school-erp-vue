import { api ,generateUrl } from "@/api"



export const fetchData = async (filter: any) => {
    const url = generateUrl('dashboards', filter)

    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}

