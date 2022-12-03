import { useRef } from 'react'

import { Button } from '@siakit/button'
import { Card } from '@siakit/card'
import {
  Form,
  FormHandles,
  TextInput,
  PasswordInput,
} from '@siakit/form-unform'
import { Heading } from '@siakit/heading'
import { Flex } from '@siakit/layout'
import { Text } from '@siakit/text'

import { Container } from './styles'

export function SignIn() {
  const formRef = useRef<FormHandles>(null)

  async function handleSubmit() {
    console.log('clicou')
  }

  return (
    <Container flex align="center" justify="center">
      <Card>
        <Flex padding direction="column" gap>
          <Heading size="lg" weight="medium">
            Login
          </Heading>
          <Text lowContrast>Olá, bem-vindo de volta 👋</Text>

          <Form ref={formRef} onSubmit={handleSubmit}>
            <Flex direction="column" gap>
              <TextInput
                name="login"
                label="Login"
                placeholder="Ex.: fulanodetal@gmail.com.br"
              />
              <PasswordInput
                name="password"
                label="Senha"
                placeholder="Ex.: 12345678"
              />
              <Button type="submit">Login</Button>
            </Flex>
          </Form>
        </Flex>
      </Card>
    </Container>
  )
}
