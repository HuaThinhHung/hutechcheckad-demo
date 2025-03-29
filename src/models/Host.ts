export class Host {
  hostId: string
  name: string
  symbol: string

  /**
   * Cấu trúc dùng để tạo 1 đơn vị.
   *
   * @param hostId Mã đơn vị.
   * @param name Tên đơn vị.
   * @param symbol Ký hiệu/Tên viết tắt.
   */
  constructor(hostId: string, name: string, symbol: string) {
    this.hostId = hostId
    this.name = name
    this.symbol = symbol
  }

  /**
   * Lấy data dưới dạng JSON.
   *
   * @return toJson() data dưới dạng JSON
   */
  toJson(): string {
    return JSON.parse(
      JSON.stringify({
        hostId: this.hostId,
        name: this.name,
        symbol: this.symbol
      })
    )
  }
}
