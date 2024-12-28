export default function intl(number) {
  return Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KZT',
    currencyDisplay: 'narrowSymbol',
    useGrouping: true,
    maximumFractionDigits: 0
    }).format(number)
}