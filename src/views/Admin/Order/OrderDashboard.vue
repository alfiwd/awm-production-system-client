<template>
  <div class="container">
    <div class="top-row">
      <div class="left-side">
        <a-range-picker
          @change="(date1, date2) => handleSetTableData({ date1, date2 }, 'CHANGE_ORDER_DATE')"
          :placeholder="dateRangePlaceholder"
          style="width: 100%"
        />
      </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="state.orders"
      :scroll="{ x: 0 }"
      :loading="state.isLoading"
    >
      <template v-slot:bodyCell="{ record, column }">
        <template v-if="column?.key === 'status'">
          <p>{{ orderStatusTransformerForAdmin(record.status) }}</p>
        </template>
        <template v-else-if="column?.key === 'proofOfDp'">
          <a-image
            v-if="record.proofOfDp"
            :width="200"
            :src="record.proofOfDp"
            @click="
              handlePreview({
                file: record,
                title: 'Foto bukti transfer DP',
                newImage: false,
                key: 'proofOfDp'
              })
            "
            :preview="false"
          />
          <p v-else>Belum diunggah oleh pemesan</p>
        </template>
        <template v-else-if="column?.key === 'proofOfReceipt'">
          <a-image
            v-if="record.proofOfReceipt"
            :width="200"
            :src="record.proofOfReceipt"
            @click="
              handlePreview({
                file: record,
                title: 'Foto bukti penerimaan barang',
                newImage: false,
                key: 'proofOfReceipt'
              })
            "
            :preview="false"
          />
          <p v-else>Belum diunggah oleh driver</p>
        </template>
        <template v-else-if="column?.key === 'proofOfFullPayment'">
          <a-image
            v-if="record.proofOfFullPayment"
            :width="200"
            :src="record.proofOfFullPayment"
            @click="
              handlePreview({
                file: record,
                title: 'Foto bukti transfer pelunasan pembayaran',
                newImage: false,
                key: 'proofOfFullPayment'
              })
            "
            :preview="false"
          />
          <p v-else>Belum diunggah oleh pemesan</p>
        </template>
        <template v-else-if="column?.key === 'action'">
          <div class="action-wrapper" v-if="state.role === 'ADMIN'">
            <a-button
              type="primary"
              :disabled="record.isDisabledPublishPriceButtonInDashboard"
              @click="handleOnPublishPriceClick(record.orderId)"
              >Terbitkan harga</a-button
            >
            <a-button
              type="primary"
              :disabled="record.isDisabledOrderConfirmation"
              @click="handleOnOrderConfirmationClick(record.orderId)"
              >Konfirmasi pesanan</a-button
            >
            <a-button
              type="primary"
              :disabled="record.isDisabledPrintDeliveryNote"
              @click="handleOnGenerateDeliveryNoteClick(record.orderId)"
              >Cetak surat jalan</a-button
            >
            <a-button
              type="primary"
              :disabled="record.isDisabledFullPaymentConfirmation"
              @click="handleOnFullPaymentClick(record.orderId)"
              >Konfirmasi pelunasan pembayaran</a-button
            >
            <a-button type="primary" @click="handleSeeDetail(record.orderId)"
              >Lihat detail</a-button
            >
          </div>
          <div v-else>
            <a-button
              type="primary"
              :disabled="record.isDisabledOrderDeliveredButton"
              @click="handleOnPesananSampaiClick(record.orderId)"
              >Pesanan sampai</a-button
            >
          </div>
        </template>
      </template>
    </a-table>
    <a-modal :visible="open" :title="state.previewTitle" @cancel="handleModalClose">
      <a-upload
        v-model:file-list="this.state.fileList"
        list-type="picture-card"
        @preview="(file) => handlePreview({ file, title: 'Foto bukti penerimaan barang' })"
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
      :visible="openFormModal"
      :title="`Form terbitkan harga - Id order ${state.orderId}`"
      @ok="handleTerbitkanHarga"
      @cancel="handleOnFormModalClose"
      width="1000px"
      okText="Terbitkan harga"
      :confirmLoading="state.isLoadingPublishPriceButton"
      :ok-button-props="{ disabled: state.isDisabledPublishPriceButtonInForm }"
    >
      <a-form>
        <a-form-item>
          <a-table
            bordered
            :data-source="table_datas_ref"
            :columns="publishPriceColumns"
            style="width: auto"
            :scroll="{ x: 740 }"
            :loading="state.isLoadingPublishPrice"
          >
            <template #bodyCell="{ column, text, record }">
              <template v-if="column.key === 'price'">
                <a-input-number
                  id="inputNumber"
                  v-model:value="state.price[record.key - 1]"
                  :min="1"
                />
              </template>
              <div
                v-else-if="column.dataIndex === 'sample' && record.sample"
                class="sample-wrapper"
              >
                <img
                  v-for="(imageUrl, index) in record.sample"
                  :key="index"
                  alt="example"
                  style="width: 100px"
                  :src="imageUrl.thumbUrl"
                  @click="handlePreview({ file: imageUrl.thumbUrl, newImage: false })"
                />
              </div>
              <div v-else>
                {{ text || '-' }}
              </div>
            </template>
          </a-table>
        </a-form-item>
      </a-form>
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
  </div>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue'
