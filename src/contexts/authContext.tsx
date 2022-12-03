import { createContext, ReactNode, useEffect, useState } from 'react'

import { useLoading } from '@siakit/loading'

export const AuthContext = createContext({})

function AuthProvider(children: ReactNode) {
  const [user, setUser] = useState(null)
  const { setLoading } = useLoading()

  useEffect(() => {
    function loadStorage() {
      const storageUser = localStorage.getItem('@manutencao')

      if (storageUser) {
        setUser(JSON.parse(storageUser))
      }
    }
    loadStorage()
  }, [])

  async function signIn(data) {
    console.log('clicou')
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
