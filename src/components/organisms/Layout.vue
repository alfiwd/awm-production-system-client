<template>
  <div v-if="isLoading"></div>
  <a-layout v-else-if="!isLoginPage" style="min-height: 100vh">
    <!-- :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }" -->
    <!-- :width="!collapsed ? 60 : 200" -->
    <a-layout-sider
      breakpoint="md"
      @collapse="onCollapse"
      collapsed-width="0"
      @breakpoint="onBreakpoint"
      :collapsed="collapsed"
      :style="{
        height: '100vh',
        position: 'fixed'
      }"
    >
      <div class="company-name-container" v-show="!collapsed">
        <div>
          <p>PT Ajeng Wahyu Manunggal</p>
        </div>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item v-for="(menu, index) in menus" :key="`${index + 1}`" v-on:click="menu.onClick">
          <div v-if="menu.role.find((item) => item === role)">
            <component :is="menu.icon" />
            <span class="nav-text">{{ menu.text }}</span>
            <router-link v-if="menu.link" :to="menu.link"></router-link>
          </div>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <!-- <a-layout :style="{ marginLeft: !collapsed ? '60px' : '0px' }"> -->
    <a-layout :style="{ marginLeft: !collapsed ? '200px' : '0' }">
      <a-layout-header
        v-if="$route.name != 'Dashboard'"
        :style="{ background: '#fff', display: 'flex', alignItems: 'center', padding: '0px 16px' }"
      >
        <a-breadcrumb separator=">">
          <a-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
            <router-link :to="item.path" v-if="index < breadcrumbs.length - 1">
              <strong>{{ item.title }}</strong>
            </router-link>
            <strong v-else>{{ item.title }}</strong>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </a-layout-header>
      <div style="height: 100%; padding-top: 36px">
        <router-view></router-view>
      </div>
    </a-layout>
  </a-layout>
</template>
<script>
import {
  LogoutOutlined,
  ShopOutlined,
  HomeOutlined,
  TeamOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue'
import { defineComponent, ref } from 'vue'
import { Modal } from 'ant-design-vue'

import { checkToken } from './../../services/auth'
import breadcrumbs from './../../utils/breadcrumbs'
import { roleStore } from '../../stores/role'

export default defineComponent({
  components: {
    LogoutOutlined,
    ShopOutlined,
    HomeOutlined,
    TeamOutlined,
    ReloadOutlined
  },

  created() {
    const isAdminPath = this.$route?.name === 'Admin'

    isAdminPath && this.$router.push('/admin/dashboard')
  },

  async mounted() {
    this.isLoading = true

    const getRouteName = (cb = () => {}) => {
      setTimeout(() => {
        cb(this.$route.name)
      }, 0)
    }

    getRouteName(this.setErrorForMainMenu)

    try {
      await checkToken()
      this.isLoginPage = false
      this.role = localStorage.getItem('role')
    } catch (error) {
      this.isLoginPage = true
      if (this.showErrorForMainMenu) {
        this.errorModal(error?.response?.data?.message)
      }
      console.log('error Layout mounted => ', error)
      this.$router.push('/login')
    }

    this.isLoading = false

    getRouteName(this.setActiveMenu)
    getRouteName(this.setBreadcrumbs)
    getRouteName(this.handleCheckToken)
    this.handleSetMenus()
    console.log(this.role)
  },

  data() {
    return {
      collapsed: false,
      selectedKeys: null,
      breadcrumbs: null,
      isLoginPage: true,
      showErrorForMainMenu: false,
      isLoading: false,
      role: null,
      coba: LogoutOutlined,
      menus: []
    }
  },

  methods: {
    onCollapse(collapsed) {
      this.collapsed = collapsed
    },
    onBreakpoint(broken) {
      this.collapsed = broken
    },
    handleSetMenus() {
      const menus = [
        {
          onClick: () => {},
          icon: HomeOutlined,
          text: 'Dashboard',
          link: `/${
            this.role === 'ADMIN' ? 'admin' : this.role === 'DRIVER' ? 'driver' : 'customer'
          }/dashboard`,
          role: ['ADMIN', 'DRIVER', 'CUSTOMER']
        },
        {
          onClick: () => {},
          icon: TeamOutlined,
          text: 'Daftar Customer',
          link: '/admin/customer',
          role: ['ADMIN']
        },
        {
          onClick: () => {},
          icon: ShopOutlined,
          text: 'Daftar Order',
          link: `/${
            this.role === 'ADMIN' ? 'admin' : this.role === 'DRIVER' ? 'driver' : 'customer'
          }/order`,
          role: ['ADMIN', 'DRIVER', 'CUSTOMER']
        },
        {
          onClick: () => {},
          icon: ShopOutlined,
          text: 'Daftar Item',
          link: '/admin/item',
          role: ['ADMIN']
        },
        {
          onClick: this.handleClickLogout,
          icon: LogoutOutlined,
          text: 'Logout',
          link: null,
          role: ['ADMIN', 'DRIVER', 'CUSTOMER']
        }
      ]

      this.menus = menus.filter((item) => item.role.find((item) => item === this.role))
    },
    handleCheckToken(route) {
      const isThereToken = localStorage.getItem('accessToken')

      !route && isThereToken && this.$router.push('/admin/dashboard')
    },
    handleClickLogout() {
      localStorage.clear()
      this.isLoginPage = true
      this.$router.push('/login')
    },
    setActiveMenu(val) {
      const routeName = {
        'Customer Dashboard': '1',
        'Admin Dashboard': '1',
        'Driver Dashboard': '1',
        'Customer List': '2',
        'Order List For Customer': '2',
        'Order List For Driver': '2',
        'Order List For Admin': '3',
        'Add Order For Customer': '2',
        'Detail Order For Customer': '2',
        'Customer Detail': '2',
        Order: '3',
        'Add Order': '3',
        'Order Detail': '3',
        // 'Update Status Order Detail': '4',
        'Item List': '4',
        'Add Item': '4',
        'Item Detail': '4'
      }

      this.selectedKeys = ref([routeName[val]])
    },
    setErrorForMainMenu(val) {
      if (val) {
        this.showErrorForMainMenu = true
      }
    },
    handleLogin(isLogin, selectedKeys) {
      this.isLoginPage = isLogin
      this.selectedKeys = ref([selectedKeys])
    },
    setBreadcrumbs(val) {
      this.breadcrumbs = breadcrumbs.find((item) => item.pathName === val)?.items
    },
    errorModal(content) {
      Modal.error({
        title: 'Server error',
        content
      })
    }
  },

  watch: {
    $route: {
      handler(to) {
        this.setBreadcrumbs(to.name)
      }
    }
  }
})
</script>
<style>
@media (max-width: 768px) {
  .company-name-container {
    display: none;
  }
  .nav-text {
    /* display: none; */
  }
}

#components-layout-demo-responsive .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.site-layout-sub-header-background {
  background: #fff;
}

.site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout-sub-header-background {
  background: #141414;
}

.company-name-container {
  padding: 16px;
}

.company-name-container div {
  background-color: #fff;
}

.company-name-container div p {
  color: #568ab2;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

.breadcrumb-title-wrapper {
  display: flex;
  align-items: center;
}
</style>
