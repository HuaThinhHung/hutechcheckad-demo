export class Event {
  poster?: string
  title: string
  summary?: string
  description?: string
  host: string | null
  labels: string[]
  date: Date | null
  room: string
  template: string | null
  allowExport: boolean
  allowCheckin: boolean
  display: boolean

  /**
   * Cấu trúc dùng để tạo 1 sự kiện.
   *
   * @param poster Poster sự kiện.
   * @param title Tên sự kiện.
   * @param summary Tóm tắt mô tả sự kiện.
   * @param description Mô tả chi tiết sự kiện.
   * @param host Đơn vị tổ chức.
   * @param labels Nhãn chủ đề.
   * @param date Ngày diễn ra.
   * @param room Nơi diễn ra.
   * @param template Mẫu giấy chứng nhận.
   * @param allowExport Cho phép xuất giấy chứng nhận.
   * @param allowCheckin Cho phép checkin.
   * @param display Hiển thị sự kiện.
   */
  constructor(
    title: string,
    host: string | null,
    labels: string[],
    date: Date | null,
    room: string,
    template: string | null,
    allowExport: boolean,
    allowCheckin: boolean,
    display: boolean,
    poster?: string,
    summary?: string,
    description?: string
  ) {
    this.title = title
    this.host = host
    this.labels = labels
    this.date = date
    this.room = room
    this.template = template
    this.allowExport = allowExport
    this.allowCheckin = allowCheckin
    this.display = display

    if (poster !== undefined && poster !== null) this.poster = poster
    if (summary !== undefined && summary !== null) this.summary = summary
    if (description !== undefined && description !== null)
      this.description = description
  }

  /**
   * Lấy data dưới dạng JSON.
   *
   * @return toBasicJson() data dưới dạng JSON
   */
  toBasicJson(): string {
    return JSON.parse(
      JSON.stringify({
        description: this.description,
        host: this.host,
        labels: this.labels,
        date: this.date,
        room: this.room,
        template: this.template,
        allowExport: this.allowExport,
        allowCheckin: this.allowCheckin,
        display: this.display
      })
    )
  }
}
