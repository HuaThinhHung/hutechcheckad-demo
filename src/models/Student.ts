export class Student {
  studentId: string
  fullName: string
  studyClass: string
  isMonitor: boolean
  email: string
  phone: string

  /**
   * Cấu trúc dùng để tạo 1 thông tin sinh viên.
   *
   * @param studentId Mã số sinh viên.
   * @param fullName Họ tên.
   * @param studyClass Lớp học.
   * @param isMonitor Sinh viên là ban cán sự lớp.
   * @param email Địa chỉ email.
   * @param phone Số điện thoại.
   */
  constructor(
    studentId: string,
    fullName: string,
    studyClass: string,
    isMonitor: boolean,
    email: string,
    phone: string
  ) {
    this.studentId = studentId
    this.fullName = fullName
    this.studyClass = studyClass
    this.isMonitor = isMonitor
    this.email = email
    this.phone = phone
  }

  /**
   * Lấy kết quả dưới định dạng JSON sau khi tạo những thông tin sinh viên
   * theo [cấu trúc của lớp Student]{@link Student#constructor}.
   *
   * @return toJson() kết quả dưới dạng JSON
   */
  toJson(): string {
    return JSON.parse(
      JSON.stringify({
        studentId: this.studentId,
        fullName: this.fullName,
        studyClass: this.studyClass,
        isMonitor: this.isMonitor,
        email: this.email,
        phone: this.phone
      })
    )
  }
}
