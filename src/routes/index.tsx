import { useContext } from 'react'

import { AuthContext } from '../contexts/authContext'
import { AppRoutes } from './AppRoutes'
import { AuthRoutes } from './AuthRoutes'

export function Routes() {
  const { user } = useContext(AuthContext)

  const teste = !!user?.uid
  console.log(!!user?.uid)

  if (teste) {
    return <AppRoutes />
  }

  return <AuthRoutes />
}
