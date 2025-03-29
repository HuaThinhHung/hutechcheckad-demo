import {
  Center,
  Group,
  Loader,
  rem,
  Text,
  useMantineTheme
} from '@mantine/core'
import { IconUserCheck, IconUserPlus } from '@tabler/icons-react'
import axios from 'axios'
import { useEffect, useState } from 'react'

import { DASHBOARD_CERTS_API_URL } from '@/utils'

import classes from './number-participants-collaborator.module.css'

export const NumberParticipantsCollaborator = ({
  docId
}: {
  docId: string
}) => {
  const theme = useMantineTheme()

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
          <Group gap="lg">
            <Center>
              <IconUserPlus
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
                color={theme.colors.dark[2]}
              />
              <Text size="sm" className={classes.bodyText}>
                {checkinLength}
              </Text>
            </Center>
            <Center>
              <IconUserCheck
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
                color={theme.colors.dark[2]}
              />
              <Text size="sm" className={classes.bodyText}>
                {checkoutLength}
              </Text>
            </Center>
          </Group>
        </>
      )}
    </>
  )
}
