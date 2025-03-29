export class Label {
  name: string
  color: string

  /**
   * Cấu trúc dùng để tạo 1 nhãn chủ đề.
   *
   * @param name Tên chủ đề.
   * @param color Màu nhãn chủ đề.
   */
  constructor(name: string, color: string) {
    this.name = name
    this.color = color
  }

  /**
   * Lấy data dưới dạng JSON.
   *
   * @return toJson() data dưới dạng JSON
   */
  toJson(): string {
    return JSON.parse(
      JSON.stringify({
        name: this.name,
        color: this.color
      })
    )
  }
}
