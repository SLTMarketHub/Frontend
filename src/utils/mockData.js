// Mock data for development - Replace with real API calls in production

// ============ ANALYTICS DATA ============
export const mockOverviewStats = {
  totalRevenue: 2847650.50,
  totalOrders: 1243,
  averageOrderValue: 2291.45,
  growthRate: 12.5,
  totalCustomers: 856,
  totalProducts: 432,
  conversionRate: 3.8,
};

export const mockSalesChartData = [
  { date: 'Jan 1', revenue: 45000, orders: 52 },
  { date: 'Jan 8', revenue: 52000, orders: 61 },
  { date: 'Jan 15', revenue: 48000, orders: 55 },
  { date: 'Jan 29', revenue: 55000, orders: 64 },
  { date: 'Feb 5', revenue: 67000, orders: 78 },
  { date: 'Feb 12', revenue: 71000, orders: 83 },
  { date: 'Feb 19', revenue: 64000, orders: 75 },
  { date: 'Feb 26', revenue: 78000, orders: 91 },
  { date: 'Mar 5', revenue: 82000, orders: 96 },
  { date: 'Mar 12', revenue: 89000, orders: 104 },
  { date: 'Mar 19', revenue: 95000, orders: 111 },
];

// Top products used by Analytics page
export const mockTopProducts = [
  { id: 1, name: 'Samsung Galaxy S24 Ultra', category: 'Electronics', sales: 342, revenue: 68400000, stock: 45, image: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Apple iPhone 15 Pro', category: 'Electronics', sales: 298, revenue: 59600000, stock: 32, image: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', sales: 267, revenue: 13350000, stock: 78, image: 'https://via.placeholder.com/50' },
  { id: 4, name: 'Dell XPS 15 Laptop', category: 'Computers', sales: 189, revenue: 56700000, stock: 23, image: 'https://via.placeholder.com/50' },
  { id: 5, name: 'Nike Air Max 270', category: 'Fashion', sales: 423, revenue: 21150000, stock: 156, image: 'https://via.placeholder.com/50' },
  { id: 6, name: "Levi's 501 Original Jeans", category: 'Fashion', sales: 387, revenue: 9675000, stock: 234, image: 'https://via.placeholder.com/50' },
  { id: 7, name: 'KitchenAid Stand Mixer', category: 'Home & Kitchen', sales: 156, revenue: 15600000, stock: 67, image: 'https://via.placeholder.com/50' },
  { id: 8, name: 'Dyson V15 Vacuum Cleaner', category: 'Home & Kitchen', sales: 134, revenue: 13400000, stock: 45, image: 'https://via.placeholder.com/50' },
  { id: 9, name: 'PlayStation 5', category: 'Gaming', sales: 276, revenue: 55200000, stock: 89, image: 'https://via.placeholder.com/50' },
  { id: 10, name: 'Xbox Series X', category: 'Gaming', sales: 245, revenue: 49000000, stock: 102, image: 'https://via.placeholder.com/50' },
];

export const mockTopCategories = [
  { id: 1, name: 'Electronics', sales: 907, revenue: 141350000, percentage: 35.2 },
  { id: 2, name: 'Fashion', sales: 810, revenue: 30825000, percentage: 24.8 },
  { id: 3, name: 'Gaming', sales: 521, revenue: 104200000, percentage: 19.5 },
  { id: 4, name: 'Home & Kitchen', sales: 290, revenue: 29000000, percentage: 12.3 },
  { id: 5, name: 'Books', sales: 187, revenue: 3740000, percentage: 8.2 },
];

export const mockRevenueByCategory = [
  { name: 'Electronics', value: 141350000 },
  { name: 'Fashion', value: 30825000 },
  { name: 'Gaming', value: 104200000 },
  { name: 'Home & Kitchen', value: 29000000 },
  { name: 'Books', value: 3740000 },
];

