import { api } from '@/api'

export const sendSms = async (postBody: any) => {
  // Backend should accept: { audience: 'all'|'class'|'custom', class_ids?: number[], phone_numbers?: string[], message: string, sender_id?: string }
  return await api
    .post('sms/parents/send-all', postBody)
    .then(response => response)
    .catch(e => e.response)
}

