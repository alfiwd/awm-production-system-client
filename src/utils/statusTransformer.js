export const orderStatusTransformer = (status) => {
  let transformedStatus

  switch (status) {
    case 'WAITING_FOR_PRICE':
      transformedStatus = 'Menunggu harga dari admin'
      break
    case 'WAITING_FOR_DP':
      transformedStatus = 'Menunggu pembayaran DP'
      break
    case 'WAITING_FOR_ORDER_CONFIRMATION_FROM_ADMIN':
      transformedStatus = 'Menunggu konfirmasi pesanan dari admin'
      break
    case 'IN_PROCESS':
      transformedStatus = 'Pesanan sedang dalam proses'
      break
    case 'READY_TO_DELIVERY':
      transformedStatus = 'Pesanan siap untuk diantar'
      break
    case 'IN_DELIVERY':
      transformedStatus = 'Pesanan sedang dalam perjalanan ke alamat pemesan'
      break
    case 'WAITING_FOR_FULL_PAYMENT':
      transformedStatus = 'Barang pesanan telah sampai, menunggu pelunasan pembayaran'
      break
    case 'WAITING_FOR_PAYMENT_CONFIRMATION_FROM_ADMIN':
      transformedStatus = 'Menunggu konfirmasi pelunasan pembayaran dari admin'
      break
    case 'COMPLETE':
      transformedStatus = 'Pesanan selesai'
      break
    case 'CANCEL':
      transformedStatus = 'Pesanan dibatalkan oleh pemesan'
      break
  }

  return transformedStatus
}

export const orderStatusTransformerForAdmin = (status) => {
  let transformedStatus

  switch (status) {
    case 'WAITING_FOR_PRICE':
      transformedStatus = 'Harga perlu diterbitkan'
      break
    case 'WAITING_FOR_DP':
      transformedStatus = 'Menunggu pembayaran DP dari pemesan'
      break
    case 'WAITING_FOR_ORDER_CONFIRMATION_FROM_ADMIN':
      transformedStatus = 'Pesanan perlu dikonfirmasi'
      break
    case 'IN_PROCESS':
      transformedStatus = 'Pesanan sedang dalam proses'
      break
    case 'READY_TO_DELIVERY':
      transformedStatus = 'Pesanan siap untuk diantar ke alamat pemesan'
      break
    case 'IN_DELIVERY':
      transformedStatus = 'Pesanan sedang dalam perjalanan ke alamat pemesan'
      break
    case 'WAITING_FOR_FULL_PAYMENT':
      transformedStatus = 'Barang pesanan telah sampai, menunggu pelunasan pembayaran dari pemesan'
      break
    case 'WAITING_FOR_PAYMENT_CONFIRMATION_FROM_ADMIN':
      transformedStatus = 'Pelunasan pembayaran perlu dikonfirmasi'
      break
    case 'COMPLETE':
      transformedStatus = 'Pesanan selesai'
      break
    case 'CANCEL':
      transformedStatus = 'Pesanan dibatalkan oleh pemesan'
      break
  }

  return transformedStatus
}

export const orderStatusTransformerForAdmin_ = (status) => {
  let transformedStatus

  switch (status) {
    case 'CREATED':
      transformedStatus = 'Harga perlu diterbitkan'
      break
    case 'PRICE_HAS_ALREADY_PUBLISHED':
      transformedStatus = 'Menunggu pembayaran DP dari pemesan'
      break
    case 'PROOF_OF_DP_HAS_ALREADY_UPLOADED':
      transformedStatus = 'Pesanan perlu dikonfirmasi'
      break
    case 'IN_PROCESS':
      transformedStatus = 'Pesanan sedang dalam proses'
      break
    case 'IN_DELIVERY':
      transformedStatus = 'Pesanan sedang dalam perjalanan ke alamat pemesan'
      break
    case 'ORDER_HAS_ALREADY_DELIVERED':
      transformedStatus = 'Menunggu pelunasan pembayaran dari pemesan'
      break
    case 'PROOF_OF_FULL_PAYMENT_HAS_ALREADY_UPLOADED':
      transformedStatus = 'Pelunasan pembayaran perlu dikonfirmasi'
      break
    case 'COMPLETE':
      transformedStatus = 'Pesanan selesai'
      break
    case 'CANCEL':
      transformedStatus = 'Pesanan dibatalkan oleh pemesan'
      break
  }

  return transformedStatus
}
