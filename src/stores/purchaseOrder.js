import { ref } from 'vue'
import { defineStore } from 'pinia'

export const customerName = defineStore('customerName', () => {
  const value = ref(null)
  function setCustomerName(customerNameParam) {
    value.value = customerNameParam
  }

  return { value, setCustomerName }
})

export const purchaseOrderStore = defineStore('purchaseOrder', () => {
  const value = ref(null)
  function setPurchaseOrder(purchaseOrderParam) {
    value.value = purchaseOrderParam
  }

  return { value, setPurchaseOrder }
})