// Orders mock used by services fallback
export const mockOrders = [
  { id: 'ORD001', customerId: 'CUST-001', customer: 'Kamal Perera', sellerId: 'SELL-001', seller: 'Tech Store', status: 'pending', state: 'pending', date: '2025-03-17', orderDate: '2025-03-17T10:00:00Z', amount: 95000, total: 95000, paymentStatus: 'unpaid' },
  { id: 'ORD002', customerId: 'CUST-002', customer: 'Nimal Silva', sellerId: 'SELL-002', seller: 'Fashion Hub', status: 'delivered', state: 'delivered', date: '2025-03-16', orderDate: '2025-03-16T15:30:00Z', amount: 45000, total: 45000, paymentStatus: 'paid' },
  { id: 'ORD003', customerId: 'CUST-003', customer: 'Priya Fernando', sellerId: 'SELL-003', seller: 'Electronics Pro', status: 'disputed', state: 'disputed', date: '2025-03-15', orderDate: '2025-03-15T08:45:00Z', amount: 32000, total: 32000, paymentStatus: 'paid' },
  { id: 'ORD004', customerId: 'CUST-004', customer: 'Malini Fernando', sellerId: 'SELL-004', seller: 'Home Goods', status: 'shipped', state: 'shipped', date: '2025-03-18', orderDate: '2025-03-18T12:10:00Z', amount: 78000, total: 78000, paymentStatus: 'paid' },
  { id: 'ORD005', customerId: 'CUST-005', customer: 'Anura Dissanayake', sellerId: 'SELL-005', seller: 'Books & More', status: 'refunded', state: 'refunded', date: '2025-03-14', orderDate: '2025-03-14T09:20:00Z', amount: 12000, total: 12000, paymentStatus: 'refunded' },
  { id: 'ORD006', customerId: 'CUST-006', customer: 'Sajith Perera', sellerId: 'SELL-006', seller: 'Gadget World', status: 'confirmed', state: 'confirmed', date: '2025-03-19', orderDate: '2025-03-19T18:05:00Z', amount: 155000, total: 155000, paymentStatus: 'paid' }
];

// Customers mock used by customer service fallback
export const mockCustomers = [
  { id: 'CUST-001', name: 'Kamal Perera', email: 'kamal.p@email.com', status: 'active', role: 'customer' },
  { id: 'CUST-002', name: 'Nimal Silva', email: 'nimal.s@email.com', status: 'active', role: 'customer' },
  { id: 'CUST-003', name: 'Priya Fernando', email: 'priya.f@email.com', status: 'suspended', role: 'customer' },
  { id: 'CUST-004', name: 'Tech Store LK', email: 'owner@techstore.lk', status: 'active', role: 'seller' },
  { id: 'CUST-005', name: 'Fashion Hub', email: 'admin@fashionhub.lk', status: 'active', role: 'seller' },
];

// ============ SETTINGS DATA ============
export const mockCommissionRates = {
  defaultRate: 10,
  categoryRates: [
    { category: 'Electronics', rate: 8 },
    { category: 'Fashion', rate: 12 },
    { category: 'Home & Kitchen', rate: 10 },
    { category: 'Books', rate: 15 },
    { category: 'Gaming', rate: 8 },
  ],
  minimumCommission: 50,
  paymentCycle: 'weekly',
};

export const mockShippingRules = {
  freeShippingThreshold: 5000,
  standardShippingFee: 300,
  expressShippingFee: 600,
  zones: [
    { name: 'Colombo', fee: 250, expressAvailable: true },
    { name: 'Western Province', fee: 300, expressAvailable: true },
    { name: 'Southern Province', fee: 400, expressAvailable: false },
    { name: 'Northern Province', fee: 500, expressAvailable: false },
  ],
  weightBasedCharges: true,
  maxWeight: 30,
  perKgCharge: 50,
};

export const mockTaxRules = {
  vatEnabled: true,
  vatRate: 15,
  taxExemptCategories: ['Books', 'Educational Materials'],
  includeInPrice: true,
  invoiceFooterText: 'All prices are inclusive of VAT where applicable',
};

export const mockBanners = [
  {
    id: 1,
    title: 'Summer Sale 2025',
    description: 'Up to 50% off on selected items',
    imageUrl: 'https://via.placeholder.com/1200x400/00A651/FFFFFF?text=Summer+Sale',
    linkUrl: '/shop/summer-sale',
    status: 'active',
    position: 'home-hero',
    startDate: '2025-03-01',
    endDate: '2025-03-31',
    priority: 1,
  },
  {
    id: 2,
    title: 'New Electronics',
    description: 'Latest gadgets',
    imageUrl: 'https://via.placeholder.com/1200x400/0066CC/FFFFFF?text=Electronics',
    linkUrl: '/category/electronics',
    status: 'active',
    position: 'home-secondary',
    startDate: '2025-03-01',
    endDate: '2025-04-30',
    priority: 2,
  },
];

