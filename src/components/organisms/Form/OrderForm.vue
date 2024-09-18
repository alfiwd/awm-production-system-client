<template>
  <div>
    <div v-if="state.skeletonLoading" class="skeleton-wrapper">
      <a-skeleton />
      <a-skeleton />
      <a-skeleton />
    </div>
    <a-form
      v-else
      :model="formState"
      name="basic"
      :wrapper-col="{ span: 20 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      layout="vertical"
    >
      <a-form-item>
        <a-button
          v-if="state.canUpdate"
          class="editable-add-btn"
          style="margin-bottom: 8px"
          @click="
            handleAddColumn({
              quantity: '',
              productName: '',
              size: '',
              color: '',
              orderId
            })
          "
          >Tambah barang</a-button
        >
        <a-table
          bordered
          :data-source="table_datas_ref"
          :columns="columns"
          style="width: auto"
          :scroll="{ x: 540 }"
        >
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.key !== 'action' && column.key !== 'status'">
              <div>
                <a-input-number
                  v-if="editable_data[record.key] && column.dataIndex === 'quantity'"
                  id="inputNumber"
                  v-model:value="editable_data[record.key][column.dataIndex]"
                  :min="1"
                  :max="1000"
                />
                <a-select
                  v-else-if="editable_data[record.key] && column.dataIndex === 'productName'"
                  :options="state.items"
                  placeholder="Pilih item"
                  @change="(_, item) => handleOnChangeItemName(record, item)"
                  v-model:value="editable_data[record.key][column.dataIndex]"
                  show-search
                ></a-select>
                <a-select
                  v-else-if="editable_data[record.key] && column.dataIndex === 'size'"
                  v-model:value="editable_data[record.key][column.dataIndex]"
                  style="width: 200px"
                  :options="options"
                ></a-select>
                <a-input
                  v-else-if="editable_data[record.key] && column.dataIndex === 'color'"
                  v-model:value="editable_data[record.key][column.dataIndex]"
                  style="margin: -5px 0"
                />
                <a-textarea
                  v-else-if="editable_data[record.key] && column.dataIndex === 'description'"
                  :rows="4"
                  v-model:value="editable_data[record.key][column.dataIndex]"
                />
                <a-upload
                  v-else-if="editable_data[record.key] && column.dataIndex === 'sample'"
                  v-model:file-list="editable_data[record.key][column.dataIndex]"
                  list-type="picture-card"
                  @preview="(file) => handlePreview(file)"
                  :maxCount="5"
                  :beforeUpload="handleBeforeUpload"
                  accept="image/png, image/PNG, image/jpeg, image/JPEG, image/jpg, image/JPG"
                >
                  <div>
                    <plus-outlined />
                    <div style="margin-top: 8px">Upload</div>
                  </div>
                </a-upload>
                <div v-else>
                  <div v-if="column.dataIndex === 'sample' && record.sample" class="sample-wrapper">
                    <img
                      v-for="(imageUrl, index) in record.sample"
                      :key="index"
                      alt="example"
                      style="width: 100px"
                      :src="imageUrl.thumbUrl"
                      @click="handlePreview(imageUrl)"
                    />
                  </div>
                  <div v-else>
                    {{ column.dataIndex === 'price' && !record.price ? '-' : text || '-' }}
                  </div>

                  <!-- {{ column.dataIndex === 'price' && !record.price ? '-' : text || '-' }} -->

                  <!-- {{ record }} -->
                </div>
              </div>
            </template>
            <template v-else-if="column.key === 'action'">
              <div v-if="editable_data[record.key]" class="editableActionWrapper">
                <a @click="save(record.key)">Simpan</a>
                <a-popconfirm
                  title="Yakin ingin membatalkan ubah data?"
                  @confirm="cancel(record.key)"
                >
                  <a>Batal</a>
                </a-popconfirm>
              </div>
              <div v-else class="editableActionWrapper">
                <a v-if="!isUpdate || !record.orderDetailId" @click="edit(record.key)">Ubah</a>
                <!-- <a @click="edit(record.key)">Ubah</a> -->
                <a-popconfirm
                  title="Yakin ingin menghapus data ini?"
                  @confirm="deleteRow(record.key)"
                >
                  <a>Hapus</a>
                </a-popconfirm>
              </div>
            </template>
            <template v-else-if="column.key === 'status' && role === 'ADMIN'">
              <div class="status-button-wrapper">
                <a-button
                  type="primary"
                  @click="handleOnStatusClick('CUTTING', record.orderDetailId)"
                  :disabled="record.isCuttingButtonDisabled"
                  >Cutting</a-button
                >
                <a-button
                  type="primary"
                  @click="handleOnStatusClick('SEWING', record.orderDetailId)"
                  :disabled="record.isSewingButtonDisabled"
                  >Sewing</a-button
                >
                <a-button
                  type="primary"
                  @click="handleOnStatusClick('FINISHING', record.orderDetailId)"
                  :disabled="record.isFinishingButtonDisabled"
                  >Finishing</a-button
                >
                <a-button
                  type="primary"
                  @click="handleOnStatusClick('PACKING', record.orderDetailId)"
                  :disabled="record.isPackingButtonDisabled"
                  >Packing</a-button
                >
                <a-button
                  type="primary"
                  @click="handleOnStatusClick('COMPLETE', record.orderDetailId)"
                  :disabled="record.isCompleteButtonDisabled"
                  >Selesai</a-button
                >
              </div>
            </template>
          </template>
        </a-table>
      </a-form-item>
      <a-form-item>
        <a-button
          v-if="state.canUpdate"
          type="primary"
          html-type="submit"
          style="width: 100px"
          :loading="isLoading"
          :disabled="isSubmitBtnDisabled"
          >{{ isUpdate ? 'Ubah' : 'Tambah' }}</a-button
        >
      </a-form-item>
    </a-form>
    <a-modal
      :visible="state.previewVisible"
      :title="state.previewFileName"
      :footer="null"
      @cancel="handleModalImageClose"
      width="1000px"
    >
      <img alt="example" style="width: 100%" :src="state.previewImage" />
    </a-modal>
    <a-modal
      :visible="isConfirmModalVisible"
      :title="confirmModalTitle"
      @ok="handleConfirmModalOk"
      @cancel="handleConfirmModalClose"
    >
      <p>{{ confirmModalContent }}</p>
    </a-modal>
  </div>
