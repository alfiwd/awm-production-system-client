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
        label="Nama customer"
        name="name"
        :rules="[{ required: true, message: 'Nama customer tidak boleh kosong' }]"
      >
        <a-input v-model:value="formState.name" :disabled="true" />
      </a-form-item>
      <a-form-item
        label="Alamat"
        name="address"
        :rules="[{ required: true, message: 'Alamat tidak boleh kosong' }]"
      >
        <a-textarea v-model:value="formState.address" :rows="4" :disabled="true" />
      </a-form-item>
      <a-form-item
        label="Nomor handphone"
        name="phoneNumber"
        :rules="[{ required: true, message: 'Nomor handphone tidak boleh kosong' }]"
      >
        <a-input v-model:value="formState.phoneNumber" :disabled="true" />
      </a-form-item>
      <a-form-item
        label="Email"
        name="email"
        :rules="[{ required: true, message: 'Email tidak boleh kosong' }]"
      >
        <a-input v-model:value="formState.email" :disabled="true" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'

import { getCustomer, addCustomer, updateCustomer } from '../../../services/customer'

export default {
  data() {
    return {
      formState: {
        name: '',
        address: '',
        phoneNumber: '',
        email: ''
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
      this.handleGetCustomer(paramsId)
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
        const { name, address, phoneNumber, email } = this.formState

        name && address && phoneNumber && email
          ? (this.isSubmitBtnDisabled = false)
          : (this.isSubmitBtnDisabled = true)
      }
    }
  },

  methods: {
    async handleGetCustomer(id) {
      this.loading = true

      try {
        const response = await getCustomer(id),
          responseData = response?.data?.data,
          responseMessage = response?.data?.message

        if (responseData) {
          this.formState.name = responseData.name
          this.formState.address = responseData.address
          this.formState.phoneNumber = responseData.phoneNumber
          this.formState.email = responseData.email
        } else {
          message.error(responseMessage)
          this.$router.push('/admin/customer')
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
          ? await updateCustomer(this.paramsId, value)
          : await addCustomer(value)

        if (response?.data?.status === 'Success') {
          message.success(response?.data?.message)
          this.$router.push('/admin/customer')
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
