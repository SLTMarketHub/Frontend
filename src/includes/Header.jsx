import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation(); // to highlight active link

  const links = [
    { to: "/", label: "Seller Approval" },
    { to: "/performance", label: "Performance Metrics" },
    { to: "/commissions", label: "Commissions" },
    { to: "/product-moderation", label: "Product Moderation" },
    { to: "/bulk-edit", label: "Bulk Edit Products" },
    { to: "/orders", label: "Order Oversight" },
  ];

  return (
    <header className="bg-blue-700 shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">Admin Portal</h1>
      <nav className="space-x-4">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-white px-3 py-1 rounded hover:bg-green-500 transition ${
              location.pathname === link.to ? "bg-green-500" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
