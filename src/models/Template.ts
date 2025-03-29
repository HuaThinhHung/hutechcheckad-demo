export class Template {
  title: string
  image: string
  // Tiêu đề sự kiện
  isDisplayEventTitle: boolean
  eventTitleX: number
  eventTitleY: number
  eventTitleFs: number
  eventTitleColor: string
  // Đơn vị tổ chức
  isDisplayCefHost: boolean
  cefHostX: number
  cefHostY: number
  cefHostFs: number
  cefHostColor: string
  // Tên sinh viên
  isDisplayStudentName: boolean
  studentNameX: number
  studentNameY: number
  studentNameFs: number
  studentNameColor: string
  // Mã số sinh viên
  isDisplayStudentCode: boolean
  studentCodeX: number
  studentCodeY: number
  studentCodeFs: number
  studentCodeColor: string
  // Số chứng nhận
  isDisplayCefNo: boolean
  cefNoX: number
  cefNoY: number
  cefNoFs: number
  cefNoColor: string
  // Ngày chứng nhận
  isDisplayCefDay: boolean
  cefDayX: number
  cefDayY: number
  cefDayFs: number
  cefDayColor: string
  // Tháng chứng nhận
  isDisplayCefMonth: boolean
  cefMonthX: number
  cefMonthY: number
  cefMonthFs: number
  cefMonthColor: string
  // Năm chứng nhận
  isDisplayCefYear: boolean
  cefYearX: number
  cefYearY: number
  cefYearFs: number
  cefYearColor: string

  /**
   * Cấu trúc dùng để tạo 1 mẫu chứng nhận.
   *
   * @param title Tên mẫu chứng nhận.
   * @param image Hình ảnh chứng nhận.
   *
   * @param isDisplayEventTitle Hiển thị tên sự kiện.
   * @param eventTitleX Tọa độ X tên sự kiện.
   * @param eventTitleY Tọa độ Y tên sự kiện.
   * @param eventTitleFs Cỡ chữ tên sự kiện.
   * @param eventTitleColor Màu chữ tên sự kiện.
   *
   * @param isDisplayCefHost Hiển thị đơn vị tổ chức.
   * @param cefHostX Tọa độ X đơn vị tổ chức.
   * @param cefHostY Tọa độ Y đơn vị tổ chức.
   * @param cefHostFs Cỡ chữ đơn vị tổ chức.
   * @param cefHostColor Màu chữ đơn vị tổ chức.
   *
   * @param isDisplayStudentName Hiển thị tên sinh viên.
   * @param studentNameX Tọa độ X tên sinh viên.
   * @param studentNameY Tọa độ Y tên sinh viên.
   * @param studentNameFs Cỡ chữ tên sinh viên.
   * @param studentNameColor Màu chữ tên sinh viên.
   *
   * @param isDisplayStudentCode Hiển thị mã số sinh viên.
   * @param studentCodeX Tọa độ X mã số sinh viên.
   * @param studentCodeY Tọa độ Y mã số sinh viên.
   * @param studentCodeFs Cỡ chữ mã số sinh viên.
   * @param studentCodeColor Màu chữ mã số sinh viên.
   *
   * @param isDisplayCefNo Hiển thị số chứng nhận.
   * @param cefNoX Tọa độ X số chứng nhận.
   * @param cefNoY Tọa độ Y số chứng nhận.
   * @param cefNoFs Cỡ chữ số chứng nhận.
   * @param cefNoColor Màu chữ số chứng nhận.
   *
   * @param isDisplayCefDay Hiển thị ngày chứng nhận.
   * @param cefDayX Tọa độ X ngày chứng nhận.
   * @param cefDayY Tọa độ Y ngày chứng nhận.
   * @param cefDayFs Cỡ chữ ngày chứng nhận.
   * @param cefDayColor Màu chữ ngày chứng nhận.
   *
   * @param isDisplayCefMonth Hiển thị tháng chứng nhận.
   * @param cefMonthX Tọa độ X tháng chứng nhận.
   * @param cefMonthY Tọa độ Y tháng chứng nhận.
   * @param cefMonthFs Cỡ chữ tháng chứng nhận.
   * @param cefMonthColor Màu chữ tháng chứng nhận.
   *
   * @param isDisplayCefYear Hiển thị năm chứng nhận.
   * @param cefYearX Tọa độ X năm chứng nhận.
   * @param cefYearY Tọa độ Y năm chứng nhận.
   * @param cefYearFs Cỡ chữ năm chứng nhận.
   * @param cefYearColor Màu chữ năm chứng nhận.
   */
  constructor(
    title: string,
    image: string,
    // Tiêu đề sự kiện
    isDisplayEventTitle: boolean,
    eventTitleX: number,
    eventTitleY: number,
    eventTitleFs: number,
    eventTitleColor: string,
    // Đơn vị tổ chức
    isDisplayCefHost: boolean,
    cefHostX: number,
    cefHostY: number,
    cefHostFs: number,
    cefHostColor: string,
    // Tên sinh viên
    isDisplayStudentName: boolean,
    studentNameX: number,
    studentNameY: number,
    studentNameFs: number,
    studentNameColor: string,
    // Mã số sinh viên
    isDisplayStudentCode: boolean,
    studentCodeX: number,
    studentCodeY: number,
    studentCodeFs: number,
    studentCodeColor: string,
    // Số chứng nhận
    isDisplayCefNo: boolean,
    cefNoX: number,
    cefNoY: number,
    cefNoFs: number,
    cefNoColor: string,
    // Ngày chứng nhận
    isDisplayCefDay: boolean,
    cefDayX: number,
    cefDayY: number,
    cefDayFs: number,
    cefDayColor: string,
    // Tháng chứng nhận
    isDisplayCefMonth: boolean,
    cefMonthX: number,
    cefMonthY: number,
    cefMonthFs: number,
    cefMonthColor: string,
    // Năm chứng nhận
    isDisplayCefYear: boolean,
    cefYearX: number,
    cefYearY: number,
    cefYearFs: number,
    cefYearColor: string
  ) {
    this.title = title
    this.image = image
    // Tiêu đề sự kiện
    this.isDisplayEventTitle = isDisplayEventTitle
    this.eventTitleX = eventTitleX
    this.eventTitleY = eventTitleY
    this.eventTitleFs = eventTitleFs
    this.eventTitleColor = eventTitleColor
    // Đơn vị tổ chức
    this.isDisplayCefHost = isDisplayCefHost
    this.cefHostX = cefHostX
    this.cefHostY = cefHostY
    this.cefHostFs = cefHostFs
    this.cefHostColor = cefHostColor
    // Tên sinh viên
    this.isDisplayStudentName = isDisplayStudentName
    this.studentNameX = studentNameX
    this.studentNameY = studentNameY
    this.studentNameFs = studentNameFs
    this.studentNameColor = studentNameColor
    // Mã số sinh viên
    this.isDisplayStudentCode = isDisplayStudentCode
    this.studentCodeX = studentCodeX
    this.studentCodeY = studentCodeY
    this.studentCodeFs = studentCodeFs
    this.studentCodeColor = studentCodeColor
    // Số chứng nhận
    this.isDisplayCefNo = isDisplayCefNo
    this.cefNoX = cefNoX
    this.cefNoY = cefNoY
    this.cefNoFs = cefNoFs
    this.cefNoColor = cefNoColor
    // Ngày chứng nhận
    this.isDisplayCefDay = isDisplayCefDay
    this.cefDayX = cefDayX
    this.cefDayY = cefDayY
    this.cefDayFs = cefDayFs
    this.cefDayColor = cefDayColor
    // Tháng chứng nhận
    this.isDisplayCefMonth = isDisplayCefMonth
    this.cefMonthX = cefMonthX
    this.cefMonthY = cefMonthY
    this.cefMonthFs = cefMonthFs
    this.cefMonthColor = cefMonthColor
    // Năm chứng nhận
    this.isDisplayCefYear = isDisplayCefYear
    this.cefYearX = cefYearX
    this.cefYearY = cefYearY
    this.cefYearFs = cefYearFs
    this.cefYearColor = cefYearColor
  }

  /**
   * Lấy data dưới dạng JSON.
   *
   * @return toJson() data dưới dạng JSON
   */
  toJson(): string {
    return JSON.parse(
      JSON.stringify({
        title: this.title,
        image: this.image,
        // Tiêu đề sự kiện
        isDisplayEventTitle: this.isDisplayEventTitle,
        eventTitleX: this.eventTitleX,
        eventTitleY: this.eventTitleY,
        eventTitleFs: this.eventTitleFs,
        eventTitleColor: this.eventTitleColor,
        // Đơn vị tổ chức
        isDisplayCefHost: this.isDisplayCefHost,
        cefHostX: this.cefHostX,
        cefHostY: this.cefHostY,
        cefHostFs: this.cefHostFs,
        cefHostColor: this.cefHostColor,
        // Tên sinh viên
        isDisplayStudentName: this.isDisplayStudentName,
        studentNameX: this.studentNameX,
        studentNameY: this.studentNameY,
        studentNameFs: this.studentNameFs,
        studentNameColor: this.studentNameColor,
        // Mã số sinh viên
        isDisplayStudentCode: this.isDisplayStudentCode,
        studentCodeX: this.studentCodeX,
        studentCodeY: this.studentCodeY,
        studentCodeFs: this.studentCodeFs,
        studentCodeColor: this.studentCodeColor,
        // Số chứng nhận
        isDisplayCefNo: this.isDisplayCefNo,
        cefNoX: this.cefNoX,
        cefNoY: this.cefNoY,
        cefNoFs: this.cefNoFs,
        cefNoColor: this.cefNoColor,
        // Ngày chứng nhận
        isDisplayCefDay: this.isDisplayCefDay,
        cefDayX: this.cefDayX,
        cefDayY: this.cefDayY,
        cefDayFs: this.cefDayFs,
        cefDayColor: this.cefDayColor,
        // Tháng chứng nhận
        isDisplayCefMonth: this.isDisplayCefMonth,
        cefMonthX: this.cefMonthX,
        cefMonthY: this.cefMonthY,
        cefMonthFs: this.cefMonthFs,
        cefMonthColor: this.cefMonthColor,
        // Năm chứng nhận
        isDisplayCefYear: this.isDisplayCefYear,
        cefYearX: this.cefYearX,
        cefYearY: this.cefYearY,
        cefYearFs: this.cefYearFs,
        cefYearColor: this.cefYearColor
      })
    )
  }
}
