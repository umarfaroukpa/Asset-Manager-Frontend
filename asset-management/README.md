# AssetManager - Enterprise Asset Management System

A comprehensive React-based asset management platform with subscription billing, role-based access control, and advanced analytics.

## 🚀 Features

### Core Asset Management
- **Asset Tracking**: Complete lifecycle management with QR code scanning
- **Real-time Dashboard**: Analytics, usage statistics, and key performance indicators
- **Role-based Access**: Admin, Manager, and Employee permission levels
- **Mobile Support**: QR scanner and responsive design for field operations

### Subscription & Billing
- **Flexible Plans**: Starter ($9/mo), Professional ($29/mo), Enterprise ($99/mo)
- **Usage-based Pricing**: Dynamic pricing based on assets and users
- **14-day Free Trial**: Full feature access with automatic trial tracking
- **Payment Integration**: Secure Paystack payment processing with NGN support

### User Management
- **Multi-tenant Architecture**: Organization-based user separation
- **Firebase Authentication**: Secure login with email/password
- **User Onboarding**: Guided welcome flow for new subscribers
- **Admin Controls**: User management, security settings, and analytics

### Advanced Features
- **QR Code Integration**: Asset scanning and quick access
- **Advanced Analytics**: Usage trends, performance metrics, and custom reports
- **API Access**: RESTful API for integrations (Professional+ plans)
- **Audit Trails**: Complete activity logging and compliance tracking

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + Headless UI
- **Authentication**: Firebase Auth
- **State Management**: React Context + Hooks
- **Charts**: Chart.js + React ChartJS 2
- **Icons**: Lucide React + Heroicons
- **Testing**: Vitest + React Testing Library
- **Payment**: Paystack integration

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd asset-management

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Configure Firebase and Paystack keys

# Start development server
npm run dev
```

## 🔧 Configuration

### Environment Variables
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
VITE_API_BASE_URL=your_api_base_url
```

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication with email/password
3. Set up Firestore database
4. Configure security rules for multi-tenant access

### Paystack Setup
1. Create Paystack account
2. Get public key for frontend integration
3. Configure webhook endpoints for payment verification

## 🎯 Usage

### Demo Accounts
The application includes pre-configured demo accounts:

- **Admin**: `admin@demo.com` / `admin123`
  - Full system control, user management, advanced analytics
- **Manager**: `manager@demo.com` / `manager123`
  - Department oversight, team management, reporting
- **Employee**: `employee@demo.com` / `employee123`
  - Asset requests, status updates, personal inventory

### User Journey
1. **Registration**: New users register and get welcomed with onboarding
2. **Subscription Selection**: Choose from trial, paid plans, or free tier
3. **Dashboard Access**: Role-appropriate dashboard with relevant features
4. **Asset Management**: Create, assign, track, and maintain assets
5. **Analytics**: Monitor usage, performance, and business metrics

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test suites
npm test SubscriptionSummary
npm test TrialBanner
```

### Test Coverage
- **Component Testing**: UI components with React Testing Library
- **Integration Testing**: User workflows and API interactions
- **Subscription Testing**: Payment flows and billing logic
- **Access Control**: Role-based permission testing

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── assets/          # Asset-specific components
│   ├── auth/            # Authentication components
│   ├── billing/         # Subscription and payment components
│   ├── common/          # Shared UI components
│   └── mobile/          # Mobile-specific components
├── pages/               # Main application pages
├── services/            # API services and utilities
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Helper functions
└── admin/               # Admin-specific components
```

## 🔐 Security Features

- **Role-based Access Control**: Three-tier permission system
- **Secure Authentication**: Firebase Auth with session management
- **Payment Security**: PCI-compliant Paystack integration
- **Data Protection**: Encrypted storage and secure API endpoints
- **Audit Logging**: Complete activity tracking for compliance

## 🚀 Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to hosting platform
# (Configure with your preferred hosting service)
```

## 📊 Analytics & Monitoring

- **Usage Analytics**: Track user engagement and feature adoption
- **Performance Metrics**: Monitor asset utilization and efficiency
- **Subscription Analytics**: Revenue tracking and conversion metrics
- **System Health**: Error monitoring and performance dashboards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

---

Built with ❤️ using React, TypeScript, and modern web technologies.