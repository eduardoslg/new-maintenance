import { useContext, useEffect, useRef, useState } from 'react'

import { format } from 'date-fns'
import { Info } from 'phosphor-react'
import * as yup from 'yup'

import { Accordion, AccordionItem } from '@siakit/accordion'
import { Button } from '@siakit/button'
import { Card } from '@siakit/card'
import { useDialog } from '@siakit/dialog'
import { DropdownSeparator } from '@siakit/dropdown'
import { Footer } from '@siakit/footer'
import {
  Form,
  FormHandles,
  getValidationErrors,
  Select,
  TextAreaInput,
  TextInput,
} from '@siakit/form-unform'
import { Heading } from '@siakit/heading'
import { Flex } from '@siakit/layout'
import { useLoading } from '@siakit/loading'
import { Modal, ModalContent } from '@siakit/modal'
import { Text } from '@siakit/text'
import { useToast } from '@siakit/toast'

import firebase from '../../api/api'
import { AuthContext } from '../../contexts/authContext'

type OptionType = {
  modelo: string
  id: string | number
}

type ProcedureProps = {
  equipmentId: string
  assunto: string
  descricao: string
  equipment: string
  id?: string
}

export function Procedure() {
  const { user } = useContext(AuthContext)
  const { setLoading } = useLoading()

  const formRef = useRef<FormHandles>(null)
  const equipmentFormRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const { addDialog } = useDialog()

  const [equipmentSelected, setEquipmentSelected] = useState<OptionType[]>([])
  const [teste, setTeste] = useState('')
  const [procedures, setProcedures] = useState([])
  const [equipment, setEquipment] = useState('')
  const [dataToUpdate, setDataToUpdate] = useState<ProcedureProps>(
    {} as ProcedureProps,
  )

  const [modalProceduresVisible, setModalProceduresVisible] = useState(false)

  const createProcedureFormSchema = yup.object({
    equipmentId: yup.string().when('tste', {
      is: dataToUpdate.id,
      then: () => yup.string().required('Campo obrigatório'),
    }),
    assunto: yup.string().required('Campo obrigatório'),
    descricao: yup.string().required('Campo obrigatório'),
  })

  useEffect(() => {
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
            })
          })

          if (lista.length === 0) {
            setEquipmentSelected([{ id: '1', modelo: 'Teste' }] as any)
            return
          }

          setEquipmentSelected(lista as any)
        })
        .catch((error: any) => {
          console.log('DEU ALGUM ERRO!', error)
          setEquipmentSelected([{ id: '1', modelo: '' }] as any)
        })
    }

    loadEquipments()
  }, [])

  useEffect(() => {
    loadProcedures()
  }, [teste, equipmentSelected])

  async function loadProcedures() {
    const listRef = firebase
      .firestore()
      .collection('procedure')
      .where('equipmentId', '==', equipmentSelected[Number(teste)].id)

    await listRef
      .get()
      .then((snapshot) => {
        updateState(snapshot)
      })
      .catch((err) => {
        console.log('Deu algum erro: ', err)
      })
  }

  async function updateState(snapshot: any) {
    const lista: any = []

    snapshot.forEach((doc: any) => {
      lista.push({
        id: doc.id,
        assunto: doc.data().assunto,
        descricao: doc.data().descricao,
        equipment: doc.data().equipment,
        equipmentId: doc.data().equipmentId,
        created: doc.data().created,
        createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
        usuario: doc.data().userName,
      })
    })
    setProcedures(lista)
  }

  async function handleCreateObs(data: ProcedureProps) {
    const { assunto, descricao, equipmentId } = data

    try {
      setLoading(true)

      formRef.current?.setErrors({})

      await createProcedureFormSchema.validate(data, {
        abortEarly: false,
      })

      if (dataToUpdate.id) {
        await firebase
          .firestore()
          .collection('procedure')
          .doc(dataToUpdate.id)
          .update({
            descricao,
            assunto,
            userId: user?.uid,
            userName: user?.nome,
          })

        loadProcedures()
        handleCloseModal()

        addToast({
          type: 'success',
          title: 'Sucesso',
          duration: 3000,
          description: 'Procedimento editado com sucesso!',
        })
      } else {
        await firebase.firestore().collection('procedure').add({
          created: new Date(),
          equipment,
          equipmentId,
          assunto,
          descricao,
          userId: user?.uid,
          userName: user?.nome,
        })

        loadProcedures()
        handleCloseModal()

        addToast({
          type: 'success',
          title: 'Sucesso',
          duration: 3000,
          description: 'Procedimento criado com sucesso!',
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
  async function handleDelete(item: any) {
    await firebase
      .firestore()
      .collection('procedure')
      .doc(item.id)
      .delete()
      .then(() => {
        addToast({
          title: 'Sucesso!',
          type: 'success',
          description: 'Excluído com sucesso!',
        })
        loadProcedures()
      })
  }

  function handleDeleteClient(item: any) {
    addDialog({
      title: 'Excluir',
      type: 'danger',
      description: 'Você tem certeza de que quer excluir esse procedimento?',
      actionText: 'Sim',
      cancelText: 'Não',
      onAction: () => handleDelete(item),
    })
  }

  function handleCloseModal() {
    setDataToUpdate({} as ProcedureProps)
    setModalProceduresVisible(false)
  }

  return (
    <>
      <Modal open={modalProceduresVisible} onOpenChange={handleCloseModal}>
        <ModalContent
          title={dataToUpdate.id ? `Editar Procedimento` : 'Novo Procedimento'}
        >
          <Form
            overflow
            ref={formRef}
            onSubmit={handleCreateObs}
            initialData={dataToUpdate}
          >
            <Flex overflow direction="column" padding gap={8}>
              {!dataToUpdate.id && (
                <Select
                  label="Equipamento"
                  name="equipmentId"
                  placeholder="Equipamento"
                  options={equipmentSelected.map((item: any) => {
                    return {
                      value: item.id,
                      label: item.modelo,
                    }
                  })}
                  onChange={(value: any) => {
                    setEquipment(value.label)
                  }}
                  disabled={!!dataToUpdate.id}
                />
              )}

              <TextInput label="Assunto" name="assunto" placeholder="Assunto" />

              <TextAreaInput
                label="Descrição"
                name="descricao"
                placeholder="Descreva o procedimento aqui"
              />
            </Flex>

            <Footer>
              <Button variant="ghost" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button>Salvar</Button>
            </Footer>
          </Form>
        </ModalContent>
      </Modal>

      <Flex overflow padding direction="column" gap>
        <Flex flex gap direction="column">
          <Flex gap align="center">
            <Info size={32} />
            <Heading>Procedimentos</Heading>
          </Flex>

          <DropdownSeparator />

          <Flex flex direction="column" gap>
            <Form
              onSubmit={() => undefined}
              ref={equipmentFormRef}
              initialData={{ enterprise: 1 }}
            >
              <Flex width={250}>
                <Select
                  label="Equipamento"
                  name="equipment"
                  placeholder="Equipamento"
                  options={equipmentSelected.map((item, index) => {
                    return {
                      value: index,
                      label: item.modelo,
                    }
                  })}
                  onChange={(value: any) => {
                    setTeste(value.value)
                  }}
                />
              </Flex>
            </Form>

            <Flex>
              <Button onClick={() => setModalProceduresVisible(true)}>
                Novo Procedimento
              </Button>
            </Flex>
          </Flex>
        </Flex>

        {!procedures.length && (
          <Flex
            flex
            align="center"
            justify="center"
            padding={200}
            direction="column"
          >
            <Heading size="sm" weight="medium">
              Não há dados.
            </Heading>
            <Heading size="sm" weight="medium">
              Selecione algum equipamento para buscar.
            </Heading>
          </Flex>
        )}

        {!!procedures.length && (
          <Flex overflow>
            <Card overflow flex padding>
              <Accordion type="multiple">
                {procedures.map((item: any, index: any) => {
                  return (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      title={
                        <Flex flex align="center" gap={8} justify="between">
                          <Flex align="center" gap={8}>
                            <Text>#{index + 1}</Text>
                            <Text>- {item.assunto}</Text>
                          </Flex>

                          <Flex gap={8}>
                            <Button
                              size="sm"
                              onClick={(event) => {
                                event.stopPropagation()
                                setDataToUpdate(item)
                                setModalProceduresVisible(true)
                              }}
                            >
                              Editar
                            </Button>

                            <Button
                              size="sm"
                              colorScheme="red"
                              onClick={(event) => {
                                event.stopPropagation()
                                handleDeleteClient(item)
                              }}
                            >
                              Excluir
                            </Button>
                          </Flex>
                        </Flex>
                      }
                    >
                      <Flex padding>{item.descricao}</Flex>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </Card>
          </Flex>
        )}
      </Flex>
    </>
  )
}
