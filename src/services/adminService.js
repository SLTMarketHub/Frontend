// src/services/adminService.js

// Mock data - in a real app, this would come from a backend API
const mockStatsBase = {
  totalUsers: 1250,
  totalSellers: 350,
  totalOrders: 5800,
  totalRevenue: 75320,
};

let mockRecentActivities = [
  { id: 1, user: 'John Doe', action: 'registered as a new customer.', time: '2 mins ago' },
  { id: 2, user: 'Seller Inc.', action: 'added a new product: Wireless Headphones.', time: '15 mins ago' },
  { id: 3, user: 'Admin', action: 'approved a new seller: Tech Gadgets.', time: '1 hour ago' },
  { id: 4, user: 'Jane Smith', action: 'placed an order #12345.', time: '3 hours ago' },
];

let mockSystemAlerts = [
  { id: 1, message: 'Server CPU usage is high (92%).', level: 'critical', resolved: false },
  { id: 2, message: 'New seller registration pending approval.', level: 'warning', resolved: false },
  { id: 3, message: 'Database backup completed successfully.', level: 'info', resolved: false },
];

let mockUsers = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Customer', status: 'Active', joined: '2023-01-15', permissions: ['viewOrders'], phone: '+1 555-0100', address: '101 Main St, Springfield' },
  { id: 2, name: 'Seller Inc.', email: 'contact@sellerinc.com', role: 'Seller', status: 'Active', joined: '2023-02-20', permissions: ['manageProducts', 'viewOrders'], phone: '+1 555-0200', address: '22 Industrial Ave' },
  { id: 3, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Customer', status: 'Suspended', joined: '2023-03-10', permissions: ['viewOrders'], phone: '+1 555-0300', address: '33 River Rd' },
  { id: 4, name: 'Admin User', email: 'admin@markethub.com', role: 'Admin', status: 'Active', joined: '2023-01-01', permissions: ['manageUsers', 'manageSellers', 'manageProducts', 'viewReports'], phone: '+1 555-0400', address: 'HQ Blvd' },
  { id: 5, name: 'Tech Gadgets', email: 'support@techgadgets.com', role: 'Seller', status: 'Pending', joined: '2023-04-05', permissions: ['manageProducts'], phone: '+1 555-0500', address: '44 Tech Park' },
  { id: 6, name: 'Another Customer', email: 'customer@example.com', role: 'Customer', status: 'Active', joined: '2023-05-12', permissions: ['viewOrders'], phone: '+1 555-0600', address: '55 Lake St' },
  { id: 7, name: 'Gadget World', email: 'gw@example.com', role: 'Seller', status: 'Active', joined: '2023-06-18', permissions: ['manageProducts', 'viewOrders'], phone: '+1 555-0700', address: '66 Commerce St' },
];

// Simulate API calls with a delay
const simulateApiCall = (data, delay = 500) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Generate mock time-series for revenue and orders vs cancellations
function generateTimeSeries(range = 'month') {
  const labels = range === 'day'
    ? Array.from({ length: 24 }, (_, i) => `${i}:00`)
    : range === 'week'
    ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
    : range === 'year'
    ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    : ['Week 1','Week 2','Week 3','Week 4'];
  const rand = () => Math.floor(12000 + Math.random() * 25000);
  const revenue = labels.map(() => rand());
  const orders = labels.map(() => Math.floor(200 + Math.random() * 600));
  const cancels = orders.map(v => Math.floor(v * (0.05 + Math.random() * 0.1)));
  return { labels, revenue, orders, cancels };
}

