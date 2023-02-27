import { useEffect, useRef, useState } from 'react'

import { DeviceMobile } from 'phosphor-react'
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
  TextInput,
} from '@siakit/form-unform'
import { Heading } from '@siakit/heading'
import { Flex } from '@siakit/layout'
import { useLoading } from '@siakit/loading'
import { Modal, ModalContent } from '@siakit/modal'
import { Table } from '@siakit/table'
import { useToast } from '@siakit/toast'

import firebase from '../../api/api'

type EquipmentProps = {
  modelo: string
  nome: string
  id: string
}

const createEquipmentFormSchema = yup.object({
  modelo: yup.string().required('Campo obrigatório'),
  nome: yup.string().required('Campo obrigatório'),
})

export function Equipment() {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const { addDialog } = useDialog()
  const { setLoading } = useLoading()

  const [modalCreateEquipmentVisible, setModalCreateEquipmentVisible] =
    useState(false)
  const [equipaments, setEquipaments] = useState([])
  const [dataToUpdate, setDataToUpdate] = useState<EquipmentProps>(
    {} as EquipmentProps,
  )

  async function handleCreateEquipment(data: EquipmentProps) {
    const { modelo, nome } = data

    setLoading(true)

    try {
      formRef.current?.setErrors({})

      await createEquipmentFormSchema.validate(data, {
        abortEarly: false,
      })

      if (dataToUpdate.id) {
        await firebase
          .firestore()
          .collection('equipment')
          .doc(dataToUpdate.id)
          .update({
            modelo: data.modelo,
            nome: data.nome,
          })
          .then(() => console.log('status 200'))
          .finally(() => setLoading(false))

        loadEquipments()
        handleCloseModal()
        setDataToUpdate({} as EquipmentProps)

        addToast({
          type: 'success',
          title: 'Sucesso!',
          description: 'Equipamento atualizado!',
        })
      } else {
        await firebase.firestore().collection('equipment').add({
          modelo,
          nome,
        })

        loadEquipments()
        handleCloseModal()
        setDataToUpdate({} as EquipmentProps)

        addToast({
          type: 'success',
          title: 'Sucesso!',
          description: 'Equipamento cadastrado!',
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

  async function loadEquipments() {
    await firebase
      .firestore()
      .collection('equipment')
      .get()
      .then((snapshot: any) => {
        const lista: any = []

        snapshot.forEach((doc: any) => {
          lista.push({
            id: doc.id,
            modelo: doc.data().modelo,
            nome: doc.data().nome,
          })
        })

        setEquipaments(lista as any)
      })
      .catch((error: any) => {
        console.log('DEU ALGUM ERRO!', error)
      })
  }

  useEffect(() => {
    loadEquipments()
  }, [])

  async function handleDelete(item: any) {
    await firebase
      .firestore()
      .collection('equipment')
      .doc(item.id)
      .delete()
      .then(() => {
        addToast({
          title: 'Sucesso!',
          type: 'success',
          description: 'Excluído com sucesso!',
        })
        loadEquipments()
      })
  }

  function handleDeleteClient(item: any) {
    addDialog({
      title: 'Excluir',
      type: 'danger',
      description: 'Você tem certeza de que quer excluir esse equipamento?',
      actionText: 'Sim',
      cancelText: 'Não',
      onAction: () => handleDelete(item),
    })
  }

  function handleCloseModal() {
    setDataToUpdate({} as EquipmentProps)
    setModalCreateEquipmentVisible(false)
  }

  return (
    <>
      <Modal open={modalCreateEquipmentVisible} onOpenChange={handleCloseModal}>
        <ModalContent
          title={dataToUpdate.id ? 'Editar Equipamento' : 'Novo Equipamento'}
        >
          <Form
            ref={formRef}
            flex
            onSubmit={handleCreateEquipment}
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
                name="modelo"
                label="Modelo"
                placeholder="Modelo do equipamento"
              />

              <TextInput
                name="nome"
                label="Nome"
                placeholder="Nome do equipamento"
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
          <DeviceMobile size={26} weight="bold" />
          <Heading size="sm">Cadastro de Equipamentos</Heading>
        </Flex>

        <DropdownSeparator />

        <Flex gap direction="column" overflow>
          <Flex>
            <Button onClick={() => setModalCreateEquipmentVisible(true)}>
              Novo Equipamento
            </Button>
          </Flex>

          <Flex overflow>
            <Card flex overflow padding>
              <Table
                data={equipaments}
                headers={[
                  {
                    label: 'Modelo',
                    dataIndex: 'modelo',
                  },
                  {
                    label: 'Nome',
                    dataIndex: 'nome',
                  },
                ]}
                actions={[
                  {
                    label: 'Editar',
                    onClick: (item: any) => {
                      setDataToUpdate(item)
                      setModalCreateEquipmentVisible(true)
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