</template>

<script>
import { CheckOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import {
  ref as firebaseStorageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

import { getCustomers } from '../../../services/customer'
import { getOrder, createOrder, updateOrder } from '../../../services/order'
import {
  getOrderDetailsByOrderId,
  createOrderDetail,
  updateStatusOrderDetail
} from '../../../services/orderDetail'
import { getItems } from '../../../services/item'
import { purchaseOrderDetail } from '../../../dummy/purchase_order'
import { manageOrder } from '../../../datas/tableColumn'
import { orderStatus } from '../../../utils/status'
import { orderDetailStatus } from '../../../utils/status'
import { formatRupiah } from '../../../utils/formatRupiah'
import { storage } from '../../../firebase'

let table_datas_ref = ref([])
const editable_data = reactive({})
const state = reactive({
  customers: [],
  skeletonLoading: false,
  order: null,
  orderDetail: null,
  items: [],
  canUpdate: true,
  fileList: [],
  previewVisible: false,
  previewFileName: null,
  previewImage: null
})
const isConfirmModalVisible = ref(false)

export default {
  data(props) {
    const data = props?.datas,
      orderId = data?.orderId,
      customerId = data?.customerId

    return {
      formState: {
        orderId: orderId ? orderId : '',
        customerId: customerId ? customerId : '',
        items: []
      },
      orderPayload: {
        customerId: null,
        status: 'WAITING_FOR_PRICE',
        proofOfDp: null,
        proofOfReceipt: null,
        proofOfFullPayment: null
      },
      columns: manageOrder({ withStatus: false }),
      table_datas_ref,
      editable_data,
      options: purchaseOrderDetail.options,
      items: [],
      isLoading: false,
      state,
      isUpdate: false,
      orderId: null,
      isSubmitBtnDisabled: true,
      orderStatus,
      role: null,
      sampleBeforeCreate: [],
      sampleAfterCreate: [],
      isConfirmModalVisible,
      confirmModalTitle: '',
      confirmModalContent: '',
      orderDetailId: null,
      status: null
    }
  },

  components: {
    EditOutlined,
    CheckOutlined,
    PlusOutlined
  },

  mounted() {
    this.handleCreateOptions(getItems, null, 'itemId', 'items', 'fetchGetItems')
    this.handleCreateOptions(
      getCustomers,
      'customerId',
      'customerId',
      'customers',
      'fetchGetCustomers'
    )
    this.role = localStorage.getItem('role')
  },

  beforeMount() {
    const orderId = this.$route.query.orderId
    state.canUpdate = true

    if (orderId && this.isValidOrderIdQuery(orderId)) {
      this.fetchGetOrderByOrderId(orderId)
      this.orderId = orderId
    } else {
      !this.$route.path.includes('tambah') && this.$router.push('/customer/order')
    }
  },

  beforeUnmount() {
    table_datas_ref.value = []
  },

  watch: {
    combinedData: {
      deep: true,
      handler() {
        this.checkSubmitBtnDisabled()
      }
    },
    stateChecker: {
      deep: true,
      handler() {
        // console.log(state.fileList)
      }
    }
  },

  computed: {
    combinedData() {
      return {
        table_datas_ref: this.table_datas_ref,
        formState: this.formState,
        editable_data
      }
    },
    stateChecker() {
      return {
        state
      }
    }
  },

  methods: {
    handleConfirmModalOk() {
      this.fetchUpdateOrderDetailStatus(this.status, this.orderDetailId)
    },
    handleConfirmModalClose() {
      isConfirmModalVisible.value = false
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },
    handleModalImageClose() {
      state.previewVisible = false
    },
    handleBeforeUpload(val) {
      // this.state.imageUpload = val
      // this.state.imageFileName = val.name
      return false
    },
    async handlePreview(file) {
      if (file.originFileObj) {
        file.preview = await this.getBase64(file.originFileObj)
      }

      state.previewImage = file.preview || file.url
      state.previewVisible = true
      state.previewFileName = file.name || file?.url?.substring(file.url.lastIndexOf('/') + 1)
    },
    buttonStatusChecker(status, type) {
      const indexFound = orderDetailStatus.findIndex((item) => item === status)

      if (indexFound === -1) {
        return type === 'CUTTING' ? false : true
      } else if (indexFound === 0) {
        return type === 'SEWING' ? false : true
      } else if (indexFound === 1) {
        return type === 'FINISHING' ? false : true
      } else if (indexFound === 2) {
        return type === 'PACKING' ? false : true
      } else if (indexFound === 3) {
        return type === 'COMPLETE' ? false : true
      } else {
        return true
      }
    },
    async fetchUpdateOrderDetailStatus(status, orderDetailId) {
      try {
        const response = await updateStatusOrderDetail(orderDetailId, status)

        if (response?.data?.status === 'Success') {
          message.success(response?.data?.message || 'Berhasil mengubah status order detail')
          table_datas_ref.value = []
          this.fetchGetOrderByOrderId(this.orderId)
          isConfirmModalVisible.value = false
        }
      } catch (error) {
        console.log('error => fetchUpdateOrderDetailStatus', error)
        message.error(error?.response?.data?.message || 'Server error')
      }
    },
    handleOnStatusClick(status, orderDetailId) {
      isConfirmModalVisible.value = true
      this.confirmModalTitle = `Apakah kamu ingin mengubah status detail order ini menjadi ${status}?`
      this.confirmModalContent = 'Status yang sudah diubah tidak dapat dikembalikan.'
      this.orderDetailId = orderDetailId
      this.status = status
    },
    checkSubmitBtnDisabled() {
      table_datas_ref.value.length === 0 || this.areThereOrderDetails(table_datas_ref.value)
        ? (this.isSubmitBtnDisabled = true)
        : (this.isSubmitBtnDisabled = false)
    },
    areThereOrderDetails(data) {
      return data.find(
        (item) => !item?.color || !item?.productName || !item?.quantity || !item?.size
      )
    },
    isValidOrderIdQuery(orderId) {
      return orderId !== 'null' && orderId !== 'undefined'
    },
    handleFillAllData(orderDetail) {
      orderDetail.map((item, index) => {
        this.handleAddColumn({
          key: index,
          quantity: item?.quantity,
          productName: item?.productName,
          size: item?.size,
          color: item?.color,
          description: item?.description,
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
          orderDetailId: item?.orderDetailId,
          orderId: item?.orderId,
          price: formatRupiah(item?.price),
          itemId: item?.itemId,
          isCuttingButtonDisabled: this.buttonStatusChecker(item?.status, 'CUTTING'),
          isSewingButtonDisabled: this.buttonStatusChecker(item?.status, 'SEWING'),
          isFinishingButtonDisabled: this.buttonStatusChecker(item?.status, 'FINISHING'),
          isPackingButtonDisabled: this.buttonStatusChecker(item?.status, 'PACKING'),
          isCompleteButtonDisabled: this.buttonStatusChecker(item?.status, 'COMPLETE'),
          status: item?.status || '-',
          totalPrice: formatRupiah(item?.price ? item?.price * item?.quantity : '-')
        })
        this.formState.items[index] = {
          key: index,
          id: item?.itemId
        }
      })
    },
    handleAddColumn(value) {
      const key =
          table_datas_ref.value.length === 0 ? 0 : Number(table_datas_ref.value.at(-1).key) + 1,
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
          itemId,
          isCuttingButtonDisabled,
          isSewingButtonDisabled,
          isFinishingButtonDisabled,
          isPackingButtonDisabled,
          isCompleteButtonDisabled,
          totalPrice
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
        itemId,
        isCuttingButtonDisabled,
        isSewingButtonDisabled,
        isFinishingButtonDisabled,
        isPackingButtonDisabled,
        isCompleteButtonDisabled,
        totalPrice
      })
    },
    save(key) {
      // console.log(table_datas_ref.value.filter((item) => item.key === key))
      const target = table_datas_ref.value.filter((item) => item.key === key)[0]
      // target.sample = target.sample?.map(async (item) => await this.getBase64(item.originFileObj))

      // Object.assign(table_datas_ref.value.filter((item) => item.key === key)[0], editable_data[key])
      Object.assign(target, editable_data[key])
      delete editable_data[key]
    },
    edit(key) {
      const tempData = {}
      Object.assign(tempData, table_datas_ref.value.filter((item) => item.key === key)[0])
      editable_data[key] = tempData
    },
    onDelete() {},
    cancel(key) {
      delete editable_data[key]
    },
    deleteRow(key) {
      table_datas_ref.value = table_datas_ref.value.filter((item) => item.key !== key)
      this.formState.items = this.formState.items.filter((item) => item.key !== key)
    },
    onFinish() {
      this.isUpdate ? this.fetchUpdateOrder() : this.fetchCreateOrder(this.orderPayload)
    },
    onFinishFailed(value) {
      console.log('value => ', value)
    },
    handleOnChangeItemName(record, item) {
      this.formState.items[record.key] = {
        key: this.formState.items[record.key]?.key || this.formState.items.length,
        id: item.id
      }
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
        state[stateKey] = newArr
      } catch (error) {
        console.log(`error ${errorDesc} => `, error)
        message.error(error?.response?.data?.message || 'Server error')
      }
    },
    async fetchGetOrderByOrderId(orderId) {
      this.state.skeletonLoading = true
      this.isUpdate = true

      try {
        const getOrderResponse = await getOrder(orderId),
          responseMessage = getOrderResponse?.data?.message

        if (getOrderResponse?.data?.status === 'Success') {
          const getOrderDetailsByOrderIdResponse = await getOrderDetailsByOrderId(
              getOrderResponse?.data?.data?.orderId
            ),
            indexFound = this.orderStatus.findIndex(
              (item) => item === getOrderResponse.data.data.status
            )

          if (getOrderDetailsByOrderIdResponse?.data?.status === 'Success') {
            this.handleFillAllData(getOrderDetailsByOrderIdResponse?.data?.data)
          }

          if (indexFound > 0 || this.role === 'ADMIN') {
            if (this.role === 'ADMIN') {
              indexFound > 2
                ? (this.columns = manageOrder({
                    withAction: false,
                    withStatus: indexFound === 9 ? false : true
                  }))
                : (this.columns = manageOrder({ withAction: false, withStatus: false }))
            } else {
              this.columns = manageOrder({
                withAction: false,
                withStatus: indexFound > 2 && indexFound < 9 ? true : false
              })
            }
            state.canUpdate = false
          }
        } else {
          message.error(responseMessage)
          this.role === 'ADMIN'
            ? this.$router.push('/admin/order')
            : this.$router.push('/customer/order')
        }
      } catch (error) {
        console.log('error fetchGetOrderByOrderId => ', error)
        message.error(error?.response?.data?.message || 'Server error')
      } finally {
        this.state.skeletonLoading = false
      }
    },
    async fetchUpdateOrder() {
      this.isLoading = true

      try {
        let orderDetail = [],
          payload

        await Promise.all(
          table_datas_ref.value.map(async (item, index) => {
            const uploadResults = []
            let newFiles = item?.sample?.find((item) => item?.originFileObj)

            if (newFiles) {
              await Promise.all(
                item?.sample?.map(async (item) => {
                  const firebaseFolder = 'sample'
                  const imageRef = firebaseStorageRef(
                    storage,
                    `${firebaseFolder}/${item.name}-${Date.now()}`
                  )

                  try {
                    const response = await uploadBytes(imageRef, item.originFileObj)
                    const imagePath = await getDownloadURL(response?.ref)
                    uploadResults.push(imagePath)
                  } catch (error) {
                    console.log('error upload sample => ', error)
                    message.error(error?.response?.data?.message || 'Server error')
                  }
                })
              )
            } else {
              item?.sample?.map((item) => uploadResults.push(item?.url))
            }

            orderDetail.push({
              orderDetailId: item.orderDetailId,
              orderId: item.orderId,
              itemId: this.formState.items[index].id,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
              description: item.description || null,
              sample: uploadResults.length > 0 ? uploadResults?.join(',') : null
            })
          })
        )

        payload = {
          order: null,
          orderDetail
        }
        console.log(orderDetail)

        const response = await updateOrder(this.orderId, payload)

        if (response?.data?.status === 'Success') {
          message.success(response?.data?.message)
          this.$router.push('/customer/order')
        }
      } catch (error) {
        console.log('error => fetchUpdateOrder', error)
        message.error(error?.response?.data?.message || 'Server error')
      } finally {
        this.isLoading = false
      }
    },
    async fetchCreateOrder(payload) {
      this.isLoading = true

      try {
        payload.customerId = Number(localStorage.getItem('customerId'))
        const response = await createOrder(payload)

        if (response?.data?.status === 'Success') {
          for (const [index, item] of table_datas_ref.value.entries()) {
            const { quantity, size, color, description, sample } = item,
              uploadResults = []

            if (sample) {
              await Promise.all(
                sample?.map(async (item) => {
                  const firebaseFolder = 'sample'
                  const imageRef = firebaseStorageRef(
                    storage,
                    `${firebaseFolder}/${item.name}-${Date.now()}`
                  )

                  try {
                    const response = await uploadBytes(imageRef, item.originFileObj)
                    const imagePath = await getDownloadURL(response?.ref)
                    uploadResults.push(imagePath)
                  } catch (error) {
                    console.log('error upload sample => ', error)
                    message.error(error?.response?.data?.message || 'Server error')
                  }
                })
              )
            }

            const createOrderPayload = {
              orderId: response.data.data.orderId,
              itemId: this.formState?.items?.[index]?.id,
              quantity,
              color,
              status: null,
              description: description || null,
              sample: uploadResults.length > 0 ? uploadResults?.join(',') : null,
              size
            }

            await createOrderDetail(createOrderPayload)
          }

          message.success(response?.data?.message)
          this.$router.push('/customer/order')
        } else {
          message.error(response?.data?.message || 'Server error')
        }
      } catch (error) {
        console.log('error fetchCreateOrder => ', error)
        message.error(error?.response?.data?.message || 'Server error')
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style>
.editableActionWrapper {
  display: flex;
  gap: 10px;
}
.skeleton-wrapper {
  width: 72%;
}
.status-button-wrapper {
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