export const mockEmailTemplates = [
  {
    id: 1,
    name: 'Welcome Email',
    subject: 'Welcome to SLT MarketHub!',
    type: 'customer_welcome',
    variables: ['{{customer_name}}', '{{platform_name}}', '{{login_url}}'],
    body: `Dear {{customer_name}},

Welcome to {{platform_name}}! We're excited to have you join our community.

Your account has been successfully created. You can now browse thousands of products from trusted sellers.

Login to your account: {{login_url}}

Happy Shopping!
The SLT MarketHub Team`,
    isActive: true,
  },
  {
    id: 2,
    name: 'Order Confirmation',
    subject: 'Order Confirmed - {{order_id}}',
    type: 'order_confirmation',
    variables: ['{{customer_name}}', '{{order_id}}', '{{order_total}}', '{{tracking_url}}'],
    body: `Hi {{customer_name}},

Thank you for your order!

Order ID: {{order_id}}
Total Amount: {{order_total}}

Your order has been confirmed and will be processed shortly. Track your order: {{tracking_url}}

Best regards,
SLT MarketHub`,
    isActive: true,
  },
];

// ============ SUPPORT DATA ============
export const mockTicketStats = {
  open: 24,
  inProgress: 15,
  resolved: 142,
  closed: 398,
  avgResponseTime: '2.3 hours',
  avgResolutionTime: '18.5 hours',
};

export const mockTickets = [
  {
    id: 'T001',
    subject: 'Product not delivered after 2 weeks',
    category: 'Delivery Issue',
    status: 'open',
    priority: 'high',
    customerName: 'Kamal Perera',
    customerEmail: 'kamal.p@email.com',
    customerType: 'customer',
    assignedTo: null,
    createdAt: '2025-03-18T10:30:00Z',
    updatedAt: '2025-03-18T10:30:00Z',
    description: 'I ordered a laptop 2 weeks ago and still haven\'t received it. The tracking shows it\'s stuck at the warehouse.',
    orderNumber: '#ORD-2025-0234',
  },
  {
    id: 'T002',
    subject: 'Wrong item received',
    category: 'Order Issue',
    status: 'in_progress',
    priority: 'medium',
    customerName: 'Nimal Silva',
    customerEmail: 'nimal.s@email.com',
    customerType: 'customer',
    assignedTo: 'Admin User',
    createdAt: '2025-03-17T14:20:00Z',
    updatedAt: '2025-03-18T09:15:00Z',
    description: 'I ordered a blue t-shirt size L but received a red one size M.',
    orderNumber: '#ORD-2025-0189',
  },
  {
    id: 'T003',
    subject: 'Cannot update product listing',
    category: 'Technical Issue',
    status: 'open',
    priority: 'low',
    customerName: 'Tech Store LK',
    customerEmail: 'support@techstore.lk',
    customerType: 'seller',
    assignedTo: null,
    createdAt: '2025-03-17T11:45:00Z',
    updatedAt: '2025-03-17T11:45:00Z',
    description: 'When I try to update my product images, I get an error message.',
    orderNumber: null,
  },
];

export const mockTicketMessages = {
  'T002': [
    {
      id: 1,
      sender: 'Nimal Silva',
      senderType: 'customer',
      message: 'I ordered a blue t-shirt size L but received a red one size M. Please arrange for exchange.',
      timestamp: '2025-03-17T14:20:00Z',
      isInternal: false,
    },
    {
      id: 2,
      sender: 'Admin User',
      senderType: 'admin',
      message: 'Thank you for contacting us. Can you please provide photos of the item?',
      timestamp: '2025-03-17T15:30:00Z',
      isInternal: false,
    },
    {
      id: 3,
      sender: 'Admin User',
      senderType: 'admin',
      message: 'Internal Note: Contacted seller. They confirmed stock mix-up. Arranging replacement.',
      timestamp: '2025-03-17T16:00:00Z',
      isInternal: true,
    },
  ],
};

export const mockAdminUsers = [
  { id: 1, name: 'Admin User', email: 'admin@slt.lk' },
  { id: 2, name: 'Tech Support', email: 'tech@slt.lk' },
  { id: 3, name: 'Customer Care', email: 'care@slt.lk' },
];