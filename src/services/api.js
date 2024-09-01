import axios from 'axios'

const BASE_URL = 'http://localhost:3000/api/v1/'
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

const APIInstance = {
  get: (url, customConfig = {}, auth = false) => {
    if (auth) {
      const userToken = localStorage.getItem('accessToken')

      if (userToken) {
        api.defaults.headers.Authorization = `Bearer ${userToken}`
      }
    }

    return api
      .get(url, { ...customConfig })
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  post: (url, data = {}, customConfig = {}, auth = true) => {
    if (auth) {
      const userToken = localStorage.getItem('accessToken')

      if (userToken) {
        api.defaults.headers.Authorization = `Bearer ${userToken}`
      }
    }

    return api
      .post(url, data, { ...customConfig })
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  put: (url, data = {}, customConfig = {}, auth = true) => {
    if (auth) {
      const userToken = localStorage.getItem('accessToken')

      if (userToken) {
        api.defaults.headers.Authorization = `Bearer ${userToken}`
      }
    }

    return api
      .put(url, data, { ...customConfig })
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  },
  delete: (url, customConfig = {}, auth = true) => {
    if (auth) {
      const userToken = localStorage.getItem('accessToken')

      if (userToken) {
        api.defaults.headers.Authorization = `Bearer ${userToken}`
      }
    }

    return api
      .delete(url, { ...customConfig })
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error))
  }
}

export default APIInstance
