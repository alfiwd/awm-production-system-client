<template>
  <div class="container">
    <div class="top-row">
      <div class="left-side">
        <a-range-picker
          @change="(date1, date2) => handleSetTableDatas({ date1, date2 }, 'CHANGE_ORDER_DATE')"
          :placeholder="dateRangePlaceholder"
          style="width: 100%"
        />
      </div>
      <div class="right-side">
        <a-button type="primary" class="button-add-data" @click="handleAddData"
          >Buat Order</a-button
        >
      </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="state.orders"
      :scroll="{ x: 0 }"
      :loading="state.isLoading"
    >
      <template v-slot:bodyCell="{ record, column }">
        <template v-if="column.key === 'status'">
          <p>{{ orderStatusTransformer(record.status) }}</p>
        </template>
        <template v-else-if="column.key === 'proofOfDp'">
          <a-image
            v-if="record.proofOfDp"
            :width="200"
            :src="record.proofOfDp"
            @click="handleOnImageClick(record, 'proofOfDp', 'Foto bukti transfer DP')"
            :preview="false"
          />
          <p v-else>Belum diunggah</p>
        </template>
        <template v-else-if="column.key === 'proofOfReceipt'">
          <a-image
            v-if="record.proofOfReceipt"
            :width="200"
            :src="record.proofOfReceipt"
            @click="handleOnImageClick(record, 'proofOfReceipt', 'Foto bukti penerimaan barang')"
            :preview="false"
          />
          <p v-else>Belum diunggah oleh driver</p>
        </template>
        <template v-else-if="column.key === 'proofOfFullPayment'">
          <a-image
            v-if="record.proofOfFullPayment"
            :width="200"
            :src="record.proofOfFullPayment"
            @click="
              handleOnImageClick(
                record,
                'proofOfFullPayment',
                'Foto bukti transfer pelunasan pembayaran'
              )
            "
            :preview="false"
          />
          <p v-else>Belum diunggah</p>
        </template>
        <template v-else-if="column.key === 'action'">
          <div class="action-wrapper">
            <a-button
              type="primary"
              @click="handleOpenPaymentModal(record, 'Unggah foto bukti transfer DP', 'DP')"
              :disabled="record.isDisabledUploadDPButton"
            >
              Unggah foto bukti transfer DP
            </a-button>
            <a-button
              type="primary"
              @click="
                handleOpenPaymentModal(
                  record,
                  'Unggah foto bukti transfer pembayaran lunas',
                  'FULL_PAYMENT'
                )
              "
              :disabled="record.isDisabledUploadFullPaymentButton"
              >Unggah foto bukti transfer pembayaran lunas</a-button
            >
            <a-button type="primary" @click="handleSeeDetail(record.orderId)"
              >Lihat detail</a-button
            >
          </div>
        </template>
      </template>
    </a-table>
    <a-modal :visible="open" :title="state.previewTitle" @cancel="handleModalClose">
      <div v-if="paymentType === 'DP'">
        <p>
          Berikut harga yang perlu dibayarkan: <strong>{{ state.totalDp }}.</strong>
        </p>
        <p>
          Jika anda setuju dengan harga tersebut, dapat melakukan pembayaran awal (DP) terlebih
          dahulu sebesar 50% dari total harga <span>{{ state.totalPrice }}</span> agar pesanan dapat
          segera diproses.
        </p>
        <p>
          Jika tidak setuju, anda dapat melakukan pembatalan pesanan dengan cara menekan tombol
          tidak setuju. Setelah anda menekan tombol tidak setuju, pesanan akan dibatalkan dan tidak
          akan diproses lebih lanjut.
        </p>
      </div>
      <a-upload
        v-model:file-list="this.state.fileList"
        list-type="picture-card"
        @preview="handlePreview"
        :maxCount="1"
        :beforeUpload="handleBeforeUpload"
        accept="image/png, image/PNG, image/jpeg, image/JPEG, image/jpg, image/JPG"
      >
        <div>
          <plus-outlined />
          <div style="margin-top: 8px">Upload</div>
        </div>
      </a-upload>
      <template #footer>
        <a-button v-if="paymentType === 'DP'" type="danger" @click="handleCancelOrder"
          >Tidak Setuju</a-button
        >
        <a-button
          key="submit"
          type="primary"
          :loading="state.isUploadFileLoading"
          :disabled="this.state.fileList.length === 0 || this.state.fileList[0].url !== undefined"
          @click="handleOk"
          >Unggah</a-button
        >
      </template>
    </a-modal>
    <a-modal
      :visible="previewVisible"
      :title="previewFileName"
      :footer="null"
      @cancel="handleModalImageClose"
      width="1000px"
    >
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
    <a-modal
      :visible="isConfirmModalVisible"
      title="Batalkan pesanan"
      @ok="handleConfirmModalOk"
      @cancel="handleConfirmModalClose"
    >
      <p>{{ confirmModalContent }}</p>
    </a-modal>
  </div>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import moment from 'moment'
