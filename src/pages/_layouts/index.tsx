import { useContext } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { CaretDown, List } from 'phosphor-react'

import { Avatar } from '@siakit/avatar'
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
} from '@siakit/dropdown'
import { IconButton } from '@siakit/icon-button'
import { Flex } from '@siakit/layout'
import { PageHeader } from '@siakit/page-header'

import { AuthContext } from '../../contexts/authContext'
import { Sidebar } from './Sidebar'

export function DefaultLayout() {
  const { user } = useContext(AuthContext)

  const navigate = useNavigate()

  return (
    <Flex overflow flex>
      <Sidebar />

      <Flex overflow flex direction="column">
        <PageHeader
          title="Manutenção"
          onGoBack={
            location.pathname.split('/').filter((item) => Boolean(item))
              .length > 0
              ? () => navigate(-1)
              : undefined
          }
          leftContent={
            <IconButton
              onClick={() => undefined}
              variant="ghost"
              colorScheme="gray"
            >
              <List size={32} weight="bold" />
            </IconButton>
          }
        >
          <Flex>
            <Dropdown>
              <DropdownTrigger>
                <Flex gap={8} align="center">
                  <Flex align="center" gap={8}>
                    <Avatar size="sm" name={user?.nome} src="" />
                    <p>{user?.nome}</p>
                  </Flex>
                  <CaretDown />
                </Flex>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownLabel>Configuraçōes</DropdownLabel>

                <DropdownItem onClick={() => navigate('/profile')}>
                  Meu perfil
                </DropdownItem>
                <DropdownSeparator />
                <DropdownLabel>Ações</DropdownLabel>
                <DropdownItem type="danger" onClick={() => undefined}>
                  Sair
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          </Flex>
        </PageHeader>

        <Outlet />
      </Flex>
    </Flex>
  )
}
