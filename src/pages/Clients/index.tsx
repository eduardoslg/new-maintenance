import { useRef } from 'react'

import { UserCircle } from 'phosphor-react'

import { Button } from '@siakit/button'
import { Card } from '@siakit/card'
import { DropdownSeparator } from '@siakit/dropdown'
import { Form, FormHandles, MaskInput, TextInput } from '@siakit/form-unform'
import { Heading } from '@siakit/heading'
import { Flex } from '@siakit/layout'
import { useToast } from '@siakit/toast'

import firebase from '../../api/api'

type ClientProps = {
  nomeFantasia: string
  cnpj: string
  endereco: string
}

export function Clients() {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()

  async function handleCreateClient(data: ClientProps) {
    const { cnpj, endereco, nomeFantasia } = data
    console.log(data)

    await firebase
      .firestore()
      .collection('enterprise')
      .add({
        nomeFantasia,
        cnpj,
        endereco,
      })
      .then(() => {
        addToast({
          type: 'success',
          title: 'Sucesso!',
          description: 'Empresa cadastrada!',
        })
      })
      .catch((error: any) => {
        console.log(error)

        addToast({
          type: 'danger',
          title: 'Erro!',
          description: 'Erro ao cadastrar empresa!',
        })
      })
  }

  return (
    <Flex gap padding direction="column">
      <Flex gap={8} align="center">
        <UserCircle size={24} weight="bold" />
        <Heading size="sm">Clientes</Heading>
      </Flex>

      <DropdownSeparator />

      <Flex flex>
        <Form ref={formRef} flex onSubmit={handleCreateClient}>
          <Card padding>
            <Flex width={500} direction="column" gap>
              <TextInput
                name="nomeFantasia"
                label="Nome Fantasia"
                placeholder="Nome Fantasia"
              />

              <MaskInput
                name="cnpj"
                label="CNPJ"
                mask="cnpj"
                placeholder="CNPJ"
              />

              <TextInput
                name="endereco"
                label="Endereço"
                placeholder="Endereço"
              />

              <Button type="submit">Cadastrar</Button>
            </Flex>
          </Card>
        </Form>
      </Flex>
    </Flex>
  )
}
