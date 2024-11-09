import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

function Layout({ onLogout, cartItemsCount }) {
  return (
    <div>
      <Navbar onLogout={onLogout} cartItemsCount={cartItemsCount} />
      <Outlet />
    </div>
  )
}

export default Layout 