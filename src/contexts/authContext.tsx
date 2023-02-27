import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useLoading } from '@siakit/loading'

import firebase from '../api/api'

type User = {
  uid: any
  nome?: string
  avatarUrl?: string | null
  email?: any
  role?: string
}

type AuthContextData = {
  isSigned?: boolean
  user?: User
  signIn: (data: any) => Promise<void>
  signOut: () => Promise<void>
}

type LoginProps = {
  email: string
  password: string
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: any) {
  const navigate = useNavigate()
  const { setLoading } = useLoading()

  const [user, setUser] = useState<User | undefined>(() => {
    const persistedUser = localStorage.getItem('@manutencao')

    if (persistedUser) {
      return JSON.parse(persistedUser)
    }

    return null
  })

  async function signIn(data: LoginProps) {
    const { email, password } = data

    try {
      setLoading(true)

      await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (value) => {
          const uid = value.user?.uid

          const userProfile = await firebase
            .firestore()
            .collection('users')
            .doc(uid)
            .get()

          const response = {
            uid,
            nome: userProfile.data()?.nome,
            avatarUrl: userProfile.data()?.avatarUrl,
            email: value.user?.email,
            role: userProfile.data()?.role,
          }

          setUser(response)
          localStorage.setItem('@manutencao', JSON.stringify(response))
        })
      navigate('/')
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    try {
      setLoading(true)

      await firebase.auth().signOut()
      localStorage.removeItem('@manutencao')
      setUser(undefined)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isSigned: !!user,
        user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
