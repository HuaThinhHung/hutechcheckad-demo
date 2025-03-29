export class User {
  userId: string
  username: string
  fullName: string
  roleName: string

  /**
   * Cấu trúc dùng để tạo 1 tài khoản quản lý
   *
   * @param userId Mã định danh mỗi tài khoản.
   * @param username Tên tài khoản (Username hoặc Email).
   * @param fullName Tên đầy đủ.
   * @param roleName Quyền hạn.
   */
  constructor(
    userId: string,
    username: string,
    fullName: string,
    roleName: string
  ) {
    this.userId = userId
    this.username = username
    this.fullName = fullName
    this.roleName = roleName
  }

  /**
   * Lấy data dưới dạng JSON.
   *
   * @return toJson data dưới dạng JSON
   */
  toJson(): string {
    return JSON.parse(
      JSON.stringify({
        userId: this.userId,
        username: this.username,
        fullName: this.fullName,
        roleName: this.roleName
      })
    )
  }
}
