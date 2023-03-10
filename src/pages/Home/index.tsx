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
  nomeFantasia: string
  id: string | number
}

type NotesProps = {
  clientId: string
  assunto: string
  descricao: string
  cliente: string
  id?: string
}

export function Home() {
  const { user } = useContext(AuthContext)
  const { setLoading } = useLoading()

  const formRef = useRef<FormHandles>(null)
  const clientFormRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const { addDialog } = useDialog()

  const [enterpriseSelected, setEnterpriseSelected] = useState<OptionType[]>([])
  const [teste, setTeste] = useState('')
  const [notes, setNotes] = useState([])
  const [client, setClient] = useState('')
  const [dataToUpdate, setDataToUpdate] = useState<NotesProps>({} as NotesProps)

  const [modalNotesVisible, setModalNotesVisible] = useState(false)

  const createNoteFormSchema = yup.object({
    clientId: yup.string().when('tste', {
      is: dataToUpdate.id,
      then: () => yup.string().required('Campo obrigatório'),
    }),
    assunto: yup.string().required('Campo obrigatório'),
    descricao: yup.string().required('Campo obrigatório'),
  })

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
            })
          })

          if (lista.length === 0) {
            console.log('NENHUMA EMPRESA ENCONTRADA')
            setEnterpriseSelected([{ id: '1', nomeFantasia: 'FREELA' }] as any)
            return
          }

          setEnterpriseSelected(lista as any)
        })
        .catch((error: any) => {
          console.log('DEU ALGUM ERRO!', error)
          setEnterpriseSelected([{ id: '1', nomeFantasia: '' }] as any)
        })
    }

    loadCustomers()
  }, [])

  useEffect(() => {
    loadNotes()
  }, [teste, enterpriseSelected])

  async function loadNotes() {
    const listRef = firebase
      .firestore()
      .collection('notes')
      .where('clienteId', '==', enterpriseSelected[Number(teste)].id)

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
        cliente: doc.data().cliente,
        clienteId: doc.data().clienteId,
        created: doc.data().created,
        createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
        status: doc.data().status,
        usuario: doc.data().userName,
      })
    })
    setNotes(lista)
  }

  async function handleCreateObs(data: NotesProps) {
    const { assunto, descricao, clientId } = data

    try {
      setLoading(true)

      formRef.current?.setErrors({})

      await createNoteFormSchema.validate(data, {
        abortEarly: false,
      })

      if (dataToUpdate.id) {
        await firebase
          .firestore()
          .collection('notes')
          .doc(dataToUpdate.id)
          .update({
            descricao,
            assunto,
            userId: user?.uid,
            userName: user?.nome,
          })

        loadNotes()
        handleCloseModal()

        addToast({
          type: 'success',
          title: 'Sucesso',
          duration: 3000,
          description: 'Observação editada com sucesso!',
        })
      } else {
        await firebase.firestore().collection('notes').add({
          created: new Date(),
          cliente: client,
          clienteId: clientId,
          assunto,
          descricao,
          userId: user?.uid,
          userName: user?.nome,
        })

        loadNotes()
        handleCloseModal()

        addToast({
          type: 'success',
          title: 'Sucesso',
          duration: 3000,
          description: 'Observação criada com sucesso!',
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
      .collection('notes')
      .doc(item.id)
      .delete()
      .then(() => {
        addToast({
          title: 'Sucesso!',
          type: 'success',
          description: 'Excluído com sucesso!',
        })
        loadNotes()
      })
  }

  function handleDeleteClient(item: any) {
    addDialog({
      title: 'Excluir',
      type: 'danger',
      description: 'Você tem certeza de que quer excluir essa observação?',
      actionText: 'Sim',
      cancelText: 'Não',
      onAction: () => handleDelete(item),
    })
  }

  function handleCloseModal() {
    setDataToUpdate({} as NotesProps)
    setModalNotesVisible(false)
  }

  return (
    <>
      <Modal open={modalNotesVisible} onOpenChange={handleCloseModal}>
        <ModalContent
          title={
            dataToUpdate.id
              ? `Editar observação (${dataToUpdate.cliente})`
              : 'Nova Observação'
          }
        >
          <Form
            overflow
            ref={formRef}
            onSubmit={handleCreateObs}
            initialData={
              dataToUpdate.id
                ? {
                    ...dataToUpdate,
                    clientId: 0,
                  }
                : {
                    clientId: client,
                  }
            }
          >
            <Flex overflow direction="column" padding gap={8}>
              {!dataToUpdate.id && (
                <Select
                  label="Empresa"
                  name="clientId"
                  placeholder="Empresa"
                  options={enterpriseSelected.map((item: any) => {
                    return {
                      value: item.id,
                      label: item.nomeFantasia,
                    }
                  })}
                  onChange={(value: any) => {
                    setClient(value.label)
                  }}
                  disabled={!!dataToUpdate.id}
                />
              )}

              <TextInput label="Assunto" name="assunto" placeholder="Assunto" />

              <TextAreaInput
                label="Descrição"
                name="descricao"
                placeholder="Descreva a informação aqui"
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
            <Heading>Observações</Heading>
          </Flex>

          <DropdownSeparator />

          <Flex flex direction="column" gap>
            <Form
              onSubmit={() => undefined}
              ref={clientFormRef}
              initialData={{ enterprise: 1 }}
            >
              <Flex width={250}>
                <Select
                  label="Empresa"
                  name="enterprise"
                  placeholder="Empresa"
                  options={enterpriseSelected.map((item, index) => {
                    return {
                      value: index,
                      label: item.nomeFantasia,
                    }
                  })}
                  onChange={(value: any) => {
                    setTeste(value.value)
                  }}
                />
              </Flex>
            </Form>

            <Flex>
              <Button onClick={() => setModalNotesVisible(true)}>
                Nova Observação
              </Button>
            </Flex>
          </Flex>
        </Flex>

        {!notes.length && (
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
              Selecione alguma empresa para buscar.
            </Heading>
          </Flex>
        )}

        {!!notes.length && (
          <Flex overflow>
            <Card overflow flex padding>
              <Accordion type="multiple">
                {notes.map((item: any, index: any) => {
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
                                setModalNotesVisible(true)
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