import { Modal, message } from 'ant-design-vue'
import moment from 'moment'
import { PlusOutlined } from '@ant-design/icons-vue'
import {
  ref as firebaseStorageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import jsPDF from 'jspdf'

import { getCustomers } from '../../../services/customer'
import { getOrdersBySearch, updateOrderOnly, getOrder, updateOrder } from '../../../services/order'
import { updateStatusOrderDetail } from '../../../services/orderDetail'
import { order as orderColumn, manageOrder, driverOrder } from '../../../datas/tableColumn'
import { storage } from '../../../firebase'
import { orderStatusTransformerForAdmin } from '../../../utils/statusTransformer'
import { getOrderDetailsByOrderId } from '../../../services/orderDetail'
import { formatRupiah } from '../../../utils/formatRupiah'
import { orderStatus } from '../../../utils/status'

let table_datas_ref = ref([])
const editable_data = reactive({}),
  state = reactive({
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
    price: [],
    orderId: null,
    isLoadingPublishPrice: false,
    isLoadingPublishPriceButton: false,
    isDisabledPublishPriceButtonInForm: true,
    role: null,
    adminId: null
  }),
  open = ref(false),
  previewVisible = ref(false),
  previewImage = ref(''),
  previewFileName = ref(''),
  openFormModal = ref(false)

export default defineComponent({
  mounted() {
    const role = localStorage.getItem('role'),
      adminId = Number(localStorage.getItem('adminId'))

    this.handleSetTableData(
      role === 'DRIVER' ? { value: 'IN_DELIVERY' } : null,
      'CHANGE_ORDER_STATUS'
    )
    this.handleCreateOptions(
      getCustomers,
      'customerId',
      'customerId',
      'customers',
      'fetchGetCustomers'
    )
    this.state.role = role
    this.state.adminId = adminId
    this.columns = role === 'DRIVER' ? driverOrder : orderColumn
  },

  components: {
    PlusOutlined
  },

  setup() {
    return {
      columns: null,
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
      selectedCustomerId: null,
      selectedOrderStatus: null,
      selectedOrderStartDate: null,
      selectedOrderEndDate: null,
      dateRangePlaceholder: ['Mulai', 'Sampai'],
      orderStatusTransformerForAdmin,
      publishPriceColumns: manageOrder({ withAction: false, withStatus: false }),
      table_datas_ref,
      editable_data,
      openFormModal,
      formatRupiah,
      orderStatus,
      selectedOrder: null
    }
  },

  watch: {
    combinedData: {
      deep: true,
      handler() {
        this.publishPriceButtonChecker()
      }
    }
  },

  computed: {
    combinedData() {
      return {
        price: state.price
      }
    }
  },

  methods: {
    handleOnFullPaymentClick(orderId) {
      this.confirmModal(
        () => this.fetchUpdateOrderOnly({ status: 'COMPLETE', adminId: state.adminId }, orderId),
        () => {},
        `Apakah ingin konfirmasi pelunasan pembayaran dengan order id ${orderId}?`,
        'Jika menekan tombol "OK", pesanan akan selesai.'
      )
    },
    handleOnPesananSampaiClick(orderId) {
      open.value = true
      this.state.previewTitle = 'Unggah foto bukti penerimaan barang'
      this.state.orderId = orderId
    },
    toDataURL(url, callback) {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        const reader = new FileReader()
        reader.onloadend = function () {
          callback(reader.result)
        }
        reader.readAsDataURL(xhr.response)
      }
      xhr.open('GET', url)
      xhr.responseType = 'blob'
      xhr.send()
    },
    generateDeliveryNote(dataUrl, orderId) {
      const pdfName = `Surat jalan order ${orderId}`,
        doc = new jsPDF({
          orientation: 'landscape'
        }),
        date = new Date(),
        data = table_datas_ref.value

      // Company detail
      doc.addImage(dataUrl, 'jpg', 10, 5, 270, 30)

      doc.text('SURAT PENGIRIMAN BARANG', 100, 52)

      // Customer detail
      doc.text(`Nomor pesanan : ${this.selectedOrder?.orderId}`, 10, 66)
      doc.text(`Kepada              : ${this.selectedOrder?.customer?.name}`, 10, 73)
      doc.text(`Alamat  : ${this.selectedOrder?.customer?.address}`, 180, 66)
      doc.text(`Tanggal : ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`, 180, 73)

      // Menambahkan teks untuk judul kolom
      doc.text('No', 13, 87)
      doc.text('Nama barang', 28, 87)
      doc.text('Warna', 103, 87)
      doc.text('Size', 143, 87)
      doc.text('Jumlah', 163, 87)
      doc.text('Keterangan', 188, 87)

      // Menggambar garis horizontal untuk memisahkan baris
      doc.setLineWidth(0.1)
      doc.line(10, 80, 285, 80)
      doc.line(10, 90, 285, 90)

      // Menambahkan data per baris
      var yPos = 97 // Mulai dari posisi baris pertama
      for (var i = 0; i < data.length; i++) {
        var row = data[i]
        doc.text(`${i + 1}`, 13, yPos)
        doc.text(row.productName, 28, yPos)
        doc.text(row.color, 103, yPos)
        doc.text(row.size, 143, yPos)
        doc.text(`${row.quantity}`, 163, yPos)
        doc.text(row.description || '-', 188, yPos)
        doc.line(10, yPos + 3, 285, yPos + 3) // Garis horizontal di bawah setiap baris
        yPos += 10 // Naik ke baris berikutnya
      }

      // Menggambar garis vertikal untuk memisahkan kolom
      doc.line(10, 80, 10, yPos - 7) // Garis sebelum kolom 'No'
      doc.line(25, 80, 25, yPos - 7) // Garis setelah kolom 'No'
      doc.line(100, 80, 100, yPos - 7) // Garis setelah kolom 'Nama barang'
      doc.line(140, 80, 140, yPos - 7) // Garis setelah kolom 'Warna'
      doc.line(160, 80, 160, yPos - 7) // Garis setelah kolom 'Size'
      doc.line(185, 80, 185, yPos - 7) // Garis setelah kolom 'Jumlah'
      doc.line(285, 80, 285, yPos - 7) // Garis setelah kolom 'Keterangan'

      // Footer
      doc.text('Penerima', 28, yPos - 7 + 15)
      doc.text('....................', 28, yPos - 7 + 45)
      doc.text('Pengirim', 188, yPos - 7 + 15)
      doc.text('....................', 188, yPos - 7 + 45)

      doc.save(pdfName + '.pdf')
    },
    generateInvoice(dataUrl) {
      const date = new Date(),
        pdfName = `Invoice INV-${date.getDate()}${
          date.getMonth() + 1
        }${date.getFullYear()}-${Date.now()}`,
        doc = new jsPDF({
          orientation: 'landscape'
        }),
        data = table_datas_ref.value

      // Company detail
      doc.addImage(dataUrl, 'jpg', 10, 5, 270, 30)

      doc.text('INVOICE', 130, 52)
      doc.text(
        `No: INV-${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}-${Date.now()}`,
        100,
        62
      )

      // Customer detail
      // doc.text(`Nomor pesanan : ${this.selectedOrder?.orderId}`, 10, 66)
      doc.text(`Nomor pesanan : ${this.selectedOrder?.orderId}`, 10, 76)
      doc.text(`Kepada              : ${this.selectedOrder?.customer?.name}`, 10, 83)
      doc.text(`Alamat  : ${this.selectedOrder?.customer?.address}`, 180, 76)
      doc.text(`Tanggal : ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`, 180, 83)

      // Menambahkan teks untuk judul kolom
      doc.text('No', 13, 97)
      doc.text('Nama barang', 28, 97)
      doc.text('Harga', 123, 97)
      doc.text('Jumlah', 163, 97)
      doc.text('Total Harga', 188, 97)

      // Menggambar garis horizontal untuk memisahkan baris
      doc.setLineWidth(0.1)
      doc.line(10, 90, 285, 90)
      doc.line(10, 100, 285, 100)

      // Menambahkan data per baris
      var yPos = 107 // Mulai dari posisi baris pertama
      for (var i = 0; i < data.length; i++) {
        var row = data[i]
        doc.text(`${i + 1}`, 13, yPos)
        doc.text(row.productName, 28, yPos)
        doc.text(this.formatRupiah(`${row.price}`), 123, yPos)
        doc.text(`${row.quantity}`, 163, yPos)
        doc.text(this.formatRupiah(row.price * row.quantity), 188, yPos)
        doc.line(10, yPos + 3, 285, yPos + 3) // Garis horizontal di bawah setiap baris
        yPos += 10 // Naik ke baris berikutnya
      }

      // Menggambar garis vertikal untuk memisahkan kolom
      doc.line(10, 90, 10, yPos - 7) // Garis sebelum kolom 'No'
      doc.line(25, 90, 25, yPos - 7) // Garis setelah kolom 'No'
      doc.line(120, 90, 120, yPos - 7) // Garis setelah kolom 'Nama barang'
      doc.line(160, 90, 160, yPos - 7) // Garis setelah kolom 'Harga'
      doc.line(185, 90, 185, yPos - 7) // Garis setelah kolom 'Jumlah'
      doc.line(285, 90, 285, yPos - 7) // Garis setelah kolom 'Total harga'

      // Harga yang harus dibayarkan
      doc.text(
        `Sisa pembayaran yang harus dibayarkan: ${this.formatRupiah(
          this.totalPriceCounter(this.selectedOrder.order_detail) / 2
        )}`,
        // 168,
        130,
        yPos - 7 + 10
      )

      // Footer
      doc.text(`Tangerang Selatan, ${moment().format('DD MMM YYYY')}`, 28, yPos - 7 + 25)
      doc.text('....................', 28, yPos - 7 + 55)

      doc.save(pdfName + '.pdf')

      table_datas_ref.value = []
    },
    async handleToGenerateDeliveryNote(orderId) {
      await this.fetchGetOrderByOrderId(orderId)

      try {
        const response = await updateOrderOnly(orderId, {
          status: 'IN_DELIVERY',
          adminId: state.adminId
        })

        if (response?.data?.status === 'Success') {
          this.handleSetTableData(null, 'GET_ALL')
          const imgUrl = '../../../../public/kop.jpg'

          this.toDataURL(imgUrl, (dataUrl) => {
            this.generateDeliveryNote(dataUrl, orderId)
            this.generateInvoice(dataUrl)
          })
        }
      } catch (error) {
        console.log('error handleToGenerateDeliveryNote => ', error)
      }
    },
    handleOnGenerateDeliveryNoteClick(orderId) {
      // this.handleToGenerateDeliveryNote(orderId)
      this.confirmModal(
        () => this.handleToGenerateDeliveryNote(orderId),
        () => {},
        `Apakah ingin mencetak surat jalan dengan order id ${orderId}?`,
        'Mohon pastikan kembali, jika surat jalan sudah dicetak, status order akan berubah menjadi "Pesanan sedang dalam perjalanan ke alamat pemesan".'
      )
    },
    async handleToConfirmOrder(orderId) {
      try {
        const response = await updateOrderOnly(orderId, {
          status: 'IN_PROCESS',
          adminId: state.adminId
        })

        if (response?.data?.status === 'Success') {
          message.success('Pesanan berhasil dikonfirmasi')
          this.handleSetTableData(null, 'GET_ALL')
        }
      } catch (error) {
        console.log('error handleToConfirmOrder => ', error)
        this.errorModal(
          error?.response?.data?.status || 'Failed',
          error?.response?.data?.message || 'Server error'
        )
      }
    },
    handleOnOrderConfirmationClick(orderId) {
      this.confirmModal(
        () => this.handleToConfirmOrder(orderId),
        () => {},
        `Apakah ingin konfirmasi pesanan dengan id order ${orderId}?`,
        'Pastikan kembali foto bukti transfer sudah valid (benar).'
      )
    },
    handleSetActionButtonDisabled(status, buttonType) {
      const indexFound = this.orderStatus.findIndex((item) => item === status)

      if (buttonType === 'PUBLISH_PRICE') {
        return indexFound === 0 ? false : true
      } else if (buttonType === 'ORDER_CONFIRMATION') {
        return indexFound === 2 ? false : true
      } else if (buttonType === 'DELIVERY_NOTE') {
        return indexFound === 4 ? false : true
      } else if (buttonType === 'ORDER_DELIVERED') {
        return indexFound === 5 ? false : true
      } else {
        return indexFound === 7 ? false : true
      }
    },
    publishPriceButtonChecker() {
      table_datas_ref.value.map((_, index) => {
        table_datas_ref.value[index].totalPrice = this.formatRupiah(
          this.state.price[index] * table_datas_ref.value[index].quantity
        )
      })
      state.price?.filter((item) => item).length === table_datas_ref.value.length
        ? (state.isDisabledPublishPriceButtonInForm = false)
        : (state.isDisabledPublishPriceButtonInForm = true)
    },
    async handleTerbitkanHarga() {
      state.isLoadingPublishPriceButton = true

      try {
        let orderDetail = [],
          payload

        table_datas_ref.value.map((item, index) =>
          orderDetail.push({
            orderDetailId: item.orderDetailId,
            price: state.price[index]
          })
        )
        payload = {
          order: {
            status: 'WAITING_FOR_DP',
            adminId: state.adminId
          },
          orderDetail
        }

        const response = await updateOrder(state.orderId, payload, true)

        if (response?.data?.status === 'Success') {
          message.success('Harga berhasil diterbitkan')
          this.handleOnFormModalClose()
          this.handleSetTableData(null, 'GET_ALL')
        }
      } catch (error) {
        console.log('error => handleTerbitkanHarga', error)
        this.errorModal(
          error?.response?.data?.status || 'Failed',
          error?.response?.data?.message || 'Server error'
        )
      } finally {
        state.isLoadingPublishPriceButton = false
      }
    },
    handleOnFormModalClose() {
      this.openFormModal = false
      table_datas_ref.value = []
      this.state.price = []
      this.state.orderId = null
    },
    handleAddColumn(value) {
      const key =
          table_datas_ref.value.length === 0 ? 1 : Number(table_datas_ref.value.at(-1).key) + 1,
        {
          quantity,
          productName,
          size,
          color,
          orderDetailId,
          status,
          orderId,
          description,
          sample,
          price,
          totalPrice,
          itemId
        } = value

      table_datas_ref.value.push({
        key,
        quantity,
        productName,
        size,
        color,
        orderDetailId,
        status,
        orderId,
        description,
        sample,
        price,
        totalPrice,
        itemId
      })
    },
    handleFillAllData(orderDetail) {
      orderDetail.map((item, index) => {
        this.handleAddColumn({
          key: index + 1,
          quantity: item.quantity,
          productName: item.productName,
          size: item.size,
          color: item.color,
          description: item.description,
          sample: item?.sample
            ? item?.sample?.split(',')?.map((item) => {
                return {
                  name: 'image',
                  status: 'done',
                  url: item,
                  thumbUrl: item
                }
              })
            : null,
          orderDetailId: item.orderDetailId,
          orderId: item.orderId,
          itemId: item.itemId,
          price: item.price
        })
      })
    },
    async fetchGetOrderByOrderId(orderId) {
      this.state.isLoadingPublishPrice = true

      try {
        const getOrderResponse = await getOrder(orderId),
          responseMessage = getOrderResponse?.data?.message

        if (getOrderResponse?.data?.status === 'Success') {
          const getOrderDetailsByOrderIdResponse = await getOrderDetailsByOrderId(
            getOrderResponse?.data?.data?.orderId
          )

          this.selectedOrder = getOrderResponse?.data?.data

          if (getOrderDetailsByOrderIdResponse?.data?.status === 'Success') {
            this.handleFillAllData(getOrderDetailsByOrderIdResponse?.data?.data)
          }
        } else {
          message.error(responseMessage)
          this.$router.push('/admin/order')
        }
      } catch (error) {
        console.log('error fetchGetOrderByOrderId => ', error)
        this.errorModal(error?.response?.data?.status, error?.response?.data?.message)
      } finally {
        this.state.isLoadingPublishPrice = false
      }
    },
    handleOnPublishPriceClick(orderId) {
      this.openFormModal = true
      this.fetchGetOrderByOrderId(orderId)
      this.state.orderId = orderId
    },
    handleOnClickImage(val, key) {
      this.selectedOrderId = val.orderId
      this.selectedStatus = val
      this.selectedImageKey = key

      switch (key) {
        case 'proofOfDp':
          open.value = true
          this.state.previewTitle = 'Unggah Bukti Transfer'
          this.state.fileList = [
            {
              name: 'Bukti Transfer',
              status: 'done',
              url: val.proofOfDp
            }
          ]
          break
        case 'proofOfDeliveryOrder':
          open.value = true
          this.state.previewTitle = 'Unggah Bukti Surat Jalan'
          this.state.fileList = [
            {
              name: 'Bukti Surat Jalan',
              status: 'done',
              url: val.proofOfDeliveryOrder
            }
          ]
          break
        case 'proofOfFullPayment':
          open.value = true
          this.state.previewTitle = 'Unggah Bukti Transfer Pelunasan Pembayaran'
          this.state.fileList = [
            {
              name: 'Bukti Transfer Pelunasan Pembayaran',
              status: 'done',
              url: val.proofOfFullPayment
            }
          ]
          break
      }
    },
    handleSeeDetail(params) {
      this.$router.push(`/admin/order/detail?orderId=${params}`)
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
        this.errorModal(error?.response?.data?.status, error?.response?.data?.message)
      }
    },
    async fetchUpdateOrderOnly(payload, orderId) {
      try {
        const response = await updateOrderOnly(this.state.orderId || orderId, payload)

        if (payload.status === 'CANCEL') {
          await Promise.all(
            response?.data?.data?.order_detail?.map(async (item) => {
              return this.fetchUpdateOrderDetailStatus(item.orderDetailId, payload.status)
            })
          )
        }

        message.success(response?.data?.message)
        await this.handleSetTableData(null, 'GET_ALL')
      } catch (error) {
        console.log('error fetchUpdateOrderOnly => ', error)
        this.errorModal(
          error?.response?.data?.status || 'Error',
          error?.response?.data?.message || 'Server error'
        )
      }
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },
    async handlePreview({ file, title, newImage = true, key }) {
      const _title = title && `${title} - id order ${file.orderId || this.state.orderId}`

      if (newImage) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      previewImage.value = file[key] || file.preview || file
      previewVisible.value = true
      previewFileName.value = _title || 'image'
    },
    updateOrderStatus(val, item) {
      this.selectedOrderId = item.orderId
      this.selectedStatus = item
      this.fetchUpdateOrderOnly({ status: val })
    },
    handleOk() {
      this.state.isUploadFileLoading = true

      let imageRefToDeleteImage
      const firebaseFolder = {
        DEAL_DP: 'proofOfDp',
        DELIVERED: 'proofOfDeliveryOrder',
        COMPLETE: 'proofOfFullPayment'
      }

      if (this.selectedImageKey && this.state.fileList[0].originFileObj) {
        switch (this.selectedImageKey) {
          case 'proofOfDp':
            imageRefToDeleteImage = firebaseStorageRef(storage, proofOfDp)
            break
          case 'proofOfDeliveryOrder':
            imageRefToDeleteImage = firebaseStorageRef(storage, proofOfDeliveryOrder)
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
                case 'proofOfDeliveryOrder':
                  payload = { proofOfDeliveryOrder: imagePath }
                  break
                case 'proofOfFullPayment':
                  payload = { proofOfFullPayment: imagePath }
              }

              await this.fetchUpdateOrderOnly(payload)
            })
            .catch((error) => {
              console.log('error handleOk => ', error)
              this.errorModal(
                error?.response?.data?.status || 'Error',
                error?.response?.data?.message || 'Server error'
              )
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
            imageRefToDeleteImage = proofOfDeliveryOrder
              ? firebaseStorageRef(storage, proofOfDeliveryOrder)
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
                    payload = { proofOfDeliveryOrder: imagePath, status }
                    break
                  case 'COMPLETE':
                    payload = { proofOfFullPayment: imagePath, status }
                }

                await this.fetchUpdateOrderOnly(payload)
              })
              .catch((error) => {
                console.log('error handleOk => ', error)
                this.errorModal(
                  error?.response?.data?.status || 'Error',
                  error?.response?.data?.message || 'Server error'
                )
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
            this.errorModal(
              error?.response?.data?.status || 'Error',
              error?.response?.data?.message || 'Server error'
            )
            this.state.isUploadFileLoading = false
          })
      } else {
        const imageRef = firebaseStorageRef(
          storage,
          `proofOfReceipt/${this.state.imageFileName}-${Date.now()}`
        )
        uploadBytes(imageRef, this.state.imageUpload)
          .then(async (response) => {
            const imagePath = await getDownloadURL(response?.ref),
              payload = {
                proofOfReceipt: imagePath,
                status: 'WAITING_FOR_FULL_PAYMENT',
                adminId: state.adminId
              }

            await this.fetchUpdateOrderOnly(payload)
          })
          .catch((error) => {
            console.log('error handleOk => ', error)
            this.errorModal(
              error?.response?.data?.status || 'Error',
              error?.response?.data?.message || 'Server error'
            )
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
      this.handleSetTableData(null, 'KEEP_FILTER')
      this.state.fileList = []
      this.selectedImageKey = null
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
        this.errorModal(error?.response?.data?.status, error?.response?.data?.message)
      }
    },
    totalPriceCounter(array) {
      let price = null

      array.map((item) => {
        if (item.totalPrice) {
          let isRp = item.totalPrice.includes('Rp')

          if (isRp) price = price + Number(item.totalPrice.replace('Rp', '').replace('.', ''))
        } else {
          price = price + Number((item.price || item.totalPrice) * item.quantity)
        }
      })

      return price
    },
    async handleSetTableData(item, type) {
      this.state.isLoading = true

      switch (type) {
        case 'CHANGE_CUSTOMER_NAME':
          this.selectedCustomerId = item?.id ? item.id : null
          break
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
            this.selectedCustomerId,
            this.selectedStatusOption,
            this.selectedOrderStartDate,
            this.selectedOrderEndDate
          ),
          createdAt = (val) => moment(val).format('DD MMM YYYY HH:mm:ss'),
          updatedAt = (val) => moment(val).format('DD MMM YYYY HH:mm:ss')
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
            totalPrice: this.formatRupiah(this.totalPriceCounter(item.order_detail)),
            isDisabledPublishPriceButtonInDashboard: this.handleSetActionButtonDisabled(
              item.status,
              'PUBLISH_PRICE'
            ),
            isDisabledOrderConfirmation: this.handleSetActionButtonDisabled(
              item.status,
              'ORDER_CONFIRMATION'
            ),
            isDisabledPrintDeliveryNote: this.handleSetActionButtonDisabled(
              item.status,
              'DELIVERY_NOTE'
            ),
            isDisabledFullPaymentConfirmation: this.handleSetActionButtonDisabled(
              item.status,
              'FULL_PAYMENT_CONFIRMATION'
            ),
            isDisabledOrderDeliveredButton: this.handleSetActionButtonDisabled(
              item.status,
              'ORDER_DELIVERED'
            )
          })
        )

        state.orders = newArr
        state.totalPrice = this.formatRupiah(this.totalPriceCounter(newArr))
      } catch (error) {
        console.log('error handleSetTableData => ', error)
        this.errorModal(error?.response?.data?.status, error?.response?.data?.message)
      } finally {
        this.state.isLoading = false
      }
    },
    errorModal(title, content) {
      Modal.error({
        title,
        content
      })
    },
    confirmModal(okCb, cancelCb, title, content) {
      Modal.confirm({
        title,
        content,
        onOk() {
          okCb()
        },
        onCancel() {
          cancelCb()
        },
        class: 'test'
      })
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
.sample-wrapper {
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 8px;
}
</style>
