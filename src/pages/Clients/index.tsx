import { useEffect, useRef, useState } from 'react'

import { UserCircle } from 'phosphor-react'
import * as yup from 'yup'

import { Button } from '@siakit/button'
import { Card } from '@siakit/card'
import { useDialog } from '@siakit/dialog'
import { DropdownSeparator } from '@siakit/dropdown'
import { Footer } from '@siakit/footer'
import {
  Form,
  FormHandles,
  getValidationErrors,
  MaskInput,
  TextInput,
} from '@siakit/form-unform'
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

const createClientFormSchema = yup.object({
  nomeFantasia: yup.string().required('Campo obrigatório'),
})

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

    setLoading(true)

    try {
      formRef.current?.setErrors({})

      await createClientFormSchema.validate(data, {
        abortEarly: false,
      })

      if (dataToUpdate.id) {
        await firebase
          .firestore()
          .collection('customers')
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

        addToast({
          type: 'success',
          title: 'Sucesso!',
          description: 'Empresa atualizada!',
        })
      } else {
        await firebase.firestore().collection('customers').add({
          nomeFantasia,
          cnpj,
          endereco,
        })

        loadCustomers()
        handleCloseModal()
        setDataToUpdate({} as ClientProps)

        addToast({
          type: 'success',
          title: 'Sucesso!',
          description: 'Empresa cadastrada!',
        })
      }
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors = getValidationErrors(err)

        formRef.current?.setErrors(errors)
      }
    } finally {
      setLoading(false)
    }
  }

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
      .collection('customers')
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

  function handleDeleteClient(item: any) {
    addDialog({
      title: 'Excluir',
      type: 'danger',
      description: 'Você tem certeza de que quer excluir esse cliente?',
      actionText: 'Sim',
      cancelText: 'Não',
      onAction: () => handleDelete(item),
    })
  }

  function handleCloseModal() {
    setDataToUpdate({} as ClientProps)
    setModalCreateClientVisible(false)
  }

  return (
    <>
      <Modal open={modalCreateClientVisible} onOpenChange={handleCloseModal}>
        <ModalContent
          title={dataToUpdate.id ? 'Editar Cliente' : 'Novo Clinte'}
        >
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
            <Card flex overflow padding>
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
            </Card>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}
