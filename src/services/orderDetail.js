import api from './api'

const getOrderDetails = () => api.get('order-details'),
  getOrderDetailsByOrderId = (orderId) => api.get(`order-details/${orderId}`),
  createOrderDetail = (payload) => api.post('order-detail', payload),
  updateStatusOrderDetail = (orderDetailId, status) =>
    api.put(`order-detail/${orderDetailId}?status=${status}`)

export { getOrderDetails, getOrderDetailsByOrderId, updateStatusOrderDetail, createOrderDetail }
