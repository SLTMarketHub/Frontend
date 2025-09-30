
import { RouterProvider } from "react-router-dom";
import './App.css'
import router from "./routes/Routes";
import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route } from 'react-router-dom'
import CartPage from './pages/customer/CartPage'

function App() {

  return (
    <div className="bg-gray-100S">
      <RouterProvider router={router} />
    </div>
    <>
      {/* Cart page */}
        {/* <Route path="/cart" element={<CartPage />} /> */}
        <CartPage />
    </>
  )
}

export default App
