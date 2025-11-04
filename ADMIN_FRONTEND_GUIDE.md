# SLT MarketHub - Admin Frontend Documentation

## 📋 Overview

The admin frontend is a complete, production-ready interface for managing the SLT MarketHub platform. It features a consistent design system, reusable components, and comprehensive functionality for all administrative tasks.

## 🎨 Design System

### Color Palette
- **Primary**: `#00A651` (SLT Green)
- **Secondary**: `#0066CC` (SLT Blue)
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`
- **Info**: `#3B82F6`

### Typography
- **Font Family**: Inter (sans-serif), Poppins (display)
- **Headings**: Uses `font-display` class
- **Body**: Uses Inter with antialiasing

### Shared Components

All admin pages use these consistent, reusable components:

1. **Card Component** (`/src/components/common/Card.jsx`)
   - Standard card layout with header, body, and footer
   - `StatsCard` variant for dashboard metrics
   - Hover effects and shadows

2. **Button Component** (`/src/components/common/Button.jsx`)
   - Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`, `success`, `warning`
   - Sizes: `sm`, `md`, `lg`
   - Loading states and icon support

3. **DataTable Component** (`/src/components/common/DataTable.jsx`)
   - Sortable columns
   - Pagination (configurable page size)
   - Search functionality
   - Row actions
   - Empty states

4. **Modal Component** (`/src/components/common/Modal.jsx`)
   - Standard modal for detailed views
   - `ConfirmModal` for confirmations
   - Sizes: `sm`, `md`, `lg`, `xl`, `full`
   - Escape key and overlay close support

5. **LoadingSpinner Component** (`/src/components/common/LoadingSpinner.jsx`)
   - `LoadingSpinner` - Flexible spinner
   - `SkeletonCard` - Card skeleton loader
   - `SkeletonTable` - Table skeleton loader
   - `LoadingState` - Wrapper component

## 📁 Admin Pages

### 1. Dashboard (`/admin/dashboard`)
**File**: `/src/pages/admin/Dashboard.jsx`

**Features**:
- Overview statistics (Revenue, Orders, Customers, Products)
- Recent orders table
- Real-time activity feed
- Low stock alerts
- Key performance metrics

**Components Used**: `StatsCard`, `Card`, `DataTable`

---

### 2. Analytics (`/admin/analytics`)
**File**: `/src/pages/admin/Analytics.jsx`

**Features**:
- Revenue and order metrics
- Sales trend charts (Line charts)
- Revenue by category (Pie chart)
- Top selling categories (Bar chart)
- Top selling products table
- Export to CSV/PDF

**Components Used**: `StatsCard`, `Card`, `DataTable`, `Button`
**Charts**: Recharts library

---

### 3. User Management (`/admin/users`)
**File**: `/src/pages/admin/Users.jsx`

**Features**:
- List all customers and sellers
- Filter by role and status
- View user details (modal)
- Suspend/activate accounts
- Search and pagination
- User statistics

**Components Used**: `StatsCard`, `Card`, `DataTable`, `Modal`, `Button`

---

### 4. Seller Approval (`/admin/sellers`)
**File**: `/src/pages/SellerApproval.jsx`

**Features**:
- Review pending seller registrations
- Approve/reject sellers
- View seller details and store information
- Filter by approval status
- Statistics (pending, approved, rejected)

**Components Used**: `StatsCard`, `DataTable`, `Modal`, `Button`

---

### 5. Product Moderation (`/admin/products`)
**File**: `/src/pages/ProductModeration.jsx`

**Features**:
- Review and approve product listings
- View product details with images
- Approve/reject products
- Filter by status
- Statistics (pending, approved, rejected)

**Components Used**: `StatsCard`, `DataTable`, `Modal`, `Button`

---

### 6. Order Oversight (`/admin/orders`)
**File**: `/src/pages/admin/Orders.jsx`

**Features**:
- View all platform orders
- Filter by order status
- View order details
- Resolve disputes/refunds
- Order statistics

**Components Used**: `StatsCard`, `Card`, `DataTable`, `Modal`, `Button`

---

### 7. Settings (`/admin/settings`)
**File**: `/src/pages/admin/Settings.jsx`

**Features**:
- **Commission Rates**: Configure platform commissions
- **Shipping Rules**: Set shipping fees and zones
- **Tax Settings**: Configure VAT and tax rules
- **Banners**: Manage promotional banners
- **Email Templates**: Edit notification templates

**Components Used**: `Card`, `Button`, `Modal`, Custom form modals

---

### 8. Support (`/admin/support`)
**File**: `/src/pages/admin/Support.jsx`

**Features**:
- View all support tickets
- Filter by status and priority
- Assign tickets to admins
- Reply to customers
- Add internal notes
- Ticket statistics

**Components Used**: `StatsCard`, `Card`, `DataTable`, `Modal`, `Button`

---

## 🗺️ Routing Structure

```javascript
/                          → Redirects to /admin/dashboard
/admin                     → Admin layout wrapper
  /admin/dashboard         → Dashboard overview
  /admin/analytics         → Analytics & reports
  /admin/users             → User management
  /admin/sellers           → Seller approval
  /admin/products          → Product moderation
  /admin/orders            → Order oversight
  /admin/settings          → Platform settings
  /admin/support           → Support tickets
