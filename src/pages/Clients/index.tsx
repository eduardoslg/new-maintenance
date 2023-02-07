import { useEffect, useRef, useState } from 'react'

import { UserCircle } from 'phosphor-react'

import { Button } from '@siakit/button'
import { useDialog } from '@siakit/dialog'
import { DropdownSeparator } from '@siakit/dropdown'
import { Footer } from '@siakit/footer'
import { Form, FormHandles, MaskInput, TextInput } from '@siakit/form-unform'
import { Heading } from '@siakit/heading'
import { Flex } from '@siakit/layout'
import { useLoading } from '@siakit/loading'
import { Modal, ModalContent } from '@siakit/modal'
import { Table } from '@siakit/table'
import { useToast } from '@siakit/toast'

import firebase from '../../api/api'

type ClientProps = {
  nomeFantasia: string
  cnpj: string
  endereco: string
  id: string
}

export function Clients() {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const { addDialog } = useDialog()
  const { setLoading } = useLoading()

  const [modalCreateClientVisible, setModalCreateClientVisible] =
    useState(false)
  const [clients, setClients] = useState([])
  const [dataToUpdate, setDataToUpdate] = useState<ClientProps>(
    {} as ClientProps,
  )

  async function handleCreateClient(data: ClientProps) {
    const { cnpj, endereco, nomeFantasia } = data
    console.log(data)

    setLoading(true)

    if (dataToUpdate.id) {
      await firebase
        .firestore()
        .collection('enterprise')
        .doc(dataToUpdate.id)
        .update({
          nomeFantasia: data.nomeFantasia,
          cnpj: data.cnpj,
          endereco: data.endereco,
        })
        .then(() => console.log('status 200'))
        .finally(() => setLoading(false))

      loadCustomers()
      handleCloseModal()
      setDataToUpdate({} as ClientProps)
    } else {
      await firebase
        .firestore()
        .collection('enterprise')
        .add({
          nomeFantasia,
          cnpj,
          endereco,
        })
        .then(() => {
          loadCustomers()

          addToast({
            type: 'success',
            title: 'Sucesso!',
            description: 'Empresa cadastrada!',
          })
        })
        .catch((error: any) => {
          console.log(error)

          addToast({
            type: 'warning',
            title: 'Erro!',
            description: 'Erro ao cadastrar empresa!',
          })
        })
        .finally(() => setLoading(false))
    }
  }

  console.log(clients)

  async function loadCustomers() {
    await firebase
      .firestore()
      .collection('enterprise')
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

  useEffect(() => {
    loadCustomers()
  }, [])

  async function handleDelete(item: any) {
    await firebase
      .firestore()
      .collection('enterprise')
      .doc(item.id)
      .delete()
      .then(() => {
        addToast({
          title: 'Sucesso!',
          type: 'success',
          description: 'Excluído com sucesso!',
        })
        loadCustomers()
      })
  }

  function handleCloseModal() {
    setDataToUpdate({} as ClientProps)
    setModalCreateClientVisible(false)
  }

  function handleDeleteClient(item: any) {
    addDialog({
      title: 'Excluir',
      type: 'danger',
      description: 'Você tem certeza?',
      actionText: 'Sim',
      cancelText: 'Não',
      onAction: () => handleDelete(item),
    })
  }

  return (
    <>
      <Modal open={modalCreateClientVisible} onOpenChange={handleCloseModal}>
        <ModalContent title="Novo Cliente">
          <Form
            ref={formRef}
            flex
            onSubmit={handleCreateClient}
            initialData={
              dataToUpdate.id
                ? {
                    ...dataToUpdate,
                  }
                : {}
            }
          >
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
              <Button variant="ghost" type="button" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit">
                {dataToUpdate.id ? 'Salvar' : 'Cadastrar'}
              </Button>
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

          <Flex overflow>
            <Table
              data={clients}
              headers={[
                {
                  label: 'Empresa',
                  dataIndex: 'nomeFantasia',
                },
                {
                  label: 'Endereço',
                  dataIndex: 'endereco',
                },
                {
                  label: 'CNPJ',
                  dataIndex: 'cnpj',
                },
              ]}
              actions={[
                {
                  label: 'Editar',
                  onClick: (item: any) => {
                    setDataToUpdate(item)
                    setModalCreateClientVisible(true)
                  },
                },
                {
                  label: 'Excluir',
                  type: 'danger',
                  onClick: (item) => handleDeleteClient(item),
                },
              ]}
            />
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}
