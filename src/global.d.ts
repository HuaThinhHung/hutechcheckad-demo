interface Window {
  SweetAlert: {
    success: (
      title: string,
      message: string,
      isToast: boolean
    ) => SweetAlertResult<any>
    error: (
      title: string,
      message: string,
      isToast: boolean
    ) => SweetAlertResult<any>
    warning: (
      title: string,
      message: string,
      isToast: boolean
    ) => SweetAlertResult<any>
    info: (
      title: string,
      message: string,
      isToast: boolean
    ) => SweetAlertResult<any>
    question: (
      title: string,
      message: string,
      isToast: boolean
    ) => SweetAlertResult<any>
    confirm: (
      title: string,
      message: string,
      isToast: boolean
    ) => SweetAlertResult<any>
  }
}
