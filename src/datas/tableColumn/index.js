export const customer = [
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no'
  },
  {
    title: 'Nama customer',
    dataIndex: 'customerName',
    key: 'customerName'
  },
  {
    title: 'Alamat',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Nomor handphone',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber'
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Aksi',
    key: 'action'
  }
]

export const item = [
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no'
  },
  {
    title: 'Nama item',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Aksi',
    key: 'action'
  }
]

export const OrderDetail = [
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no'
  },
  {
    title: 'Nama customer',
    dataIndex: 'customerName',
    key: 'customerName'
  },
  {
    title: 'Id order',
    dataIndex: 'orderId',
    key: 'orderId'
  },
  {
    title: 'Nama item',
    dataIndex: 'itemName',
    key: 'itemName'
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity'
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size'
  },
  {
    title: 'Color',
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
    dataIndex: 'action',
    key: 'action',
    width: 210
  }
]

export const order = [
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no'
  },
  {
    title: 'Nama customer',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Alamat',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Id order',
    dataIndex: 'orderId',
    key: 'orderId'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Bukti dp',
    dataIndex: 'proofOfDp',
    key: 'proofOfDp'
  },
  {
    title: 'Bukti penerimaan barang',
    dataIndex: 'proofOfReceipt',
    key: 'proofOfReceipt'
  },
  {
    title: 'Bukti pelunasan pembayaran',
    dataIndex: 'proofOfFullPayment',
    key: 'proofOfFullPayment'
  },
  {
    title: 'Tanggal order',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: 'Tanggal pesanan selesai',
    dataIndex: 'updatedAt',
    key: 'updatedAt'
  },
  {
    title: 'Total harga',
    dataIndex: 'totalPrice',
    key: 'totalPrice'
  },
  {
    title: 'Aksi',
    dataIndex: 'action',
    key: 'action'
  }
]

export const customerOrder = [
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no'
  },
  {
    title: 'Id order',
    dataIndex: 'orderId',
    key: 'orderId'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Bukti dp',
    dataIndex: 'proofOfDp',
    key: 'proofOfDp'
  },
  {
    title: 'Bukti penerimaan barang',
    dataIndex: 'proofOfReceipt',
    key: 'proofOfReceipt'
  },
  {
    title: 'Bukti pelunasan pembayaran',
    dataIndex: 'proofOfFullPayment',
    key: 'proofOfFullPayment'
  },
  {
    title: 'Tanggal order',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: 'Tanggal pesanan selesai',
    dataIndex: 'updatedAt',
    key: 'updatedAt'
  },
  {
    title: 'Total harga',
    dataIndex: 'totalPrice',
    key: 'totalPrice'
  },
  {
    title: 'Aksi',
    dataIndex: 'action',
    key: 'action'
  }
]

export const driverOrder = [
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no'
  },
  {
    title: 'Id order',
    dataIndex: 'orderId',
    key: 'orderId'
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: 'Tanggal order',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: 'Aksi',
    dataIndex: 'action',
    key: 'action'
  }
]

export const manageOrder = ({ withAction = true, withStatus = true }) => {
  const column = [
    {
      title: 'Jumlah',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Nama barang',
      dataIndex: 'productName',
      key: 'productName'
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
      title: 'Deskripsi tambahan',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Sample',
      dataIndex: 'sample',
      key: 'sample'
    },
    {
      title: 'Harga satuan',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Total harga',
      dataIndex: 'totalPrice',
      key: 'totalPrice'
    }
  ]

  if (withStatus)
    column.push({
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    })
  if (withAction)
    column.push({
      title: 'Aksi',
      key: 'action'
    })

  return column
}
