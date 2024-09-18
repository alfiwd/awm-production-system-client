<template>
  <div>
    <div v-if="isLoading"></div>
    <div v-else class="outer-container">
      <div class="form-container">
        <div class="left-side">
          <img src="../assets/images/login.svg" />
          <p>PT Ajeng Wahyu Manunggal</p>
        </div>
        <div class="right-side">
          <div class="wrapper-form">
            <a-form
              :model="formState.login"
              name="basic"
              autocomplete="off"
              @finish="onFinish"
              @finishFailed="onFinishFailed"
              v-if="isLoginForm"
              :label-col="{ xs: { span: 24 }, sm: { span: 8 } }"
              :wrapper-col="{ xs: { span: 24 }, sm: { span: 16 } }"
            >
              <a-form-item
                label="Email"
                name="email"
                :rules="[{ required: true, message: 'Email tidak boleh kosong', type: 'email' }]"
              >
                <a-input v-model:value="formState.login.email" />
              </a-form-item>
              <a-form-item
                label="Password"
                name="password"
                :rules="[{ required: true, message: 'Password tidak boleh kosong' }]"
              >
                <a-input-password v-model:value="formState.login.password" />
              </a-form-item>
              <a-form-item :wrapper-col="{ xs: { span: 24 }, sm: { offset: 8, span: 16 } }">
                <a-button
                  type="primary"
                  html-type="submit"
                  class="login-button"
                  :disabled="isButtonDisabled"
                  >Masuk</a-button
                >
                <p>
                  Belum punya akun?
                  <span class="action" @click="() => handleOnSpanClick('REGISTER')"
                    >Daftar sekarang!</span
                  >
                </p>
              </a-form-item>
            </a-form>

            <a-form
              :model="formState.register"
              name="basic"
              :label-col="{ xs: { span: 24 }, sm: { span: 8 } }"
              :wrapper-col="{ xs: { span: 24 }, sm: { span: 16 } }"
              autocomplete="off"
              @finish="onFinish"
              @finishFailed="onFinishFailed"
              v-else
            >
              <a-form-item
                label="Nama Perusahaan"
                name="name"
                :rules="[{ required: true, message: 'Nama perusahaan tidak boleh kosong' }]"
              >
                <a-input v-model:value="formState.register.name" />
              </a-form-item>
              <a-form-item
                label="Alamat"
                name="address"
                :rules="[{ required: true, message: 'Alamat tidak boleh kosong' }]"
              >
                <a-textarea :rows="4" v-model:value="formState.register.address" />
              </a-form-item>
              <a-form-item
                label="Email"
                name="email"
                :rules="[{ required: true, message: 'Email tidak boleh kosong', type: 'email' }]"
              >
                <a-input v-model:value="formState.register.email" />
              </a-form-item>
              <a-form-item
                label="Nomor Handphone"
                name="phoneNumber"
                :rules="[{ required: true, message: 'Nomor handphone tidak boleh kosong' }]"
              >
                <a-input v-model:value="formState.register.phoneNumber" />
              </a-form-item>
              <a-form-item
                label="Password"
                name="password"
                :rules="[{ required: true, message: 'Password tidak boleh kosong' }]"
              >
                <a-input-password v-model:value="formState.register.password" />
              </a-form-item>

              <a-form-item :wrapper-col="{ xs: { span: 24 }, sm: { offset: 8, span: 16 } }">
                <a-button
                  type="primary"
                  html-type="submit"
                  class="login-button"
                  :disabled="isButtonDisabled"
                  >Daftar</a-button
                >
                <p>
                  Sudah punya akun?
                  <span class="action" @click="() => handleOnSpanClick('LOGIN')"
                    >Masuk sekarang!</span
                  >
                </p>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal, message } from 'ant-design-vue'

import { login, checkToken } from '../services/auth'
import { addCustomer } from '../services/customer'
import { roleStore } from '../stores/role'

