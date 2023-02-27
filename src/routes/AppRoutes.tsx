import { Route, Routes } from 'react-router-dom'

import { DefaultLayout } from '../pages/_layouts'
import { SignIn } from '../pages/Auth/SignIn'
import { Clients } from '../pages/Clients'
import { Equipment } from '../pages/Equipment'
import { Home } from '../pages/Home'
import { Procedure } from '../pages/Procedure'
import { Profile } from '../pages/Profile'
import { Protected } from './Protected'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Protected isProtected />}>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/clients" element={<Clients />} />

          <Route path="/procedure" element={<Procedure />} />
          <Route path="/equipment" element={<Equipment />} />

          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<Protected isProtected={false} />}>
        <Route path="/sign-in" element={<SignIn />} />
      </Route>
    </Routes>
  )
}
