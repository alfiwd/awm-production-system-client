export const purchase_order_options = [
  {
    value: '001/PO/FTS/VI/2023'
  },
  {
    value: '002/PO/FTS/VI/2023'
  },
  {
    value: '003/PO/FTS/VI/2023'
  }
]
export const columns = [
  {
    title: 'Jumlah',
    dataIndex: 'quantity',
    key: 'quantity',
    width: '10%'
  },
  {
    title: 'Nama barang',
    dataIndex: 'product_name',
    key: 'product_name',
    width: '50%'
  },
  {
    title: 'Ukuran',
    dataIndex: 'size',
    key: 'size',
    width: '10%'
  },
  {
    title: 'Warna',
    dataIndex: 'color',
    key: 'color',
    width: '30%'
  },
  {
    title: 'Aksi',
    key: 'action'
  }
]
export let table_data = [
  {
    po_number: '001/PO/FTS/VI/2023',
    datas: [
      {
        key: '1',
        quantity: '30',
        product_name: 'Coverall Cotton',
        size: 'M',
        color: 'Merah',
        isDone: false
      },
      {
        key: '2',
        quantity: '10',
        product_name: 'Coverall Cotton',
        size: 'S',
        color: 'Biru',
        isDone: false
      },
      {
        key: '3',
        quantity: '50',
        product_name: 'Coverall Cotton',
        size: 'L',
        color: 'Merah',
        isDone: false
      }
    ]
  },
  {
    po_number: '002/PO/FTS/VI/2023',
    datas: [
      {
        key: '1',
        quantity: '33',
        product_name: 'Kaos bola',
        size: 'M',
        color: 'Merah',
        isDone: false
      },
      {
        key: '2',
        quantity: '12',
        product_name: 'Kaos bola',
        size: 'M',
        color: 'Biru',
        isDone: false
      },
      {
        key: '3',
        quantity: '43',
        product_name: 'Kaos bola',
        size: 'M',
        color: 'Hijau',
        isDone: false
      }
    ]
  },
  {
    po_number: '003/PO/FTS/VI/2023',
    datas: [
      {
        key: '1',
        quantity: '322',
        product_name: 'Jaket bomber',
        size: 'XL',
        color: 'Ungu',
        isDone: false
      },
      {
        key: '2',
        quantity: '500',
        product_name: 'Jaket bomber',
        size: 'L',
        color: 'Merah',
        isDone: false
      },
      {
        key: '3',
        quantity: '30',
        product_name: 'Jaket bomber',
        size: 'S',
        color: 'Biru',
        isDone: false
      }
    ]
  }
]
