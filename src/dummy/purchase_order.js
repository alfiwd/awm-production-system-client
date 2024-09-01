export const purchaseOrder = {
  columns: [
    {
      title: 'Nomor PO',
      dataIndex: 'po_number',
      key: 'po_number'
    },
    {
      title: 'Nama Customer',
      dataIndex: 'customer_name',
      key: 'customer_name'
    },
    {
      title: 'Nomor Telefon',
      dataIndex: 'phone_number',
      key: 'phone_number'
    },
    {
      title: 'Tanggal Diterbitkan',
      dataIndex: 'date_issued',
      key: 'date_issued'
    },
    {
      title: 'Deal DP',
      key: 'deal_dp',
      align: 'center',
      width: '10%'
    },
    {
      title: 'Belanja',
      key: 'buy_items',
      align: 'center',
      width: '10%'
    },
    {
      title: 'Selesaikan Orderan',
      key: 'order_completed',
      align: 'center',
      width: '10%'
    },
    {
      title: 'Aksi',
      key: 'action'
    },
    {
      title: 'Status orderan',
      dataIndex: 'order_status',
      key: 'order_status'
    }
  ],
  table_data: [
    {
      key: '1',
      po_number: '001/PO/FTS/VI/2023',
      customer_name: 'Alfian',
      phone_number: '0813123123',
      date_issued: '01/07/2000',
      order_status: 'Pending'
    },
    {
      key: '2',
      po_number: '002/PO/FTS/VI/2023',
      customer_name: 'Widitama',
      phone_number: '0813123123',
      date_issued: '01/07/2000',
      order_status: 'Pending'
    },
    {
      key: '3',
      po_number: '003/PO/FTS/VI/2023',
      customer_name: 'Dini',
      phone_number: '0813123123',
      date_issued: '01/07/2000',
      order_status: 'Pending'
    },
    {
      key: '4',
      po_number: '004/PO/FTS/VI/2023',
      customer_name: 'Nur',
      phone_number: '0813123123',
      date_issued: '01/07/2000',
      order_status: 'Pending'
    },
    {
      key: '5',
      po_number: '005/PO/FTS/VI/2023',
      customer_name: 'Madani',
      phone_number: '0813123123',
      date_issued: '01/07/2000',
      order_status: 'Pending'
    },
    {
      key: '6',
      po_number: '006/PO/FTS/VI/2023',
      customer_name: 'Rey',
      phone_number: '0813123123',
      date_issued: '01/07/2000',
      order_status: 'Pending'
    }
  ]
}
export const purchaseOrderDetail = {
  columns: [
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
      title: 'Harga Satuan',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Total Harga',
      dataIndex: 'totalPrice',
      key: 'totalPrice'
    },
    {
      title: 'Aksi',
      key: 'action'
    }
  ],
  table_datas: [
    {
      key: '1',
      quantity: '30',
      productName: 'Coverall Cotton',
      size: 'M',
      color: 'Merah',
      price: 5000
    },
    {
      key: '2',
      quantity: '10',
      productName: 'Coverall Cotton',
      size: 'S',
      color: 'Biru',
      price: 15000
    },
    {
      key: '3',
      quantity: '50',
      productName: 'Coverall Cotton',
      size: 'L',
      color: 'Merah',
      price: 10000
    }
  ],
  options: [
    {
      value: 'S'
    },
    {
      value: 'M'
    },
    {
      value: 'L'
    },
    {
      value: 'XL'
    }
  ]
}
