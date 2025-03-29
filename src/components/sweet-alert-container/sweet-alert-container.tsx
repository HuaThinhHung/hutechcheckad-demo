import React, { useEffect } from 'react'
import Swal, { SweetAlertIcon } from 'sweetalert2'

export const SweetAlertContainer: React.FC = () => {
  useEffect(() => {
    const Toast = Swal.mixin({
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast: any) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
        // toast.addEventListener('click', ()=> Swal.close())
      }
    })

    ;(window as any).SweetAlert = {
      success: (title: string, message: string, isToast: boolean) => {
        Toast.fire({
          icon: 'success' as SweetAlertIcon,
          title: title,
          html: message,
          toast: isToast,
          position: isToast ? 'top-end' : 'center'
        })
      },
      error: (title: string, message: string, isToast: boolean) => {
        Toast.fire({
          icon: 'error' as SweetAlertIcon,
          title: title,
          html: message,
          toast: isToast,
          position: isToast ? 'top-end' : 'center'
        })
      },
      warning: (title: string, message: string, isToast: boolean) => {
        Toast.fire({
          icon: 'warning' as SweetAlertIcon,
          title: title,
          html: message,
          toast: isToast,
          position: isToast ? 'top-end' : 'center'
        })
      },
      info: (title: string, message: string, isToast: boolean) => {
        Toast.fire({
          icon: 'info' as SweetAlertIcon,
          title: title,
          html: message,
          toast: isToast,
          position: isToast ? 'top-end' : 'center'
        })
      },
      question: (title: string, message: string, isToast: boolean) => {
        Toast.fire({
          icon: 'question' as SweetAlertIcon,
          title: title,
          html: message,
          toast: isToast,
          position: isToast ? 'top-end' : 'center'
        })
      },
      confirm: (
        title: string,
        message: string,
        placeholder: string,
        preConfirm: any
      ) => {
        Toast.fire({
          title: title,
          html: message,
          toast: false,
          position: 'center',
          timer: 0,
          timerProgressBar: false,
          input: 'text',
          inputPlaceholder: placeholder,
          inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off'
          },
          showCancelButton: true,
          cancelButtonText: 'Hủy',
          showConfirmButton: true,
          confirmButtonText: 'Xác nhận',
          showLoaderOnConfirm: true,
          preConfirm: preConfirm
        })
      }
    }
  }, [])

  return null
}