```

## 🎯 Layout Components

### AdminLayout (`/src/layouts/AdminLayout.jsx`)
- **Sidebar**: Collapsible navigation menu
- **TopBar**: Search, notifications, user profile
- **Main Content Area**: Responsive container for pages
- **Footer**: Copyright and links

### Sidebar (`/src/components/common/SideBar.jsx`)
- Collapsible (264px expanded, 80px collapsed)
- Active route highlighting
- Mobile responsive with overlay
- Smooth transitions

### TopBar (`/src/components/common/TopBar.jsx`)
- Global search
- Notification bell with dropdown
- User profile with dropdown menu
- Responsive layout

## 🛠️ Utilities

### Formatters (`/src/utils/formatters.js`)
- `formatCurrency(amount, currency)` - Format currency values
- `formatDate(date, format)` - Format dates (short, long, time, relative)
- `getRelativeTime(date)` - Convert to "5 mins ago" format
- `formatNumber(num)` - Format with K/M/B suffixes
- `formatPercentage(value, decimals)` - Format percentages
- `getStatusColor(status)` - Get Tailwind color classes for statuses
- `capitalize(str)` - Capitalize strings

### Export Utils (`/src/utils/exportUtils.js`)
- `exportToCSV(data, filename)` - Export data to CSV
- `exportToPDF(data, filename, options)` - Export to PDF
- `exportSalesReportPDF(data, period)` - Generate sales reports

### Mock Data (`/src/utils/mockData.js`)
- Contains all mock data for development
- Replace with real API calls in production

### Constants (`/src/utils/constants.js`)
- Chart colors
- Time periods
- Status definitions

## 📱 Responsive Design

All pages are fully responsive with breakpoints:
- **Mobile**: < 768px (sm)
- **Tablet**: 768px - 1024px (md)
- **Desktop**: 1024px - 1280px (lg)
- **Large Desktop**: > 1280px (xl)

### Mobile Optimizations
- Collapsible sidebar with overlay
- Stacked stat cards
- Horizontal scroll for tables
- Touch-friendly buttons
- Responsive modals

## 🎨 Styling Guidelines

### Spacing
- Use Tailwind spacing utilities (`p-4`, `mt-6`, etc.)
- Consistent spacing: `space-y-6` for vertical stacks
- Card padding: `p-6`

### Colors
- Use semantic color names: `text-slt-primary`, `bg-success`
- Status badges use `getStatusColor()` utility
- Hover states: `hover:bg-gray-100`

### Typography
- Page titles: `text-2xl font-bold text-gray-900`
- Subtitles: `text-gray-600 mt-1`
- Section headings: `text-lg font-semibold`
- Body text: `text-sm` or `text-base`

### Buttons
- Always use the `Button` component
- Specify variant and size explicitly
- Add icons for better UX

### Tables
- Always use `DataTable` component
- Enable search and pagination for large datasets
- Provide meaningful `emptyMessage`

## 🔌 API Integration

Currently using mock data. To integrate with backend:

1. **Create API Service** (`/src/services/adminService.js`)
```javascript
import api from './api';

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  // ... more endpoints
};
```

2. **Replace Mock Data in Pages**
```javascript
// Before
import { mockUsers } from '../utils/mockData';

// After
import { adminService } from '../services/adminService';

const fetchUsers = async () => {
  const response = await adminService.getUsers();
  setUsers(response.data);
};
```

3. **Add Error Handling**
```javascript
try {
  const data = await adminService.getUsers();
  setUsers(data);
} catch (error) {
  console.error('Error:', error);
  // Show error toast/notification
}
```

## 🚀 Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Dependencies

- **React** 18.x - UI framework
- **React Router** 6.x - Routing
- **Tailwind CSS** 3.x - Styling
- **Lucide React** - Icons
- **Recharts** - Charts and graphs
- **Vite** - Build tool

## ✅ Features Checklist

### Implemented ✓
- [x] Complete responsive admin layout
- [x] Dashboard with overview stats
- [x] Analytics with charts and reports
- [x] User management (customers & sellers)
- [x] Seller approval workflow
- [x] Product moderation
- [x] Order oversight and dispute resolution
- [x] Platform settings (commissions, shipping, tax, banners, email)
- [x] Support ticket system
- [x] Consistent UI components
- [x] Search and filtering
- [x] Pagination
- [x] Export functionality (CSV/PDF)
- [x] Modal dialogs
- [x] Loading states
- [x] Empty states
- [x] Status badges
- [x] Responsive design

### Future Enhancements
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced filtering and saved filters
- [ ] Bulk actions (approve/reject multiple items)
- [ ] Dark mode toggle
- [ ] Custom date range picker
- [ ] Advanced analytics (custom date ranges, comparisons)
- [ ] User activity logs
- [ ] Permission-based access control
- [ ] Multi-language support (i18n)

## 🎯 Best Practices

1. **Always use shared components** - Don't create custom tables or cards
2. **Follow naming conventions** - PascalCase for components, camelCase for functions
3. **Keep components focused** - Single responsibility principle
4. **Use consistent spacing** - Follow existing patterns
5. **Add loading states** - Use LoadingState wrapper
6. **Provide feedback** - Show success/error messages for actions
7. **Mobile-first** - Test on mobile devices
8. **Accessibility** - Use semantic HTML, proper ARIA labels
9. **Performance** - Lazy load images, paginate large lists
10. **Code reusability** - Extract common patterns into utilities

## 📝 Notes

- All pages use mock data for development
- Replace mock data with real API calls before production
- Colors and branding follow SLT brand guidelines
- The design system is consistent across all pages
- All components are documented with props and usage examples

## 🤝 Contributing

When adding new admin features:
1. Use existing shared components
2. Follow the established design patterns
3. Add to this documentation
4. Test on mobile and desktop
5. Ensure consistent spacing and typography

---

**Last Updated**: March 2025  
**Version**: 1.0.0  
**Maintained by**: SLT MarketHub Team
