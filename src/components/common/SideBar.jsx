import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  HeadphonesIcon,
  Users,
  UserCheck,
  Package,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/admin/dashboard',
    },
    {
      title: 'Analytics',
      icon: <BarChart3 size={20} />,
      path: '/admin/analytics',
    },
    {
      title: 'Users',
      icon: <Users size={20} />,
      path: '/admin/users',
    },
    {
      title: 'Sellers',
      icon: <UserCheck size={20} />,
      path: '/admin/sellers',
    },
    {
      title: 'Products',
      icon: <Package size={20} />,
      path: '/admin/products',
    },
    {
      title: 'Orders',
      icon: <ShoppingCart size={20} />,
      path: '/admin/orders',
    },
    {
      title: 'Settings',
      icon: <Settings size={20} />,
      path: '/admin/settings',
    },
    {
      title: 'Support',
      icon: <HeadphonesIcon size={20} />,
      path: '/admin/support',
    },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <>
      <aside
        className={`
          fixed left-0 top-0 z-40 h-screen transition-all duration-300 bg-gradient-to-b from-[#0F55A7] to-[#4DB848] shadow-sidebar
          ${isOpen ? 'w-64' : 'w-20'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/20">
          {isOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#0F55A7] font-bold text-sm">SLT</span>
              </div>
              <span className="text-lg font-bold text-white">MarketHub</span>
            </div>
          )}
          {!isOpen && (
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mx-auto">
              <span className="text-[#0F55A7] font-bold text-sm">SLT</span>
            </div>
          )}
        </div>
        
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 bg-white border-2 border-gray-200 rounded-full p-1 hover:bg-gray-50 transition-colors"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
        
        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-3 py-3 rounded-lg transition-all duration-200
                    ${isActive(item.path)
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }
                    ${!isOpen && 'justify-center'}
                  `}
                  title={!isOpen ? item.title : ''}
                >
                  <span className={`${isOpen ? 'mr-3' : ''}`}>
                    {item.icon}
                  </span>
                  {isOpen && <span>{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {isOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
            <div className="text-xs text-white/70 text-center">
              © 2025 SLT MarketHub
            </div>
          </div>
        )}
      </aside>
      
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;