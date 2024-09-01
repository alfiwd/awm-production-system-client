import api from './api'

const login = (data) => api.post('login', data, null, false)
const checkToken = () => api.get('check-token', null, true)

export { login, checkToken }