export const getDashboardData = async ({ range = 'month', startDate, endDate } = {}) => {
  // Normally would query backend with filters; here we mock by varying series
  const series = generateTimeSeries(range);
  const prevSeries = generateTimeSeries(range);

  const stats = { ...mockStatsBase };
  const prevStats = { ...mockStatsBase };
  // Slight variance to simulate growth deltas
  stats.totalRevenue = series.revenue.reduce((a,b)=>a+b,0);
  prevStats.totalRevenue = prevSeries.revenue.reduce((a,b)=>a+b,0);
  stats.totalOrders = series.orders.reduce((a,b)=>a+b,0);
  prevStats.totalOrders = prevSeries.orders.reduce((a,b)=>a+b,0);

  // distribution
  const customers = mockUsers.filter(u => u.role === 'Customer').length;
  const sellers = mockUsers.filter(u => u.role === 'Seller').length;

  const [activities, alerts] = await Promise.all([
    simulateApiCall(mockRecentActivities),
    simulateApiCall(mockSystemAlerts),
  ]);

  return simulateApiCall({
    stats,
    prevStats,
    series, // {labels,revenue,orders,cancels}
    distribution: { customers, sellers },
    activities,
    alerts,
    range,
    startDate,
    endDate,
  });
};

export const resolveAlert = async (id) => {
  mockSystemAlerts = mockSystemAlerts.map(a => a.id === id ? { ...a, resolved: true } : a);
  return simulateApiCall({ success: true });
};

export const dismissAlert = async (id) => {
  mockSystemAlerts = mockSystemAlerts.filter(a => a.id !== id);
  return simulateApiCall({ success: true });
};

// Admin notes stored locally to simulate persistence
export const getAdminNotes = async () => {
  const v = typeof localStorage !== 'undefined' ? localStorage.getItem('admin_notes') : '';
  return simulateApiCall(v || '');
};
export const saveAdminNotes = async (text) => {
  if (typeof localStorage !== 'undefined') localStorage.setItem('admin_notes', text);
  return simulateApiCall({ success: true });
};

export const getUsers = async ({ page = 1, limit = 5, query = '', role = 'All', status = 'All', sortBy = 'name-asc' } = {}) => {
  let filtered = [...mockUsers];

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }
  if (role && role !== 'All') {
    filtered = filtered.filter(u => u.role === role);
  }
  if (status && status !== 'All') {
    filtered = filtered.filter(u => u.status === status);
  }

  // sorting
  const [key, dir] = sortBy.split('-');
  filtered.sort((a, b) => {
    let va = a[key];
    let vb = b[key];
    if (key === 'joined') { va = new Date(va); vb = new Date(vb); }
    return (va > vb ? 1 : va < vb ? -1 : 0) * (dir === 'desc' ? -1 : 1);
  });

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedUsers = filtered.slice(start, end);

  return simulateApiCall({
    users: paginatedUsers,
    total: filtered.length,
    totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
  });
};

export const getUserById = async (id) => {
  const user = mockUsers.find(u => u.id === id) || null;
  return simulateApiCall(user);
};

export const updateUserRole = async (id, newRole) => {
  mockUsers = mockUsers.map(u => (u.id === id ? { ...u, role: newRole } : u));
  return simulateApiCall({ success: true });
};

export const updateUserStatus = async (id, newStatus) => {
  mockUsers = mockUsers.map(u => (u.id === id ? { ...u, status: newStatus } : u));
  return simulateApiCall({ success: true });
};

export const updateUserPermissions = async (id, newPermissions = []) => {
  mockUsers = mockUsers.map(u => (u.id === id ? { ...u, permissions: [...newPermissions] } : u));
  return simulateApiCall({ success: true });
};

export const updateUserProfile = async (id, profile = {}) => {
  mockUsers = mockUsers.map(u => (u.id === id ? { ...u, ...profile } : u));
  return simulateApiCall({ success: true });
};

export const addUser = async ({ name, email, role = 'Customer', status = 'Active', phone = '', address = '', permissions = [] }) => {
  const nextId = Math.max(...mockUsers.map(u => u.id)) + 1;
  const newUser = {
    id: nextId,
    name,
    email,
    role,
    status,
    phone,
    address,
    permissions,
    joined: new Date().toISOString().slice(0, 10),
  };
  mockUsers = [newUser, ...mockUsers];
  return simulateApiCall(newUser);
};
