import React, { useState } from 'react';
import { Bell, User, LogOut, Settings, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ sidebarOpen, toggleSidebar }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  
  const notifications = [
    { id: 1, text: 'New order received', time: '5 min ago', unread: true },
    { id: 2, text: 'Product approved', time: '1 hour ago', unread: true },
    { id: 3, text: 'New seller registration', time: '3 hours ago', unread: false },
  ];
  
  const unreadCount = notifications.filter(n => n.unread).length;
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };
  
  return (
    <header className="bg-gradient-to-r from-[#0F55A7] to-[#4DB848] h-16 fixed top-0 right-0 left-0 z-30">
      <div className={`flex items-center justify-between h-full px-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="flex items-center flex-1 max-w-2xl">
          <button
            onClick={toggleSidebar}
            className="lg:hidden mr-4 p-2 rounded-lg hover:bg-white/20 text-white"
          >
            <Menu size={20} />
          </button>
          {/* Search removed by request */}
        </div>
        
        <div className="flex items-center space-x-4 ml-6">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Bell size={20} className="text-white" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 ${
                        notification.unread ? 'border-slt-primary bg-slt-light/30' : 'border-transparent'
                      }`}
                    >
                      <p className="text-sm text-gray-900">{notification.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => { setShowNotifications(false); navigate('/admin/support'); }}
                    className="text-sm text-slt-primary hover:underline"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <User size={16} className="text-[#0F55A7]" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-white">Admin User</p>
                <p className="text-xs text-white/80">admin@slt.lk</p>
              </div>
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@slt.lk</p>
                </div>
                
                <button
                  onClick={() => navigate('/admin/settings')}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings size={16} className="mr-3" />
                  Settings
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-error hover:bg-red-50"
                >
                  <LogOut size={16} className="mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;