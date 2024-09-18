<template>
  <div class="outer-container">
    <div class="form-container">
      <div class="right-side">
        <img src="../../assets/images/login.svg" />
        <p>PT Ajeng Wahyu Manunggal</p>
      </div>
      <div class="left-side">
        <div class="wrapper-form">
          <a-form
            :model="formState"
            name="basic"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            autocomplete="off"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
          >
            <a-form-item
              label="Username"
              name="userName"
              :rules="[{ required: true, message: 'Username tidak boleh kosong' }]"
            >
              <a-input v-model:value="formState.userName" />
            </a-form-item>

            <a-form-item
              label="Password"
              name="password"
              :rules="[{ required: true, message: 'Password tidak boleh kosong' }]"
            >
              <a-input-password v-model:value="formState.password" />
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
              <a-button type="primary" html-type="submit">Masuk</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'

import { login } from '../../services/auth'

export default {
  data() {
    return {
      formState: {
        userName: '',
        password: ''
      }
    }
  },

  methods: {
    async onFinish(values) {
      try {
        const response = await login(values)

        localStorage.setItem('accessToken', response?.data?.token)
        this.$emit('handleLogin', false, '1')
        this.$router.push('/dashboard')
      } catch (error) {
        console.log('error => ', error)
        message.error(error?.response?.data?.message || 'Server error')
      }
    }
  },

  emits: ['handleLogin']
}
</script>

<style>
.outer-container {
  /* background-color: #568ab2; */
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

.right-side {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 25px;
  align-items: center;
}

.right-side img {
  width: 75%;
}

.right-side p {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3d3d3d;
  text-align: center;
}

.left-side {
  width: 50%;
  display: flex;
  align-items: center;
}

.left-side .wrapper-form {
  width: 100%;
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

  .right-side {
    width: 100%;
  }

  .left-side {
    width: 100%;
  }
}
</style>
