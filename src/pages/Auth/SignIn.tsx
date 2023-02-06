import { useContext, useRef } from 'react'

import * as yup from 'yup'

import { Button } from '@siakit/button'
import { Card } from '@siakit/card'
import {
  Form,
  FormHandles,
  TextInput,
  PasswordInput,
  getValidationErrors,
} from '@siakit/form-unform'
import { Heading } from '@siakit/heading'
import { Flex } from '@siakit/layout'
import { useLoading } from '@siakit/loading'
import { Text } from '@siakit/text'

import { AuthContext } from '../../contexts/authContext'
import { Container } from './styles'

const signInFormSchema = yup.object({
  email: yup
    .string()
    .email('O email precisa ser válido.')
    .required('Campo obrigatório.'),
  password: yup.string().required('Campo obrigatório.'),
})

type IData = {
  email: string
  password: string
}

export function SignIn() {
  const formRef = useRef<FormHandles>(null)
  const { setLoading } = useLoading()

  const { signIn } = useContext(AuthContext)
  async function handleSubmit(data: IData) {
    setLoading(true)
    try {
      formRef.current?.setErrors({})

      await signInFormSchema.validate(data, {
        abortEarly: false,
      })
      signIn(data)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        formRef.current?.setErrors(getValidationErrors(err))
      }
    } finally {
      setLoading(false)
    }
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
                name="email"
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
