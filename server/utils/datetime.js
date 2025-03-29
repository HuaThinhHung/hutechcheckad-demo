import { format } from 'date-fns'

export const formatDate = value => {
  const date = new Date(value)
  let day = date.getDate()
  let month = date.getMonth() + 1
  const year = date.getFullYear()

  if (day < 10) day = '0' + day
  if (month < 10) month = '0' + month

  return day + '/' + month + '/' + year
}

export const formatTime = value => {
  const time = new Date(value)
  let hours = time.getHours() + 7
  let minutes = time.getMinutes()

  if (hours < 10) hours = '0' + hours
  if (minutes < 10) minutes = '0' + minutes

  return hours + ':' + minutes
}

export const formatDateTime = (value, mid) => {
  return formatDate(value) + (mid ? ` ${mid} ` : ' ') + formatTime(value)
}

export const formatTimestamp = timestamp => {
  return format(new Date(timestamp * 1000), 'dd/MM/yyyy hh:mm:ss aa')
}
