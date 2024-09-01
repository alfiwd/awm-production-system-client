<template>
  <div class="container">
    <div class="header">
      <div>
        <a-button type="primary" v-on:click="handleOnClickAdd">Tambah data</a-button>
      </div>
      <div>
        <a-input placeholder="Cari item" @change="handleOnSearchItemValueChange" />
      </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="state.items"
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

import { getItems, getItemsByName } from '../../../services/item'

import { item } from '../../../datas/tableColumn'

const state = reactive({
  items: [],
  loading: false
})

export default {
  data() {
    return {
      columns: item,
      state,
      debounceTimer: null,
      dummy: []
    }
  },

  mounted() {
    this.handleGetItems('ALL')
  },

  methods: {
    handleOnClickDetail(id) {
      this.$router.push(`/admin/item/${id}`)
    },
    handleOnClickAdd() {
      this.$router.push('/admin/item/tambah')
    },
    async handleGetItems(type, val) {
      state.loading = true

      try {
        const response = type === 'ALL' ? await getItems() : await getItemsByName(val)
        let newArr = []

        response?.data?.data?.map((item, index) =>
          newArr.push({
            key: item.itemId,
            no: index + 1,
            name: item.name
          })
        )

        state.items = newArr
      } catch (error) {
        console.log('error handleGetItems => ', error)
        message.error(error?.response?.data)
      }

      state.loading = false
    },
    handleOnSearchItemValueChange(val) {
      clearTimeout(this.debounceTimer)

      this.debounceTimer = setTimeout(() => {
        val.target.value === ''
          ? this.handleGetItems('ALL')
          : this.handleGetItems('ALL_ITEMS', val.target.value)
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
.header {
  display: flex;
  justify-content: space-between;
}
</style>
