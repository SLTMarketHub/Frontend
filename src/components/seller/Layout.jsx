import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { SellerProvider } from '../../context/SellerContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SellerProvider>
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
    </SellerProvider>
  );
};

export default Layout;

