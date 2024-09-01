<template>
  <div class="container">
    <div class="inputWrapper">
      <a-input placeholder="Cari id order" @change="handleOnSearchItemValueChange" />
    </div>
    <a-table
      :columns="columns"
      :data-source="state.items"
      :scroll="{ x: 540 }"
      :loading="state.loading"
    >
      <template v-slot:bodyCell="{ record, column }">
        <template v-if="column.key === 'action'">
          <a-select
            ref="select"
            v-model:value="record.status"
            style="width: 100%"
            @change="handleChange(record)"
            :loading="record.loading"
            :disabled="record.disabled"
          >
            <a-select-option value="CUTTING" :disabled="isOptionDisabled('CUTTING', record.status)"
              >CUTTING</a-select-option
            >
            <a-select-option value="SEWING" :disabled="isOptionDisabled('SEWING', record.status)"
              >SEWING</a-select-option
            >
            <a-select-option
              value="FINISHING"
              :disabled="isOptionDisabled('FINISHING', record.status)"
              >FINISHING</a-select-option
            >
            <a-select-option value="PACKING" :disabled="isOptionDisabled('PACKING', record.status)"
              >PACKING</a-select-option
            >
            <a-select-option
              value="READY_TO_DELIVERY"
              :disabled="isOptionDisabled('READY_TO_DELIVERY', record.status)"
              >SIAP UNTUK DIKIRIM</a-select-option
            >
            <a-select-option
              value="IN_DELIVERY"
              :disabled="isOptionDisabled('IN_DELIVERY', record.status)"
              >DALAM PENGIRIMAN</a-select-option
            >
            <a-select-option
              value="COMPLETE"
              :disabled="isOptionDisabled('COMPLETE', record.status)"
              >SELESAI</a-select-option
            >
          </a-select>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { message, Modal } from 'ant-design-vue'

import {
  getOrderDetails,
  getOrderDetailsByOrderId,
  updateStatusOrderDetail
} from '../../../services/orderDetail'

import { OrderDetail } from '../../../datas/tableColumn'

const state = reactive({
  items: [],
  loading: false
})

export default {
  data() {
    return {
      columns: OrderDetail,
      state,
      debounceTimer: null,
      status: '',
      searchValue: ''
    }
  },

  mounted() {
    this.handleGetOrderDetails('ALL')
  },

  methods: {
    confirmModal(okCb, cancelCb) {
      Modal.confirm({
        title: 'Apakah kamu ingin mengubah status order detail ini?',
        onOk() {
          okCb()
        },
        onCancel() {
          cancelCb()
        },
        class: 'test'
      })
    },
    isOptionDisabled(option, status) {
      if (option === 'CUTTING' && status === 'CREATED') {
        return false
      }

      switch (option) {
        case 'CUTTING':
          return status !== 'CREATED'
        case 'SEWING':
          return status !== 'CUTTING'
        case 'FINISHING':
          return status !== 'SEWING'
        case 'PACKING':
          return status !== 'FINISHING'
        case 'READY_TO_DELIVERY':
          return status !== 'PACKING'
        case 'IN_DELIVERY':
          return status !== 'READY_TO_DELIVERY'
        case 'COMPLETE':
          return status !== 'IN_DELIVERY'
      }
    },
    async handleGetOrderDetails(type, val) {
      state.loading = true

      try {
        const response =
          type === 'ALL' ? await getOrderDetails() : await getOrderDetailsByOrderId(val)
        let newArr = []

        response?.data?.data?.map((item, index) =>
          newArr.push({
            key: index,
            no: index + 1,
            customerName: item.customer.name,
            orderId: item.orderId,
            itemName: item.item.name,
            itemId: item.itemId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.price,
            status: item.status,
            createdAt: item.createdAt,
            loading: false,
            disabled: false,
            orderDetailId: item.orderDetailId
          })
        )

        state.items = newArr
      } catch (error) {
        console.log('error handleGetOrderDetails => ', error)
        message.error(error?.response?.data)
      }

      state.loading = false
    },
    async handleUpdateOrderDetailStatus(val) {
      state.items[val.key].loading = true
      state.items[val.key].disabled = true

      try {
        const { orderDetailId, status } = val,
          response = await updateStatusOrderDetail(orderDetailId, status)

        if (response?.data?.status === 'Success') {
          message.success(response?.data?.message)
          this.handleGetOrderDetails('ALL_ITEMS', this.searchValue)
        } else {
          this.errorModal('Error', response?.data?.message)
        }
      } catch (error) {
        console.log('error => handleUpdateOrderDetailStatus', error)
        this.errorModal(error?.response?.data?.status, error?.response?.data?.message)
      }

      state.items[val.key].loading = false
      state.items[val.key].disabled = false
    },
    handleOnSearchItemValueChange(val) {
      clearTimeout(this.debounceTimer)

      this.debounceTimer = setTimeout(() => {
        this.searchValue = val.target.value
        val.target.value === ''
          ? this.handleGetOrderDetails('ALL')
          : this.handleGetOrderDetails('ALL_ITEMS', val.target.value)
      }, 500)
    },
    handleChange(val) {
      this.confirmModal(
        () => this.handleUpdateOrderDetailStatus(val),
        () => this.handleGetOrderDetails('ALL')
      )
    },
    errorModal(title, content) {
      Modal.error({
        title,
        content
      })
    }
  }
}
</script>

<style>
.container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.action-button-wrapper {
  display: flex;
  gap: 8px;
}
.inputWrapper {
  width: max-content;
}
</style>
