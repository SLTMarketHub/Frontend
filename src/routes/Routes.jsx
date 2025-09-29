import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/customer/HomePage.jsx";
import ProductCategory from "../pages/customer/ProductCategory.jsx";
import NotFound from "../pages/NotFound.jsx";
import ProductPage from "../pages/customer/ProductPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/category/:categoryName",
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
]);

export default router;
