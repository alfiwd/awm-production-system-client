import { createRouter, createWebHistory } from 'vue-router'

import Layout from '../components/organisms/Layout.vue'
import Login from '../views/Login.vue'
import OrderTracker from '../views/OrderTracker.vue'
import Dashboard from '../views/Admin/Dashboard.vue'
import CustomerDashboard from '../views/Admin/Customer/CustomerDashboard.vue'
import CustomerDetail from '../views/Admin/Customer/CustomerDetail.vue'
import CustomerOrderDashboard from '../views/Customer/Order/OrderDashboard.vue'
import OrderDashboard from '../views/Admin/Order/OrderDashboard.vue'
import OrderDetail from '../views/Admin/Order/OrderDetail.vue'
import ItemDashboard from '../views/Admin/Item/ItemDashboard.vue'
import ItemDetail from '../views/Admin/Item/ItemDetail.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/order-tracker',
      name: 'Order Tracker',
      component: OrderTracker
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/customer',
      name: 'Customer',
      component: Layout,
      children: [
        {
          path: 'dashboard',
          name: 'Customer Dashboard',
          component: Dashboard
        },
        {
          path: 'order',
          name: 'Order List For Customer',
          component: CustomerOrderDashboard
        },
        {
          path: 'order/tambah',
          name: 'Add Order For Customer',
          component: OrderDetail
        },
        {
          path: 'order/detail',
          name: 'Detail Order For Customer',
          component: OrderDetail
        }
      ]
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Layout,
      children: [
        {
          path: 'dashboard',
          name: 'Admin Dashboard',
          component: Dashboard
        },
        {
          path: 'customer',
          name: 'Customer List',
          component: CustomerDashboard
        },
        {
          path: 'customer/:id',
          name: 'Customer Detail',
          component: CustomerDetail
        },
        {
          path: 'order',
          name: 'Order List For Admin',
          component: OrderDashboard
        },
        {
          path: 'order/:id',
          name: 'Order Detail',
          component: OrderDetail
        },
        {
          path: 'item',
          name: 'Item List',
          component: ItemDashboard
        },
        {
          path: 'item/tambah',
          name: 'Add Item',
          component: ItemDetail
        },
        {
          path: 'item/:id',
          name: 'Item Detail',
          component: ItemDetail
        }
      ]
    },
    {
      path: '/driver',
      name: 'Driver',
      component: Layout,
      children: [
        {
          path: 'dashboard',
          name: 'Driver Dashboard',
          component: Dashboard
        },
        {
          path: 'order',
          name: 'Order List For Driver',
          component: OrderDashboard
        }
      ]
    }
  ]
})

export default router
