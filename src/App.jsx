import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/Users';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-gray-800 text-white flex flex-col">
          <div className="p-4 text-2xl font-bold border-b border-gray-700">MARKETHUB</div>
          <nav className="flex-1 p-4 space-y-2">
            <Link to="/admin/dashboard" className="block px-4 py-2 rounded-md hover:bg-gray-700">Dashboard</Link>
            <Link to="/admin/users" className="block px-4 py-2 rounded-md hover:bg-gray-700">User Management</Link>
            {/* Add more admin links here */}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            {/* Define other routes for your application here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

