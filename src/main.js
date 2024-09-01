// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'

const app = createApp(App).use(Antd)

app.use(createPinia())
app.use(router)

app.mount('#app')
