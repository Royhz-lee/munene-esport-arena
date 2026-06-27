# Munene Esports Arena - Complete Platform

**"Compete. Win. Rise Through the Leagues."**

A professional, modern, secure, and scalable esports tournament platform focused on eFootball (Konami) competitions in Kenya and East Africa.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Database](#database)
- [Security](#security)
- [Contributing](#contributing)
- [Support](#support)

---

## Overview

Munene Esports Arena is a comprehensive esports tournament management platform designed specifically for eFootball players in East Africa. The platform enables players to:

- Register and create accounts
- Deposit funds securely
- Join tournaments and leagues at various tiers
- Compete for prize pools
- Withdraw winnings
- Progress through ranking systems
- Track achievements and statistics

The platform generates revenue through:
- Tournament entry fees (20% commission, 80% prize pool)
- Premium memberships
- Sponsorships
- Advertisements
- Affiliate partnerships

---

## Features

### For Players 🎮

- **Account Management**
  - Secure JWT-based authentication
  - Two-factor authentication (SMS/Email/Authenticator)
  - Profile customization with avatar upload
  - Account verification and security

- **Wallet System**
  - Multiple payment gateway integration (M-Pesa, Pesapal, IntaSend)
  - Deposit funds via mobile money
  - Withdraw winnings
  - Transaction history tracking
  - Real-time balance updates

- **Tournament System**
  - Browse available tournaments
  - Join tournaments with entry fees
  - Automatic bracket generation
  - Multi-stage tournament progression
  - Real-time match updates
  - Leaderboard tracking

- **League System**
  - 5-tier ranking system (Bronze → Champion)
  - Seasonal competitions
  - Promotion and relegation mechanics
  - League-specific rewards
  - Season rankings and statistics

- **Match Management**
  - Submit match results
  - Upload screenshots as evidence
  - Dispute resolution system
  - Automatic point calculation
  - Statistics tracking

- **KYC Verification**
  - National ID/Passport verification
  - Selfie verification
  - Phone verification
  - Email verification
  - Compliance with regulations

### For Admins ⚙️

- **Platform Management**
  - User management and moderation
  - Tournament creation and configuration
  - Prize pool management
  - Commission configuration
  - Suspension/ban functionality

- **Financial Control**
  - Revenue analytics
  - Transaction monitoring
  - Withdrawal approval workflow
  - Payment reconciliation
  - Dispute resolution

- **KYC & Compliance**
  - KYC document verification
  - Approval/rejection workflow
  - Compliance reporting
  - Audit logging
  - User restriction management

- **Analytics Dashboard**
  - Revenue trends
  - User growth metrics
  - Tournament statistics
  - Payment gateway performance
  - Player engagement metrics

### For Sponsors/Investors 🏆

- **Sponsorship Portal**
  - Tournament sponsorship creation
  - Budget management
  - ROI tracking
  - Engagement analytics
  - Advertisement management

---

## Technology Stack

### Frontend
- **React.js** 18.x with TypeScript
- **Tailwind CSS** for styling (dark theme)
- **Recharts** for data visualization
- **Axios** for API communication
- **Redux Toolkit** for state management
- **Vite** as build tool

### Backend
- **Node.js** 18.x
- **Express.js** for API framework
- **PostgreSQL** for database
- **Redis** for caching and sessions
- **JWT** for authentication
- **bcrypt** for password hashing
- **Multer** for file uploads
- **Socket.io** for real-time updates

### External Services
- **M-Pesa** (Safaricom Daraja API) - Mobile money
- **Pesapal** - Payment gateway
- **IntaSend** - Payment processing
- **Twilio** - SMS/2FA
- **SendGrid/AWS SES** - Email notifications
- **AWS S3/Cloudinary** - File storage
- **Sentry** - Error tracking
- **Datadog** - Monitoring

### Infrastructure
- **Docker** & Docker Compose
- **AWS/Google Cloud** for hosting
- **Nginx** for reverse proxy
- **PostgreSQL** for database
- **Redis** for caching
- **Let's Encrypt** for SSL/TLS

---

## Getting Started

### Prerequisites

```bash
# Check Node.js version (18.0.0 or higher)
node --version

# Check npm version
npm --version

# Install Docker (optional)
docker --version

# Install PostgreSQL client tools
psql --version
```

### Quick Start (Development)

```bash
# 1. Clone the repository
git clone https://github.com/munene-esports/arena.git
cd munene-esports-arena

# 2. Install dependencies
npm install:all  # Installs both frontend and backend

# 3. Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Start development servers
npm run dev  # Runs both frontend (port 5173) and backend (port 5000)
```

Access the application:
- **Frontend:** http://localhost:5173
- **API:** http://localhost:5000/api/v1
- **API Docs:** http://localhost:5000/docs

---

## Project Structure

```
munene-esports-arena/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom hooks
│   │   ├── store/           # Redux store
│   │   ├── styles/          # Global styles
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Root component
│   ├── public/              # Static assets
│   ├── vite.config.js       # Vite configuration
│   └── package.json
│
├── backend/                  # Express.js backend
│   ├── src/
│   │   ├── auth/            # Authentication
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── middleware/
│   │   │   └── routes.js
│   │   ├── players/         # Player management
│   │   ├── tournaments/     # Tournament system
│   │   ├── leagues/         # League system
│   │   ├── wallet/          # Wallet & payments
│   │   ├── kyc/             # KYC verification
│   │   ├── matches/         # Match management
│   │   ├── admin/           # Admin functions
│   │   ├── config/          # Configuration
│   │   ├── database/        # Database setup
│   │   │   ├── migrations/
│   │   │   ├── seeders/
│   │   │   └── schema.sql
│   │   ├── middleware/      # Global middleware
│   │   ├── utils/           # Utilities
│   │   ├── services/        # Business logic
│   │   └── app.js           # Express app
│   ├── tests/               # Test files
│   ├── .env.example
│   ├── server.js            # Server entry point
│   └── package.json
│
├── docker-compose.yml       # Docker Compose config
├── nginx.conf              # Nginx config
├── README.md               # This file
└── .github/
    └── workflows/
        └── deploy.yml      # CI/CD pipeline
```

---

## Installation

### Step 1: Clone Repository

```bash
git clone https://github.com/munene-esports/arena.git
cd munene-esports-arena
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### Step 3: Environment Configuration

**Backend (.env):**
```env
# Copy from .env.example and configure
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/munene_esports
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
# ... other variables (see .env.example)
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Munene Esports Arena
```

### Step 4: Database Setup

```bash
# Start PostgreSQL
# Then run migrations
cd backend
npm run migrate:up
npm run seed:dev
```

### Step 5: Start Development

```bash
# In one terminal - Backend
cd backend
npm run dev

# In another terminal - Frontend
cd frontend
npm run dev
```

---

## Configuration

### Payment Gateways

#### M-Pesa Configuration
```javascript
// backend/src/config/mpesa.js
module.exports = {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  passkey: process.env.MPESA_PASSKEY,
  shortcode: process.env.MPESA_SHORTCODE,
  callbackUrl: 'https://api.muneneesports.com/api/v1/webhooks/mpesa'
};
```

#### Pesapal Configuration
```javascript
// backend/src/config/pesapal.js
module.exports = {
  apiKey: process.env.PESAPAL_API_KEY,
  apiSecret: process.env.PESAPAL_API_SECRET,
  consumerKey: process.env.PESAPAL_CONSUMER_KEY,
  consumerSecret: process.env.PESAPAL_CONSUMER_SECRET,
  redirectUrl: 'https://muneneesports.com/payment/callback'
};
```

### Email Configuration
```javascript
// backend/src/config/email.js
module.exports = {
  provider: process.env.EMAIL_PROVIDER, // 'sendgrid' | 'aws-ses'
  from: process.env.EMAIL_FROM,
  apiKey: process.env.EMAIL_API_KEY
};
```

### Cloud Storage
```javascript
// backend/src/config/storage.js
module.exports = {
  provider: process.env.STORAGE_PROVIDER, // 's3' | 'cloudinary'
  bucket: process.env.AWS_S3_BUCKET,
  cloudinaryName: process.env.CLOUDINARY_NAME,
  cloudinaryKey: process.env.CLOUDINARY_API_KEY
};
```

---

## Running Locally

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Setup

**Terminal 1 - Database:**
```bash
# Start PostgreSQL
psql postgres
CREATE DATABASE munene_esports;
\q
```

**Terminal 2 - Redis:**
```bash
redis-server
```

**Terminal 3 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## Deployment

### Docker Deployment

```bash
# Build images
docker build -t munene-backend ./backend
docker build -t munene-frontend ./frontend

# Run containers
docker run -d -p 5000:5000 munene-backend
docker run -d -p 3000:3000 munene-frontend
```

### AWS Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete AWS deployment instructions including:
- ECS Container setup
- RDS Database
- ElastiCache Redis
- CloudFront CDN
- Application Load Balancer
- Auto-scaling configuration

### Production Checklist

- [ ] Database backed up
- [ ] SSL/TLS certificates configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Payment gateways tested
- [ ] Email notifications working
- [ ] Monitoring/logging set up
- [ ] Admin users created
- [ ] Security headers configured
- [ ] Database connection pooling enabled
- [ ] Redis cache warmed
- [ ] CDN configured

---

## API Documentation

Complete API documentation available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Key Endpoints

```
# Authentication
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/2fa/verify

# Players
GET    /api/v1/players/{id}
PUT    /api/v1/players/{id}/profile
GET    /api/v1/players/{id}/stats

# Wallet
GET    /api/v1/wallet/balance
POST   /api/v1/wallet/deposit
POST   /api/v1/wallet/withdraw
GET    /api/v1/wallet/transactions

# Tournaments
GET    /api/v1/tournaments
GET    /api/v1/tournaments/{id}
POST   /api/v1/tournaments/{id}/join
GET    /api/v1/tournaments/{id}/bracket

# Leagues
GET    /api/v1/leagues
GET    /api/v1/leagues/{id}
POST   /api/v1/leagues/{id}/join
GET    /api/v1/leagues/{id}/leaderboard

# KYC
POST   /api/v1/kyc/submit
GET    /api/v1/kyc/status

# Admin
GET    /api/v1/admin/dashboard
GET    /api/v1/admin/kyc/pending
POST   /api/v1/admin/kyc/approve
```

---

## Database

### Schema

Complete database schema available in [DATABASE_SCHEMA_ARCHITECTURE.md](./DATABASE_SCHEMA_ARCHITECTURE.md)

### Key Tables

- **users** - Player/admin/sponsor accounts
- **wallets** - Account balances
- **transactions** - Financial records
- **tournaments** - Tournament management
- **leagues** - League tiers and seasons
- **matches** - Match results and disputes
- **kyc_documents** - Verification documents
- **withdrawals** - Withdrawal requests

### Migrations

```bash
# Run all pending migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down

# Create new migration
npm run migrate:create add_new_field

# Seed development data
npm run seed:dev
```

---

## Security

### Authentication & Authorization

- **JWT Tokens** with 1-hour expiry
- **Refresh Tokens** with 7-day expiry
- **Two-Factor Authentication** (SMS/Email/TOTP)
- **Role-Based Access Control** (RBAC)
- **Session Management** with Redis

### Data Protection

- **Password Hashing** with bcrypt (salt rounds: 12)
- **SSL/TLS 1.3+** for all communications
- **Database Encryption** at rest
- **PII Masking** in logs
- **Secure Headers** (HSTS, CSP, X-Frame-Options)

### Compliance

- **KYC/AML** verification
- **GDPR** compliant
- **PCI-DSS** for payment processing
- **Audit Logging** for all admin actions
- **Data Retention** policies
- **Age Verification** (18+ required)

### Best Practices

```javascript
// Password hashing
const hashedPassword = await bcrypt.hash(password, 12);

// JWT verification
const decoded = jwt.verify(token, process.env.JWT_SECRET);

// SQL injection prevention
const query = 'SELECT * FROM users WHERE email = $1';
client.query(query, [email]);

// Rate limiting
const limiter = rateLimit({
  windowMs: 60000,
  max: 100
});

// CORS configuration
cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true
})
```

---

## Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:coverage

# Frontend tests
cd frontend
npm run test
npm run test:e2e

# Load testing
npm run load:test
```

---

## Monitoring & Logging

### Logging Levels

```
DEBUG  - Development debugging
INFO   - General information
WARN   - Warnings
ERROR  - Error messages
```

### Monitoring Stack

- **Sentry** - Error tracking
- **Datadog** - Performance monitoring
- **ELK Stack** - Log aggregation
- **Prometheus** - Metrics collection
- **Grafana** - Dashboards

---

## Performance Optimization

- Database query indexing
- Redis caching layer
- CDN for static assets
- Image optimization
- Code splitting (frontend)
- Database connection pooling
- API response compression
- Load balancing

---

## Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check PostgreSQL is running
psql -U postgres

# Verify connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

**Payment Gateway Issues**
```bash
# Test M-Pesa credentials
npm run test:mpesa

# Check webhook logs
docker logs munene-backend | grep -i webhook
```

**Redis Connection Error**
```bash
# Check Redis is running
redis-cli ping

# View Redis info
redis-cli INFO
```

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Standards

- ESLint for JavaScript
- Prettier for formatting
- TypeScript for type safety
- Jest for testing
- 80%+ code coverage

---

## Documentation

- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Database & Architecture](./DATABASE_SCHEMA_ARCHITECTURE.md)
- [Security Policy](./SECURITY.md)
- [Contributing Guide](./CONTRIBUTING.md)

---

## Support

- **Email:** support@muneneesports.com
- **Website:** https://muneneesports.com
- **Twitter:** @MuneneEsports
- **Discord:** [Join Community](https://discord.gg/munene)
- **Telegram:** @MuneneEsportsOfficial

---

## License

This project is licensed under the MIT License - see [LICENSE.md](./LICENSE.md) for details.

---

## Roadmap

### Q3 2026
- ✅ MVP Launch
- ✅ Core tournament system
- ✅ Payment integration
- ✅ KYC verification

### Q4 2026
- Mobile app launch
- Live streaming integration
- Advanced analytics
- Sponsorship marketplace
- 🎮 Additional game support

### Q1 2027
- Social features (chat, notifications)
- Advanced matchmaking algorithm
- Affiliate program
- Enterprise API
- Regional expansion

---

## Team

- **Founder & CEO:** Kenneth Omondi
- **CTO:** [Lead Developer]
- **Product Lead:** [Product Manager]
- **Community Manager:** [Manager]

---

**Last Updated:** June 26, 2026

For more information, visit [muneneesports.com](https://muneneesports.com)
