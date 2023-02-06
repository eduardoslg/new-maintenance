import { useNavigate } from 'react-router-dom'

import { Gear } from 'phosphor-react'

import { Heading } from '@siakit/heading'
import { Flex } from '@siakit/layout'
import {
  Menu,
  Sidebar as SidebarSiakit,
  MenuHeader,
  MenuItem,
  SubMenuTitle,
  SubMenuSeparator,
  SubMenuItem,
  SubMenu,
} from '@siakit/sidebar'
import { Text } from '@siakit/text'

export function Sidebar() {
  const navigate = useNavigate()

  return (
    <Flex>
      <SidebarSiakit>
        <Menu>
          <MenuHeader>
            <Flex padding="44px" align="center" justify="center">
              <Heading size="sm" css={{ color: '#fff', cursor: 'pointer' }}>
                Manutenção
              </Heading>
            </Flex>

            <Flex padding>
              <Text css={{ color: '#fff', cursor: 'pointer' }}>M</Text>
            </Flex>
          </MenuHeader>

          <MenuItem value="1" icon={<Gear size={32} />}>
            Manutenção
          </MenuItem>
        </Menu>

        <SubMenu value="1">
          <SubMenuTitle>Manutenção</SubMenuTitle>
          <SubMenuSeparator />
          <SubMenuItem onClick={() => navigate('/')}>Dashboard</SubMenuItem>
        </SubMenu>
      </SidebarSiakit>
    </Flex>
  )
}
