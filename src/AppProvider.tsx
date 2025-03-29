import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import React from 'react'

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MantineProvider>
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  )
}
