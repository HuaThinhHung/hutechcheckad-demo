import { Badge, Loader } from '@mantine/core'
import axios from 'axios'
import { useEffect, useState } from 'react'

import { DASHBOARD_CERTS_API_URL } from '@/utils'

export const NumberParticipants = ({ docId }: { docId: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [checkinLength, setCheckinLength] = useState<number>(0)
  const [checkoutLength, setCheckoutLength] = useState<number>(0)

  useEffect(() => {
    setIsLoading(true)
    getEventCheckin()
  }, [])

  const getEventCheckin = async () => {
    const docsSnap = (
      await axios.get(
        `${DASHBOARD_CERTS_API_URL}/find-by-event-id?evId=${docId}`
      )
    ).data

    setCheckinLength(docsSnap.length)
    let checkoutLen = 0

    docsSnap.forEach((doc: any) => {
      if (doc.checkoutAt !== '') {
        checkoutLen++
      }
    })

    setCheckoutLength(checkoutLen)
    setIsLoading(false)
  }

  return (
    <>
      {isLoading ? (
        <Loader color="blue" size="xs" mr="xs" />
      ) : (
        <>
          <Badge color="blue" radius="xs">
            {checkinLength}
          </Badge>{' '}
          <Badge color="red" radius="xs">
            {checkoutLength}
          </Badge>
        </>
      )}
    </>
  )
}
