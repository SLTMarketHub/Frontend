import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Settings, LogOut, Menu, ChevronDown, ChevronUp, Package, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ toggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const { authUser, isAuthenticated } = useAuth();
  const [notifications] = useState([
    { id: 1, message: 'Low stock alert: Product ABC', type: 'warning' },
    { id: 2, message: '5 new orders received', type: 'info' },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser && storedUser.id) {
        setUserDetails(storedUser);
        setUser({
          ...storedUser,
          // Format the member since date
          memberSince: storedUser.createdAt 
            ? new Date(storedUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
            : 'N/A'
        });
      } else if (authUser && authUser.id) {
        setUser({
          ...authUser,
          // Format the member since date
          memberSince: authUser.createdAt 
            ? new Date(authUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
            : 'N/A'
        });
      }
    }
  }, [isAuthenticated, authUser]);

  const getFirstName = (fullName) => {
    // if (!fullName) return 'User';
    return fullName.trim().split(' ')[0];
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('/seller/profile');
    setShowUserMenu(false);
  };

  const goToProducts = () => {
    navigate('/seller/products');
    setShowUserMenu(false);
  };

  const goToOrders = () => {
    navigate('/seller/orders');
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-96 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search products, orders..."
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User size={16} />
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {/* Hi, {getFirstName(
                    userDetails?.username ||
                    authUser?.name ||
                    authUser?.username ||
                    userDetails?.name ||
                    user?.name ||
                    user?.firstName ||
                    // 'User'
                  )} */}
                   <span>
                  Hi,{" "}
                  {getFirstName(
                    userDetails?.username ||
                      authUser?.name ||
                      authUser?.username
                  )}
                </span>
                </p>
                <p className="text-xs text-gray-500">
                  {userDetails?.email || authUser?.email || user?.email || 'Seller'}
                </p>
              </div>
              {showUserMenu ? <ChevronUp size={16} className="text-gray-700" /> : <ChevronDown size={16} className="text-gray-700" />}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200">
              {/* User Info Section */}
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name || userDetails?.name || authUser?.name || 'Seller'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || userDetails?.email || authUser?.email || 'seller@example.com'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Member since {user?.memberSince || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={goToProfile}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <User size={16} className="text-gray-500" />
                  <span>My Profile</span>
                </button>
                
                <button
                  onClick={goToProducts}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <Package size={16} className="text-gray-500" />
                  <span>My Products</span>
                </button>
                
                <button
                  onClick={goToOrders}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <ShoppingBag size={16} className="text-gray-500" />
                  <span>Orders</span>
                </button>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={() => {
                    navigate('/seller/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <Settings size={16} className="text-gray-500" />
                  <span>Account Settings</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
                >
                  <LogOut size={16} className="text-red-500" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
