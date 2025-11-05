import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingCart,
  Archive,
  Tag,
  BarChart3,
  CreditCard,
  MessageCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Store Management', href: '/store', icon: Store },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Inventory', href: '/inventory', icon: Archive },
    { name: 'Promotions', href: '/promotions', icon: Tag },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Payouts', href: '/payouts', icon: CreditCard },
    { name: 'Messages', href: '/messages', icon: MessageCircle },
    { name: 'Support', href: '/support', icon: HelpCircle },
  ];

  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-16'
      } bg-white shadow-lg transition-all duration-300 ease-in-out border-r border-gray-200`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {isOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">MarketHub</span>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || 
              (item.href === '/products' && location.pathname.startsWith('/products'));
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200`}
              >
                <Icon
                  className={`${
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  } mr-3 h-5 w-5 transition-colors`}
                />
                {isOpen && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

