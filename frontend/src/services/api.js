import axios from 'axios';

const API=axios.create({
    baseURL: 'http://localhost:8000',
})

export const getFiles=()=> API.get('drive/files');
export const getEmails=()=> API.get('gmail/emails');
export const getEvents = () => API.get('/calendar/events')
export const checkHealth = () => API.get('/health')
