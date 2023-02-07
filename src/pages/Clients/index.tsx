import { useEffect, useRef, useState } from 'react'

import { DotsThreeVertical, UserCircle } from 'phosphor-react'

import { Button } from '@siakit/button'
import { Card } from '@siakit/card'
import {
  DropdownSeparator,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownTrigger,
} from '@siakit/dropdown'
import { Footer } from '@siakit/footer'
import { Form, FormHandles, MaskInput, TextInput } from '@siakit/form-unform'
import { Heading } from '@siakit/heading'
import { Flex } from '@siakit/layout'
import { Modal, ModalContent } from '@siakit/modal'
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

  const [modalCreateClientVisible, setModalCreateClientVisible] =
    useState(false)
  const [clients, setClients] = useState([])

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

  console.log(clients)

  useEffect(() => {
    async function loadCustomers() {
      await firebase
        .firestore()
        .collection('customers')
        .get()
        .then((snapshot: any) => {
          const lista: any = []

          snapshot.forEach((doc: any) => {
            lista.push({
              id: doc.id,
              nomeFantasia: doc.data().nomeFantasia,
              cnpj: doc.data().cnpj,
              endereco: doc.data().endereco,
            })
          })

          if (lista.length === 0) {
            console.log('NENHUMA EMPRESA ENCONTRADA')
            setClients([{ id: '1', nomeFantasia: 'FREELA' }] as any)
            return
          }

          setClients(lista as any)
        })
        .catch((error: any) => {
          console.log('DEU ALGUM ERRO!', error)
        })
    }

    loadCustomers()
  }, [])

  return (
    <>
      <Modal
        open={modalCreateClientVisible}
        onOpenChange={() => setModalCreateClientVisible(false)}
      >
        <ModalContent title="Novo Cliente">
          <Form ref={formRef} flex onSubmit={handleCreateClient}>
            <Flex padding direction="column" gap>
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
            </Flex>
            <Footer>
              <Button
                variant="ghost"
                type="button"
                onClick={() => setModalCreateClientVisible(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Cadastrar</Button>
            </Footer>
          </Form>
        </ModalContent>
      </Modal>

      <Flex overflow flex gap padding direction="column">
        <Flex gap={8} align="center">
          <UserCircle size={26} weight="bold" />
          <Heading size="sm">Cadastro de Clientes</Heading>
        </Flex>

        <DropdownSeparator />

        <Flex gap direction="column" overflow>
          <Flex>
            <Button onClick={() => setModalCreateClientVisible(true)}>
              Novo Cliente
            </Button>
          </Flex>

          <Flex overflow direction="column" gap={8}>
            {clients.map((client: any) => {
              return (
                <Card key={client.id} padding justify="between">
                  <Flex>
                    <p>teste</p>
                  </Flex>

                  <Flex>
                    <Button size="sm" variant="secondary">
                      <DotsThreeVertical size={16} weight="bold" />
                      <Dropdown open={true}></Dropdown>
                    </Button>
                  </Flex>
                </Card>
              )
            })}
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}
