export const formatRupiah = (number) => {
  let reverse = number?.toString()?.split('')?.reverse()?.join('')
  let ribuan = reverse?.match(/\d{1,3}/g)
  let result = ribuan?.join('.')?.split('')?.reverse()?.join('')
  return `Rp${result ? result : '-'}`
}
