# SLT MarketHub - Admin Section

Production-ready admin dashboard for the SLT MarketHub e-commerce platform.

## Features

✅ **8 Complete Admin Pages**
- Dashboard - Real-time statistics and charts
- Sellers - Approve/reject seller applications
- Products - Product moderation with bulk operations
- Orders - Order management, refunds, and disputes
- Settings - Platform configuration (commission, shipping, tax)
- Support - Customer support ticket management
- Analytics - Detailed sales and revenue analytics
- Users - User and seller account management

✅ **Full Backend Integration**
- Connected to Render backend via TMF APIs
- Environment variable configuration
- Proper error handling and loading states
- Toast notifications for user feedback

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend API running on Render

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your backend URL
VITE_BASE_URL=https://markethub-api-gateway.onrender.com/tmf-api/
```

### Development

```bash
# Run development server
npm run dev

# Access admin at http://localhost:5173/admin
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file:

```
VITE_BASE_URL=https://markethub-api-gateway.onrender.com/tmf-api/
```

For production, create `.env.production` with the same variables.

## Admin Routes

- `/admin/dashboard` - Overview and statistics
- `/admin/sellers` - Seller approval management
- `/admin/products` - Product moderation
- `/admin/orders` - Order management
- `/admin/settings` - Platform settings
- `/admin/support` - Support tickets
- `/admin/analytics` - Sales analytics
- `/admin/users` - User management

## Tech Stack

- **Frontend**: React 18, Vite
- **Routing**: React Router
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend APIs**: TMF Open APIs (620, 622, 629, 668, 678, 681)

## Backend APIs Used

| API | Purpose |
|-----|---------|
| TMF620 | Product Catalog Management |
| TMF622 | Product Ordering |
| TMF629 | Customer Management |
| TMF668 | Partnership Management (Sellers) |
| TMF678 | Trouble Ticket (Refunds/Disputes) |
| TMF681 | Communication Management (Settings/Support) |

## Known Issues

### Seller Status Persistence
**Issue**: Seller approve/reject status may not persist after page refresh due to backend API limitation.  
**Workaround**: localStorage cache implemented (temporary solution).  
**Status**: Backend fix required.

See [`docs/backend_issues.md`](docs/backend_issues.md) for full details.

## Documentation

- [`docs/walkthrough.md`](docs/walkthrough.md) - Complete implementation walkthrough
- [`docs/deployment_guide.md`](docs/deployment_guide.md) - Production deployment guide
- [`docs/backend_issues.md`](docs/backend_issues.md) - Known backend issues
- [`docs/PRODUCTION_SUMMARY.md`](docs/PRODUCTION_SUMMARY.md) - Production readiness summary

## Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

See [`docs/deployment_guide.md`](docs/deployment_guide.md) for detailed instructions.

## Project Structure

```
src/
├── pages/
│   ├── admin/
│   │   ├── Dashboard.jsx
│   │   ├── Orders.jsx
│   │   ├── Settings.jsx
│   │   ├── Support.jsx
│   │   ├── Analytics.jsx
│   │   └── Users.jsx
│   ├── SellerApproval.jsx
│   └── ProductModeration.jsx
├── services/
│   ├── admin/
│   │   ├── sellers.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── dashboard.js
│   │   └── annalytics.js
│   ├── settingsService.js
│   ├── supportService.js
│   └── axiosInstance.js
├── components/
│   └── common/
├── utils/
│   └── imageUtils.js
└── App.jsx
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary and confidential.

## Support

For issues or questions, please refer to the documentation in `docs/` or contact the development team.

---

**Build Status**: ✅ Production Ready  
**Last Updated**: 2025-11-21  
**Version**: 1.0.0
