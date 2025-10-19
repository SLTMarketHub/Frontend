import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/customer/HomePage.jsx";
import ProductCategory from "../pages/customer/ProductCategory.jsx";
import NotFound from "../pages/NotFound.jsx";
import ProductPage from "../pages/customer/ProductPage.jsx";
import CartPage from "../pages/customer/CartPage.jsx";
import CheckoutPage from "../components/customer/cart/CheckoutPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/category/:categoryId",
    element: <ProductCategory />,
  },
  {
    path: "/product/:id",
    element: <ProductPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  }

]);

export default router;
