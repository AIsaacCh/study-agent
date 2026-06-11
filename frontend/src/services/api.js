import axios from 'axios'

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const API = axios.create({
  baseURL: BASE_URL,
})

export default API

export const getFiles = () => API.get('/drive/files')
export const getEmails = () => API.get('/gmail/emails')
export const getEvents = () => API.get('/calendar/events')
export const checkHealth = () => API.get('/health')