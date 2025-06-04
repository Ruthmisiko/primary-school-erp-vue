import { api } from "@/api"

export const createUser = async (postBody: any) => {
    return await api
        .post('auth/register', postBody)
        .then(response => response)
        .catch(e => e.response)
}

// @/api/auth.ts
export const login = async (credentials: { email: string, password: string }) => {
    return await api
        .post('auth/login', credentials)
        .then(response => response)
        .catch(e => e.response)
}