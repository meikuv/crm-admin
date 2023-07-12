export function formatDateForSiebel(date: Date): string {
  const day = ('0' + date.getUTCDate()).slice(-2)
  const month = ('0' + (date.getUTCMonth() + 1)).slice(-2)
  const year = date.getUTCFullYear()
  const hour = ('0' + date.getHours()).slice(-2)
  const min = ('0' + date.getMinutes()).slice(-2)
  const sec = ('0' + date.getSeconds()).slice(-2)
  return `${month}/${day}/${year} ${hour}:${min}:${sec}`
}