import { PlusOutlined } from '@ant-design/icons-vue'
import {
  ref as firebaseStorageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

import { getCustomers } from '../../../services/customer'
import { getOrdersBySearch, updateOrderOnly } from '../../../services/order'
import { updateStatusOrderDetail } from '../../../services/orderDetail'
import { customerOrder as orderColumn } from '../../../datas/tableColumn'
import { storage } from '../../../firebase'
import { orderStatusTransformer } from '../../../utils/statusTransformer'
import { formatRupiah } from '../../../utils/formatRupiah'
import { orderStatus } from '../../../utils/status'

const state = reactive({
    orders: [],
    table_data: [],
    customers: [],
    isLoading: false,
    thumbnailURL: null,
    selectedStatus: null,
    previewTitle: '',
    imageUpload: null,
    imageFileName: '',
    isUploadFileLoading: false,
    fileList: [],
    totalPrice: 0,
    totalDp: 0
  }),
  open = ref(false),
  previewVisible = ref(false),
  previewImage = ref(''),
  previewFileName = ref(''),
  isConfirmModalVisible = ref(false)

export default defineComponent({
  mounted() {
    this.handleSetTableDatas(null, 'GET_ALL')
    this.handleCreateOptions(
      getCustomers,
      'customerId',
      'customerId',
      'customers',
      'fetchGetCustomers'
    )
  },

  components: {
    PlusOutlined
  },

  setup() {
    return {
      columns: orderColumn,
      state,
      uploadedFile: null,
      open,
      previewVisible,
      previewImage,
      previewFileName,
      selectedOrderId: null,
      selectedStatusOption: null,
      selectedImageKey: null,
      dateFormatList: ['DD/MM/YYYY', 'DD/MM/YY'],
      selectedOrderStatus: null,
      selectedOrderStartDate: null,
      selectedOrderEndDate: null,
      dateRangePlaceholder: ['Mulai', 'Sampai'],
      orderStatusTransformer,
      formatRupiah,
      paymentType: null,
      orderStatus,
      isConfirmModalVisible,
      confirmModalContent: ''
    }
  },

  methods: {
    handleConfirmModalOk() {
      this.fetchCancelOrder()
    },
    handleConfirmModalClose() {
      isConfirmModalVisible.value = false
    },
    handleSetActionButtonDisabled(status, buttonType) {
      const indexFound = this.orderStatus.findIndex((item) => item === status)

      if (buttonType === 'DP') {
        return indexFound === 1 ? false : true
      } else {
        return indexFound === 6 ? false : true
      }
    },
    async fetchCancelOrder() {
      try {
        await updateOrderOnly(this.selectedOrderId, { status: 'CANCEL' })
      } catch (error) {
        console.log('error fetchCancelOrder => ', error)
        message.error(error?.response?.data?.message || 'Server error')
      } finally {
        this.handleSetTableDatas(null, 'GET_ALL')
        message.success('Pesanan berhasil dibatalkan')
        isConfirmModalVisible.value = false
      }
    },
    handleCancelOrder() {
      this.open = false
      isConfirmModalVisible.value = true
      this.confirmModalContent = 'Apakah kamu ingin membatalkan pesanan ini?'
    },
    handleOpenPaymentModal(record, modalTitle, paymentType) {
      this.open = true
      state.previewTitle = modalTitle
      this.paymentType = paymentType
      this.selectedOrderId = record.orderId
      this.state.totalPrice = record.totalPrice
      this.state.totalDp = record.totalDp
    },
    handleOnImageClick(val, key, title) {
      const indexFound = this.orderStatus.findIndex((item) => item === val.status)

      if (indexFound > 1) {
        return this.handlePreview(val, title, false, key)
      }

      this.selectedOrderId = val.orderId
      this.selectedStatus = val
      this.selectedImageKey = key
    },
    handleSeeDetail(params) {
      this.$router.push(`/customer/order/detail?orderId=${params}`)
    },
    handleAddData() {
      this.$router.push('/customer/order/tambah')
    },
    handleBeforeUpload(val) {
      this.state.imageUpload = val
      this.state.imageFileName = val.name
      return false
    },
    async fetchUpdateOrderDetailStatus(orderDetailId, status) {
      try {
        await updateStatusOrderDetail(orderDetailId, status)
      } catch (error) {
        console.log('error fetchUpdateOrderDetailStatus => ', error)
        message.error(error?.response?.data?.message || 'Server error')
      }
    },
    async fetchUpdateOrderOnly(payload) {
      try {
        const response = await updateOrderOnly(this.selectedOrderId, payload)

        if (payload.status === 'CANCEL') {
          await Promise.all(
            response?.data?.data?.order_detail?.map(async (item) => {
              return this.fetchUpdateOrderDetailStatus(item.orderDetailId, payload.status)
            })
          )
        }

        message.success(response?.data?.message)
        await this.handleSetTableDatas(null, 'GET_ALL')
      } catch (error) {
        console.log('error fetchUpdateOrderOnly => ', error)
        message.error(error?.response?.data?.message || 'Server error')
      }
    },
    async handlePreview(file, title, newImage = true, key) {
      const _title = title && `${title} - id order ${file.orderId || this.state.orderId}`

      if (newImage) {
        file.preview = await this.getBase64(file.originFileObj)
      }

      previewImage.value = file[key] || file.preview
      previewVisible.value = true
      previewFileName.value =
        _title || file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },
    handleOk() {
      this.state.isUploadFileLoading = true

      let imageRefToDeleteImage
      const firebaseFolder = {
        DP: 'proofOfDp',
        DELIVERED: 'proofOfReceipt',
        FULL_PAYMENT: 'proofOfFullPayment'
      }

      if (this.selectedImageKey && this.state.fileList[0].originFileObj) {
        switch (this.selectedImageKey) {
          case 'proofOfDp':
            imageRefToDeleteImage = firebaseStorageRef(storage, proofOfDp)
            break
          case 'proofOfReceipt':
            imageRefToDeleteImage = firebaseStorageRef(storage, proofOfReceipt)
            break
          case 'proofOfFullPayment':
            imageRefToDeleteImage = firebaseStorageRef(storage, proofOfFullPayment)
            break
        }

        deleteObject(imageRefToDeleteImage).then(() => {
          const imageRef = firebaseStorageRef(
            storage,
            `${this.selectedImageKey}/${this.state.imageFileName}-${Date.now()}`
          )

          uploadBytes(imageRef, this.state.imageUpload)
            .then(async (response) => {
              const imagePath = await getDownloadURL(response?.ref)
              let payload

              switch (this.selectedImageKey) {
                case 'proofOfDp':
                  payload = { proofOfDp: imagePath }
                  break
                case 'proofOfReceipt':
                  payload = { proofOfReceipt: imagePath }
                  break
                case 'proofOfFullPayment':
                  payload = { proofOfFullPayment: imagePath }
              }

              await this.fetchUpdateOrderOnly(payload)
            })
            .catch((error) => {
              console.log('error handleOk => ', error)
              message.error(error?.response?.data?.message || 'Server error')
            })
            .finally(() => {
              this.state.isUploadFileLoading = false
              open.value = false
              this.state.thumbnailURL = null
              this.state.fileList = []
            })
        })
      } else if (imageRefToDeleteImage) {
        switch (this.selectedStatus.status) {
          case 'DEAL_DP':
            imageRefToDeleteImage = proofOfDp ? firebaseStorageRef(storage, proofOfDp) : null
            break
          case 'DELIVERED':
            imageRefToDeleteImage = proofOfReceipt
              ? firebaseStorageRef(storage, proofOfReceipt)
              : null
            break
          case 'COMPLETE':
            imageRefToDeleteImage = proofOfFullPayment
              ? firebaseStorageRef(storage, proofOfFullPayment)
              : null
            break
        }

        deleteObject(imageRefToDeleteImage)
          .then(() => {
            const imageRef = firebaseStorageRef(
              storage,
              `${firebaseFolder[status]}/${this.state.imageFileName}-${Date.now()}`
            )

            uploadBytes(imageRef, this.state.imageUpload)
              .then(async (response) => {
                const imagePath = await getDownloadURL(response?.ref)
                let payload

                switch (status) {
                  case 'DEAL_DP':
                    payload = { proofOfDp: imagePath, status }
                    break
                  case 'DELIVERED':
                    payload = { proofOfReceipt: imagePath, status }
                    break
                  case 'COMPLETE':
                    payload = { proofOfFullPayment: imagePath, status }
                }

                await this.fetchUpdateOrderOnly(payload)
              })
              .catch((error) => {
                console.log('error handleOk => ', error)
                message.error(error?.response?.data?.message || 'Server error')
              })
              .finally(() => {
                this.state.isUploadFileLoading = false
                open.value = false
                this.state.thumbnailURL = null
                this.state.fileList = []
              })
          })
          .catch((error) => {
            console.log('error handleOk (delete image) => ', error)
            message.error(error?.response?.data?.message || 'Server error')
            this.state.isUploadFileLoading = false
          })
      } else {
        const imageRef = firebaseStorageRef(
          storage,
          `${firebaseFolder[this.paymentType]}/${this.state.imageFileName}-${Date.now()}`
        )
        console.log(this.state.imageUpload)
        uploadBytes(imageRef, this.state.imageUpload)
          .then(async (response) => {
            const imagePath = await getDownloadURL(response?.ref)
            let payload

            switch (this.paymentType) {
              case 'DP':
                payload = {
                  proofOfDp: imagePath,
                  status: 'WAITING_FOR_ORDER_CONFIRMATION_FROM_ADMIN'
                }
                break
              case 'FULL_PAYMENT':
                payload = {
                  proofOfFullPayment: imagePath,
                  status: 'WAITING_FOR_PAYMENT_CONFIRMATION_FROM_ADMIN'
                }
                break
            }

            await this.fetchUpdateOrderOnly(payload)
          })
          .catch((error) => {
            console.log('error handleOk => ', error)
            message.error(error?.response?.data?.message || 'Server error')
          })
          .finally(() => {
            this.state.isUploadFileLoading = false
            open.value = false
            this.state.thumbnailURL = null
            this.state.fileList = []
          })
      }
    },
    handleModalClose() {
      open.value = false
      this.handleSetTableDatas(null, 'KEEP_FILTER')
      this.state.fileList = []
      this.selectedImageKey = null
      state.previewTitle = ''
    },
    handleModalImageClose() {
      previewVisible.value = false
    },
    createThumbnail(file) {
      const reader = new FileReader()

      reader.onload = (e) => {
        this.state.thumbnailURL = e.target.result
      }

      reader.readAsDataURL(file)
    },
    async handleCreateOptions(service, additionalKey, id, stateKey, errorDesc) {
      try {
        const response = await service()
        let newArr = []

        response?.data?.data?.map((item) =>
          newArr.push({
            value: additionalKey ? item.name + '-' + item[additionalKey] : item.name,
            label: item.name,
            id: item[id]
          })
        )

        newArr.unshift({
          value: 'all',
          label: 'SEMUA'
        })
        state[stateKey] = newArr
      } catch (error) {
        console.log(`error ${errorDesc} => `, error)
        message.error(error?.response?.data?.message || 'Server error')
      }
    },
    async handleSetTableDatas(item, type) {
      this.state.isLoading = true

      switch (type) {
        case 'CHANGE_ORDER_STATUS':
          this.selectedStatusOption = item?.value ? item.value : null
          break
        case 'CHANGE_ORDER_DATE':
          this.selectedOrderStartDate = item?.date2?.[0]
          this.selectedOrderEndDate = item?.date2?.[1]
          break
        case 'GET_ALL':
          this.selectedOrderStartDate = null
          this.selectedOrderEndDate = null
          break
      }

      try {
        const response = await getOrdersBySearch(
            localStorage.getItem('customerId'),
            this.selectedStatusOption,
            this.selectedOrderStartDate,
            this.selectedOrderEndDate
          ),
          createdAt = (val) => moment(val).format('DD MMM YYYY HH:mm:ss'),
          updatedAt = (val) => moment(val).format('DD MMM YYYY HH:mm:ss'),
          totalPriceCounter = (array) => {
            let price = null

            array.map((item) => {
              if (item.totalPrice) {
                let isRp = item.totalPrice.includes('Rp')

                if (isRp) price = price + Number(item.totalPrice.replace('Rp', '').replace('.', ''))
              } else price = price + Number((item.price || item.totalPrice) * item.quantity)
            })

            return price
          }
        let newArr = []

        response?.data?.data?.map((item, index) =>
          newArr.push({
            no: index + 1,
            name: item.customer.name,
            address: item.customer.address,
            orderId: item.orderId,
            status: item.status,
            proofOfDp: item.proofOfDp,
            proofOfReceipt: item.proofOfReceipt,
            proofOfFullPayment: item.proofOfFullPayment,
            createdAt: createdAt(item.createdAt),
            updatedAt: item.status === 'COMPLETE' ? updatedAt(item.updatedAt) : '-',
            totalPrice: this.formatRupiah(totalPriceCounter(item.order_detail)),
            isDisabledUploadDPButton: this.handleSetActionButtonDisabled(item.status, 'DP'),
            isDisabledUploadFullPaymentButton: this.handleSetActionButtonDisabled(
              item.status,
              'FULL_PAYMENT'
            ),
            totalDp: this.formatRupiah(totalPriceCounter(item.order_detail) / 2)
          })
        )

        state.orders = newArr
        state.totalPrice = this.formatRupiah(totalPriceCounter(newArr))
      } catch (error) {
        console.log('error handleSetTableDatas => ', error)
        message.error(error?.response?.data?.message || 'Server error')
      } finally {
        this.state.isLoading = false
      }
    }
  }
})
</script>

<style>
.container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.button-add-data {
  width: max-content;
}
.action-button-wrapper {
  display: flex;
  gap: 8px;
}
@media (max-width: 768px) {
  .action-button-wrapper {
    flex-direction: column;
  }
}
.top-row {
  display: flex;
  justify-content: space-between;
}
.top-row .left-side {
  display: flex;
  justify-content: flex-start;
  width: 400px;
}
.top-row .right-side {
  width: max-content;
}
.action-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
