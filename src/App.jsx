import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route } from 'react-router-dom'
import CartPage from './pages/customer/CartPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* Cart page */}
        {/* <Route path="/cart" element={<CartPage />} /> */}
        <CartPage />
    </>
  )
}

export default App