export default {
  data() {
    return {
      formState: {
        login: {
          email: '',
          password: ''
        },
        register: {
          name: '',
          address: '',
          email: '',
          phoneNumber: '',
          password: ''
        }
      },
      isLoading: true,
      isLoginForm: true,
      isButtonDisabled: true
    }
  },

  watch: {
    formState: {
      deep: true,
      handler() {
        Object.keys(this.isLoginForm ? this.formState.login : this.formState.register)?.map(
          (item) => {
            this.formState[this.isLoginForm ? 'login' : 'register'][item]
              ? (this.isButtonDisabled = false)
              : (this.isButtonDisabled = true)
          }
        )
      }
    }
  },

  async mounted() {
    try {
      const isThereToken = localStorage.getItem('accessToken')

      if (isThereToken) {
        await checkToken()
        this.$router.push('/admin/dashboard')
      }
    } catch (error) {
      console.log('error Login mounted => ', error)
    }

    this.isLoading = false
  },

  methods: {
    handleOnSpanClick(action) {
      this.isLoginForm = action === 'LOGIN' ? true : false
      this.isButtonDisabled = true
    },
    async handleLogin(values) {
      try {
        const response = await login(values),
          role = response?.data?.data?.role

        localStorage.setItem('accessToken', response?.data?.token)
        localStorage.setItem('name', response?.data?.data?.fullName || response?.data?.data?.name)

        if (role) {
          localStorage.setItem('role', response?.data?.data?.role)
          localStorage.setItem('adminId', response?.data?.data?.adminId)
          roleStore().setRole(response?.data?.data?.role)
          if (role === 'ADMIN') {
            this.$router.push('/admin/dashboard')
          } else {
            this.$router.push('/driver/dashboard')
          }
        } else {
          this.$router.push('/customer/dashboard')
          localStorage.setItem('role', 'CUSTOMER')
          localStorage.setItem('customerId', response?.data?.data?.customerId)
          roleStore().setRole('CUSTOMER')
        }
        this.$emit('handleLogin', false, '1')
      } catch (error) {
        console.log('error handleLogin => ', error)
        // this.errorModal('Login gagal', error?.response?.data?.message)
        message.error(error?.response?.data?.message)
      }
    },
    async handleRegister(values) {
      const validPhoneNumber = /^(08[1-9][0-9]{6,9}|(\+62|62)8[1-9][0-9]{6,9})$/

      if (!validPhoneNumber.test(values.phoneNumber)) {
        Modal.error({
          title: 'Nomor handphone tidak valid',
          content: 'Masukkan nomor handphone yang valid'
        })
        return
      }

      const response = await addCustomer(values)

      response?.data?.status === 'Success'
        ? this.successModal('Anda dapat melakukan login sekarang.')
        : this.errorModal('Daftar gagal', response?.data?.message)
    },
    onFinish(values) {
      this.isLoginForm ? this.handleLogin(values) : this.handleRegister(values)
    },
    successModal(content) {
      Modal.success({
        title: 'Berhasil melakukan pendaftaran',
        content,
        onOk: () => {
          this.isLoginForm = true
        }
      })
    },
    errorModal(title, content) {
      console.log('errorModal muncul')

      Modal.error({
        title,
        content,
        onOk: () => {
          console.log('ini ok')
        }
      })
    }
  },

  emits: ['handleLogin']
}
</script>

<style>
.outer-container {
  background-color: #f7f7f7;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container {
  display: flex;
  box-shadow: 0px 0px 30px -10px rgb(190, 190, 190);
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  width: 70%;
  padding: 80px 30px;
}

.left-side {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 25px;
  align-items: center;
}

.left-side img {
  width: 75%;
}

.left-side p {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3d3d3d;
  text-align: center;
}

.right-side {
  width: 50%;
  display: flex;
  align-items: center;
}

.right-side .wrapper-form {
  width: 100%;
}

.right-side .wrapper-form .login-button {
  margin-bottom: 16px;
}

.right-side .wrapper-form .action {
  color: #568ab2;
  font-weight: 700;
  cursor: pointer;
}

@media only screen and (max-width: 768px) {
  .outer-container {
    padding: 0px 16px;
  }

  .form-container {
    width: 100%;
    flex-direction: column;
    height: max-content;
    padding: 10px;
    gap: 10px;
  }

  .left-side {
    width: 100%;
  }

  .right-side {
    width: 100%;
  }

  .left-side img {
    width: 50%;
  }
}
</style>
