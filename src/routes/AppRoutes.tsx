import { Route, Routes } from 'react-router-dom'

import { SignIn } from '../pages/Auth/SignIn'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
    </Routes>
  )
}
