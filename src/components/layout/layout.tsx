import {
  ActionIcon,
  AppShell,
  Burger,
  Center,
  Divider,
  Group,
  ScrollArea,
  Text,
  useComputedColorScheme,
  useMantineColorScheme
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { IconLogout, IconMoon, IconSun } from '@tabler/icons-react'
import cx from 'clsx'
import { useSelector } from 'react-redux'

import { selectFullName, selectRoleName } from '@/redux'
import { removeFromLocalStorage } from '@/utils'

import { NavbarAdmin } from './_navbar-admin'
import { NavbarCollaborator } from './_navbar-collaborator'
import classes from './layout.module.css'

export function Layout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure()
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true
  })

  const fullName = useSelector(selectFullName)
  const roleName = useSelector(selectRoleName)

  const handleLogout = () => {
    modals.openConfirmModal({
      title: 'Đăng xuất',
      children: <Text>Bạn có chắc chắn muốn đăng xuất không?</Text>,
      labels: { confirm: 'Đăng xuất', cancel: 'Đóng' },
      confirmProps: { color: 'red' },
      onCancel: () => {},
      onConfirm: async () => {
        removeFromLocalStorage('authToken')
        window.location.reload()
      }
    })
  }

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text fw={700} size="xl">
            Admin
          </Text>
          <ActionIcon
            onClick={() =>
              setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
            }
            variant="default"
            size="xl"
            aria-label="Toggle color scheme"
          >
            <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
            <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
          </ActionIcon>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section>
          {fullName} - {roleName}
          <Divider mt="sm" />
        </AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea}>
          {roleName === 'Quản trị viên' ? (
            <NavbarAdmin />
          ) : (
            <NavbarCollaborator />
          )}
        </AppShell.Section>
        <AppShell.Section>
          <Divider mb="sm" />
          <a className={classes.link} onClick={handleLogout}>
            <IconLogout className={classes.linkIcon} stroke={1.5} color="red" />
            <span>Đăng xuất</span>
          </a>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      <AppShell.Footer p="md">
        <Center>&copy; Xây dựng bởi HĐK Team.</Center>
      </AppShell.Footer>
    </AppShell>
  )
}
