import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";
import {BrowserRouter} from "react-router-dom";
import {ToastProvider} from "./context/ToastContext.jsx";
import { CartProvider } from './context/CartContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ToastProvider>
                <AuthProvider>
                    <CartProvider>
                      <App />
                    </CartProvider>
                </AuthProvider>
            </ToastProvider>
        </BrowserRouter>
    </React.StrictMode>


