import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { AuthContext } from '../contexts/authContext'

export function Protected() {
  const { user } = useContext(AuthContext)

  if (!user?.uid) {
    return <Navigate to="/sign-in" />
  }

  return <Outlet />
}
