export const getColumnName = (colIndex: number): string => {
  let columnName = ''
  while (colIndex > 0) {
    let remainder = (colIndex - 1) % 26
    columnName = String.fromCharCode(65 + remainder) + columnName
    colIndex = Math.floor((colIndex - 1) / 26)
  }
  return columnName
}
