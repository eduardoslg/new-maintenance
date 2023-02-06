import { Route, Routes } from 'react-router-dom'

import { DefaultLayout } from '../pages/_layouts'
import { SignIn } from '../pages/Auth/SignIn'
import { Clients } from '../pages/Clients'
import { Home } from '../pages/Home'
import { Profile } from '../pages/Profile'
import { Protected } from './Protected'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Protected />}>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route>
        <Route path="/sign-in" element={<SignIn />} />
      </Route>
    </Routes>
  )
}
