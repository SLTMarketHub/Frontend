import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Topbar from '../components/common/Topbar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <Topbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <main className="mt-16 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-600">
            <p>© 2025 SLT MarketHub. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-slt-primary">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-slt-primary">
                Terms of Service
              </a>
              <a href="#" className="hover:text-slt-primary">
                Help Center
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;