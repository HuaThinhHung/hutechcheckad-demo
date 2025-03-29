import { Group, Image, Loader, SelectProps, Text } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import axios from 'axios'
import { useEffect, useState } from 'react'

import { DASHBOARD_TEMPLATES_API_URL } from '@/utils'

export const SelectTemplate: SelectProps['renderOption'] = ({
  option: template,
  checked
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')

  useEffect(() => {
    setIsLoading(true)
    findTemplate(template.label)
  }, [])

  const findTemplate = async (title: string) => {
    const docData = (
      await axios.get(
        `${DASHBOARD_TEMPLATES_API_URL}/find-by-title?title=${title}`
      )
    ).data
    setTitle(docData.title)
    setImage(docData.image)
    setIsLoading(false)
  }

  return (
    <>
      {isLoading ? (
        <Loader color="blue" />
      ) : (
        <Group flex="1" gap="sm">
          <Image radius="xs" h={35} src={image} />
          <Text size="sm">{title}</Text>
          {checked && <IconCheck style={{ marginInlineStart: 'auto' }} />}
        </Group>
      )}
    </>
  )
}
