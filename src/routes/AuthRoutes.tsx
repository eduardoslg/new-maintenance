import { Routes, Route, Navigate } from 'react-router-dom'

import { SignIn } from '../pages/Auth/SignIn'

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sign-in" />} />
      <Route path="/sign-in" element={<SignIn />} />
    </Routes>
  )
}
