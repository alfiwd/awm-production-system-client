<template>
  <div class="container">
    <div class="header">
      <div>
        <a-input placeholder="Cari customer" @change="handleOnSearchItemValueChange" />
      </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="state.customers"
      :scroll="{ x: 540 }"
      :loading="state.loading"
    >
      <template v-slot:bodyCell="{ record, column }">
        <template v-if="column.key === 'action'">
          <div class="action-button-wrapper">
            <a-button type="primary" @click="handleOnClickDetail(record.key)">
              Lihat detail
            </a-button>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { message } from 'ant-design-vue'

import { getCustomers, deleteCustomer, getCustomersByName } from '../../../services/customer'

import { customer } from '../../../datas/tableColumn'

const state = reactive({
  customers: [],
  loading: false
})

export default {
  data() {
    return {
      columns: customer,
      state,
      debounceTimer: null
    }
  },

  mounted() {
    this.handleGetCustomers('ALL')
  },

  methods: {
    handleOnClickDetail(id) {
      this.$router.push(`/admin/customer/${id}`)
    },
    async handleOnClickDelete(id) {
      try {
        const response = await deleteCustomer(id)

        message.success(response?.data?.message)
        this.handleGetCustomers('ALL')
      } catch (error) {
        console.log('error')
        message.error(error?.response?.data)
      }
    },
    async handleGetCustomers(type, val) {
      state.loading = true

      try {
        const response = type === 'ALL' ? await getCustomers() : await getCustomersByName(val)
        let newArr = []

        response?.data?.data?.map((item, index) =>
          newArr.push({
            key: item.customerId,
            no: index + 1,
            customerName: item.name,
            address: item.address,
            phoneNumber: item.phoneNumber,
            email: item.email
          })
        )

        state.customers = newArr
      } catch (error) {
        console.log('error => ', error)
        message.error(error?.response?.data)
      }

      state.loading = false
    },
    handleOnSearchItemValueChange(val) {
      clearTimeout(this.debounceTimer)

      this.debounceTimer = setTimeout(() => {
        val.target.value === ''
          ? this.handleGetCustomers('ALL')
          : this.handleGetCustomers('ALL_CUSTOMERS', val.target.value)
      }, 500)
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
</style>
