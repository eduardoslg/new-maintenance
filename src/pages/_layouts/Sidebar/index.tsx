import { useNavigate } from 'react-router-dom'

import { DeviceMobile, Gear, UserCircle } from 'phosphor-react'

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

import image from '../../../assets/images.png'

export function Sidebar() {
  const navigate = useNavigate()

  return (
    <Flex>
      <SidebarSiakit>
        <Menu>
          <MenuHeader>
            <Flex
              onClick={() => navigate('/')}
              padding={16}
              align="center"
              justify="center"
            >
              <img
                src={image}
                alt=""
                style={{ width: 160, borderRadius: '6px', cursor: 'pointer' }}
              />
            </Flex>

            <Flex flex justify="center">
              <Text
                css={{ color: '#fff', cursor: 'pointer', fontWeight: '$bold' }}
              >
                ATM
              </Text>
            </Flex>
          </MenuHeader>

          <MenuItem value="1" icon={<Gear size={32} />}>
            Manutenção
          </MenuItem>

          <MenuItem value="2" icon={<UserCircle size={32} />}>
            Clientes
          </MenuItem>

          <MenuItem value="3" icon={<DeviceMobile size={32} />}>
            Equipamentos
          </MenuItem>
        </Menu>

        <SubMenu value="1">
          <SubMenuTitle>Manutenção</SubMenuTitle>

          <SubMenuSeparator />

          <SubMenuItem onClick={() => navigate('/')}>Observações</SubMenuItem>

          <SubMenuSeparator />

          <SubMenuItem onClick={() => navigate('/procedure')}>
            Procedimentos
          </SubMenuItem>
        </SubMenu>

        <SubMenu value="2">
          <SubMenuTitle>Clientes</SubMenuTitle>
          <SubMenuSeparator />
          <SubMenuItem onClick={() => navigate('/clients')}>
            Cadastro
          </SubMenuItem>
        </SubMenu>

        <SubMenu value="3">
          <SubMenuTitle>Equipamentos</SubMenuTitle>
          <SubMenuSeparator />
          <SubMenuItem onClick={() => navigate('/equipment')}>
            Cadastro
          </SubMenuItem>
        </SubMenu>
      </SidebarSiakit>
    </Flex>
  )
}
