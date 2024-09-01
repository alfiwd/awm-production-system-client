<template>
  <div class="wrapper">
    <div class="banner-section">
      <p>Order Tracker</p>
      <img src="../assets/images/search.svg" />
    </div>
    <div class="input-section">
      <div class="input-wrapper">
        <a-input v-model:value="orderId" placeholder="Masukan id order" />
        <a-button
          type="primary"
          :disabled="!orderId"
          class="action-button"
          @click="handleOnCariClick"
          >Cari</a-button
        >
      </div>
    </div>
    <div v-if="isShowTracker" class="tracker-section">
      <div class="tracker-wrapper">
        <div
          v-for="(item, index) in paths"
          :key="index"
          class="step-wrapper"
          :style="{ opacity: item.isPassed ? 1 : 0.2 }"
        >
          <div class="illustration">
            <div class="icon">
              <svg-icon type="mdi" :path="item.path" size="50"></svg-icon>
            </div>
            <p>{{ item.status }}</p>
          </div>
          <hr v-if="index < paths.length - 1" />
        </div>
      </div>
      <div class="detail-button">
        <a-button type="primary" class="action-button" @click="handleOnDetailClick"
          >Detail</a-button
        >
      </div>
    </div>
    <div v-if="isShowDetail" class="detail-order-section">
      <div class="customer-data-wrapper">
        <a-row>
          <a-col :span="7">Nama customer </a-col>
          <a-col :span="2" style="text-align: center">:</a-col>
          <a-col :span="15">{{ orderData?.customer?.name }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="7">Alamat </a-col>
          <a-col :span="2" style="text-align: center">:</a-col>
          <a-col :span="15">{{ orderData?.customer?.address }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="7">Nomor handphone </a-col>
          <a-col :span="2" style="text-align: center">:</a-col>
          <a-col :span="15">{{ orderData?.customer?.phoneNumber }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="7">Email </a-col>
          <a-col :span="2" style="text-align: center">:</a-col>
          <a-col :span="12">{{ orderData?.customer?.email }}</a-col>
        </a-row>
      </div>
      <h1>Barang yang diorder</h1>
      <div>
        <a-table bordered :data-source="orderData?.orderDetail" :columns="columns"> </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon'
import {
  mdiFolderPlusOutline,
  mdiHandshakeOutline,
  mdiCartOutline,
  mdiProgressHelper,
  mdiTruckDeliveryOutline,
  mdiPackageVariantClosedCheck,
  mdiCashClock,
  mdiCheck,
  mdiFolderCancelOutline
} from '@mdi/js'
import { Modal } from 'ant-design-vue'

import { getOrder } from '../services/order'
import { getOrderDetailsByOrderId } from '../services/orderDetail'

export default {
  data() {
    return {
      orderId: null,
      originalPaths: [
        {
          path: mdiFolderPlusOutline,
          status: 'Order Dibuat',
          value: 'CREATED',
          isPassed: false
        },
        {
          path: mdiHandshakeOutline,
          status: 'Deal DP',
          value: 'DEAL_DP',
          isPassed: false
        },
        {
          path: mdiCartOutline,
          status: 'Belanja',
          value: 'SHOPPING',
          isPassed: false
        },
        {
          path: mdiProgressHelper,
          status: 'Dalam Proses',
          value: 'ON_PROCESS',
          isPassed: false
        },
        {
          path: mdiTruckDeliveryOutline,
          status: 'Dalam Pengiriman',
          value: 'IN_DELIVERY',
          isPassed: false
        },
        {
          path: mdiPackageVariantClosedCheck,
          status: 'Sampai Di Tempat Tujuan',
          value: 'DELIVERED',
          isPassed: false
        },
        {
          path: mdiCashClock,
          status: 'Menunggu Pelunasan Pembayaran',
          value: 'WAITING_FOR_FULL_PAYMENT',
          isPassed: false
        },
        {
          path: mdiCheck,
          status: 'Selesai',
          value: 'COMPLETE',
          isPassed: false
        }
      ],
      columns: [
        {
          title: 'Jumlah',
          dataIndex: 'quantity',
          key: 'quantity'
        },
        {
          title: 'Nama barang',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'Ukuran',
          dataIndex: 'size',
          key: 'size'
        },
        {
          title: 'Warna',
          dataIndex: 'color',
          key: 'color'
        },
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price'
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status'
        }
      ],
      paths: [],
      isShowTracker: false,
      isShowDetail: false,
      orderData: null
    }
  },

  components: {
    SvgIcon
  },

  methods: {
    async handleOnCariClick() {
      this.isShowTracker = false
      this.isShowDetail = false

      try {
        const getOrderResponse = await getOrder(this.orderId),
          indexFound = this.originalPaths.findIndex(
            (item) => item.value === getOrderResponse?.data?.data?.status
          ),
          newPaths = this.originalPaths.map((item, index) => {
            return index <= indexFound
              ? {
                  ...item,
                  isPassed: true
                }
              : {
                  ...item,
                  isPassed: false
                }
          })

        this.paths =
          getOrderResponse?.data?.data?.status === 'CANCEL'
            ? [
                {
                  path: mdiFolderCancelOutline,
                  status: 'Batal',
                  value: 'CANCEL',
                  isPassed: true
                }
              ]
            : newPaths

        if (getOrderResponse?.data?.status === 'Failed')
          return this.errorModal(getOrderResponse?.data?.message)

        const getOrderDetailsByOrderIdResponse = await getOrderDetailsByOrderId(
          getOrderResponse?.data?.data?.orderId
        )

        this.orderData = {
          customer: getOrderResponse?.data?.data?.customer,
          orderDetail: getOrderDetailsByOrderIdResponse?.data?.data?.map((item) => {
            return {
              ...item,
              name: item.item.name
            }
          }),
          status: getOrderResponse?.data?.data?.status
        }
        this.isShowTracker = true
      } catch (error) {
        console.log('error handleOnCariClick => ', error)
        this.errorModal(error?.getOrderResponse?.data?.message)
      }
    },
    handleOnDetailClick() {
      this.isShowDetail = true
    },
    errorModal(content) {
      Modal.error({
        title: 'Server error',
        content
      })
    }
  }
}
</script>

<style>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
  padding: 80px 24px;
}
.banner-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 100px;
}
.banner-section p {
  font-size: 40px;
  font-weight: 600;
}
.banner-section img {
  width: 35%;
}
.input-section {
  display: flex;
  width: max-content;
}
.input-wrapper {
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.action-button {
  width: 100px;
}
.tracker-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tracker-section .tracker-wrapper {
  display: flex;
  width: max-content;
}
.tracker-section .tracker-wrapper .step-wrapper {
  display: flex;
}
.tracker-section .tracker-wrapper .step-wrapper .illustration {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.tracker-section .tracker-wrapper .step-wrapper .illustration .icon {
  border: 2px dashed #568ab2;
  padding: 20px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tracker-section .tracker-wrapper .step-wrapper .illustration p {
  max-width: 95px;
  text-align: center;
}
.tracker-section .tracker-wrapper .step-wrapper hr {
  border: 2px dashed black;
  width: 80px;
  margin-top: 45px;
}
.detail-order-section {
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.detail-order-section .customer-data-wrapper {
  width: 50%;
}
</style>
