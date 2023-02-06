import { useEffect, useState } from 'react'

import { format } from 'date-fns'
import { Info } from 'phosphor-react'

import { Accordion, AccordionItem } from '@siakit/accordion'
import { Card } from '@siakit/card'
import { DropdownSeparator } from '@siakit/dropdown'
import { Form, Select } from '@siakit/form-unform'
import { Heading } from '@siakit/heading'
import { Flex } from '@siakit/layout'

import firebase from '../../api/api'

type OptionType = {
  nomeFantasia: string
  id: string | number
}

export function Home() {
  const [enterpriseSelected, setEnterpriseSelected] = useState<OptionType[]>([])
  const [teste, setTeste] = useState(0)
  const [notes, setNotes] = useState([])

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

    loadNotes()
  }, [teste, enterpriseSelected])

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

  console.log(notes)

  return (
    <>
      <Flex padding direction="column" gap>
        <Flex flex gap direction="column">
          <Flex gap align="center">
            <Info size={32} />
            <Heading>Informações</Heading>
          </Flex>

          <DropdownSeparator />

          <Flex flex>
            <Form
              onSubmit={() => undefined}
              initialData={{ enterprise: teste }}
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
                    console.log(value)
                    setTeste(value.value)
                  }}
                />
              </Flex>
            </Form>
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
          <Flex flex>
            <Card flex padding>
              <Accordion type="multiple">
                {notes.map((item: any, index: any) => {
                  return (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      title={`#${index + 1} -  ${item.assunto}`}
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
