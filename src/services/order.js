import api from './api'

const getOrdersBySearch = (customerId, status, orderStartDate, orderEndDate) =>
    api.get(
      `orders/search-by?customerId=${customerId}&status=${status}&orderStartDate=${
        orderStartDate ? orderStartDate : null
      }&orderEndDate=${orderEndDate ? orderEndDate : null}`
    ),
  getOrder = (orderId) => api.get(`order/${orderId}`),
  getAllOrders = () => api.get('orders'),
  createOrder = (payload) => api.post('order', payload),
  updateOrder = (orderId, payload, publishPrice = false) =>
    api.put(`order/${orderId}?publishPrice=${publishPrice}`, payload),
  updateOrderOnly = (orderId, payload) => api.put(`order/order-only/${orderId}`, payload)

export { getOrdersBySearch, getOrder, getAllOrders, createOrder, updateOrder, updateOrderOnly }
