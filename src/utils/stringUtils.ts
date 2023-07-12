export function formatCurrency(value: string): string {
  if (value)
    return Number.parseInt(value)
      .toLocaleString('kk', {
        style: 'currency',
        currency: 'KZT',
        currencyDisplay: 'symbol',
        maximumFractionDigits: 0,
      })
      .replace('KZT', '₸')
  return '-'
}
