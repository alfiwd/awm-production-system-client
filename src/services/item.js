import api from './api'

const getItems = () => api.get('items'),
  getItemsByName = (name) => api.get(`items/name?name=${name}`),
  getItemById = (id) => api.get(`item/${id}`),
  addItem = (data) => api.post('item', data, null, true),
  updateItem = (id, data) => api.put(`item/${id}`, data, null, true)

export { getItems, getItemsByName, getItemById, addItem, updateItem }
