<template>
  <div>
    <div v-if="loading" class="skeleton-wrapper">
      <a-skeleton />
    </div>
    <a-form
      :model="formState"
      name="basic"
      :wrapper-col="{ span: 15 }"
      autocomplete="off"
      @finish="onFinish"
      layout="vertical"
      v-else
    >
      <a-form-item
        label="Nama item"
        name="name"
        :rules="[{ required: true, message: 'Nama item tidak boleh kosong' }]"
      >
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          style="width: 100px"
          :disabled="isSubmitBtnDisabled"
          >{{ buttonLabel }}</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'

import { getItemById, addItem, updateItem } from '../../../services/item'

export default {
  data() {
    return {
      formState: {
        name: ''
      },
      buttonLabel: '',
      paramsId: null,
      loading: false,
      isSubmitBtnDisabled: true
    }
  },

  mounted() {
    const paramsId = this.$route?.params?.id

    if (paramsId) {
      this.handleGetItemById(paramsId)
      this.buttonLabel = 'Ubah'
      this.paramsId = paramsId
    } else {
      this.buttonLabel = 'Tambah'
    }
  },

  watch: {
    formState: {
      deep: true,
      handler() {
        this.formState.name ? (this.isSubmitBtnDisabled = false) : (this.isSubmitBtnDisabled = true)
      }
    }
  },

  methods: {
    async handleGetItemById(id) {
      this.loading = true

      try {
        const response = await getItemById(id),
          responseData = response?.data?.data,
          responseMessage = response?.data?.message

        if (responseData) {
          this.formState.name = responseData.name
        } else {
          message.error(responseMessage)
          this.$router.push('/admin/item')
        }
      } catch (error) {
        console.log('error => ', error)
        message.error(error?.response?.data || 'Server error')
      }

      this.loading = false
    },
    async onFinish(value) {
      try {
        const response = this.paramsId
          ? await updateItem(this.paramsId, value)
          : await addItem(value)

        if (response?.data?.status === 'Success') {
          message.success(response?.data?.message)
          this.$router.push('/admin/item')
        } else {
          message.error(response?.data?.message)
        }
      } catch (error) {
        console.log('error => ', error)
      }
    }
  }
}
</script>

<style>
.skeleton-wrapper {
  width: 62%;
}
</style>
