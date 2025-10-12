import { api ,generateUrl } from "@/api"



export const fetchData = async (filter: any) => {
    const url = generateUrl('dashboards', filter)

    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}

export const fetchEnrollmentStats = async (year?: number) => {
    const url = year ? `dashboard/enrollment-stats?year=${year}` : 'dashboard/enrollment-stats'
    
    return await api
        .get(url)
        .then(response => response)
        .catch(e => e.response)
}
