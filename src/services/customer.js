import api from './api'

const getCustomers = () => api.get('customers'),
  getCustomer = (id) => api.get(`customer/${id}`),
  addCustomer = (data) => api.post('customer', data, null, true),
  updateCustomer = (id, data) => api.put(`customer/${id}`, data, null, true),
  deleteCustomer = (id) => api.delete(`customer/${id}`, null, true),
  getCustomersByName = (customerName) => api.get(`customers/name?name=${customerName}`)

export {
  getCustomers,
  getCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomersByName
}
