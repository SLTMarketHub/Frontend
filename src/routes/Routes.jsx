import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/customer/HomePage.jsx";
import ProductCategory from "../pages/customer/ProductCategory.jsx";
import NotFound from "../pages/NotFound.jsx";
import ProductPage from "../pages/customer/ProductPage.jsx";
import CartPage from "../pages/customer/CartPage.jsx";
import CheckoutPage from "../components/customer/cart/CheckoutPage.jsx";
import Dashboard from '../pages/seller/Dashboard.jsx';
import StoreManagement from '../pages/seller/StoreManagement.jsx';
import Products from '../pages/seller/Products.jsx';
import AddProduct from '../pages/seller/AddProduct.jsx';
import EditProduct from '../pages/seller/EditProduct.jsx';
import Orders from '../pages/seller/Orders.jsx';
import OrderDetails from '../pages/seller/OrderDetails.jsx';
import Inventory from '../pages/seller/Inventory';
import Promotions from '../pages/seller/Promotions';
import Analytics from '../pages/seller/Analytics';
import Payouts from '../pages/seller/Payouts';
import Messages from '../pages/seller/Messages';
import Support from '../pages/seller/Support';
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
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/store",
    element: <StoreManagement />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/products/add",
    element: <AddProduct />,
  },
  {
    path: "/products/edit/:id",
    element: <EditProduct />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/orders/:id",
    element: <OrderDetails />,
  },
  {
    path: "/inventory",
    element: <Inventory />,
  },
  {
    path: "/promotions",
    element: <Promotions />,
  },
  {
    path: "/analytics",
    element: <Analytics />,
  },
  {
    path: "/payouts",
    element: <Payouts />,
  },
  {
    path: "/messages",
    element: <Messages />,
  },
  {
    path: "/support",
    element: <Support />,
  },
  

]);

export default router;
