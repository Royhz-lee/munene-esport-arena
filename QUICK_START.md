# Munene Esports Arena - Quick Start Guide

Get up and running with Munene Esports Arena in minutes!

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- Redis 7+ ([Download](https://redis.io/download))
- Git ([Download](https://git-scm.com/))

## 5-Minute Setup

### 1. Clone & Install

```bash
git clone https://github.com/munene-esports/arena.git
cd munene-esports-arena

# Install dependencies (both frontend & backend)
npm run install:all
```

### 2. Environment Setup

```bash
# Copy configuration files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**backend/.env** (minimal):
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/munene_esports
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key-change-in-production
```

**frontend/.env** (minimal):
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Database Setup

```bash
# Create database
createdb munene_esports

# Run migrations
cd backend
npm run migrate:up
npm run seed:dev
cd ..
```

### 4. Start Development Servers

**Option A: Separate Terminals**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Option B: Using NPM Concurrently**
```bash
npm run dev
```

### 5. Access the Application

```
Frontend:  http://localhost:5173
API:       http://localhost:5000/api/v1
API Docs:  http://localhost:5000/docs
```

---

## Login Credentials

### Player Account
```
Email: player@example.com
Password: password123
```

### Admin Account
```
Email: admin@example.com
Password: admin123
```

### Sponsor Account
```
Email: sponsor@example.com
Password: sponsor123
```

---

## Common Tasks

### Run Tests

```bash
# Backend unit tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test

# E2E tests
npm run test:e2e
```

### Create a New Migration

```bash
cd backend
npm run migrate:create add_new_field

# Edit migration file in src/database/migrations/
npm run migrate:up
```

### Add New API Endpoint

```javascript
// backend/src/players/routes.js
router.get('/stats', authMiddleware, playerController.getStats);

// backend/src/players/controllers.js
async getStats(req, res) {
  const stats = await playerService.getStats(req.user.id);
  res.json(stats);
}
```

### Seed Test Data

```bash
cd backend

# Seed development data
npm run seed:dev

# Clear and re-seed
npm run seed:reset
```

### View Database

```bash
# Connect to database
psql munene_esports

# List tables
\dt

# View table structure
\d transactions

# Exit
\q
```

### Clear Redis Cache

```bash
redis-cli FLUSHALL
```

---

## Using Docker

### Docker Compose (All Services)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# View running services
docker-compose ps
```

### Individual Docker Commands

```bash
# Build images
docker build -t munene-backend ./backend
docker build -t munene-frontend ./frontend

# Run containers
docker run -d -p 5000:5000 munene-backend
docker run -d -p 3000:3000 munene-frontend

# Execute commands in container
docker exec -it munene-backend npm run migrate:up

# View container logs
docker logs munene-backend
```

---

## Project Features You Can Test

### Player Features
1. **Register & Login** - Create account and login
2. **KYC Verification** - Complete identity verification (mock)
3. **Wallet** - Deposit funds, view balance
4. **Tournaments** - Browse and join tournaments
5. **Leagues** - Join league and view leaderboard
6. **Profile** - Update player profile

### Admin Features
1. **Dashboard** - View analytics and statistics
2. **Manage Users** - Browse and manage player accounts
3. **Manage Tournaments** - Create and configure tournaments
4. **Approve KYC** - Review and approve KYC submissions
5. **Process Withdrawals** - Approve withdrawal requests
6. **Reports** - View platform reports

### Sponsor Features
1. **Create Sponsorship** - Sponsor tournaments
2. **Track ROI** - View sponsorship performance
3. **Manage Budget** - Track spending
4. **Analytics** - View engagement metrics

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000 (macOS/Linux)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID {PID} /F
```

### Database Connection Refused

```bash
# Check PostgreSQL is running
psql -U postgres

# Start PostgreSQL
brew services start postgresql  # macOS
sudo service postgresql start    # Linux
```

### Redis Connection Error

```bash
# Check Redis is running
redis-cli ping

# Start Redis
redis-server  # macOS/Linux
```

### Migrations Failed

```bash
# Rollback all migrations
cd backend
npm run migrate:down

# Re-run migrations
npm run migrate:up
npm run seed:dev
```

### Clear Everything & Start Fresh

```bash
# Stop all services
docker-compose down -v  # Remove volumes too

# Drop database
dropdb munene_esports

# Fresh install
npm run install:all
npm run setup:dev
```

---

## Development Workflow

### 1. Backend Development

```bash
cd backend

# Start dev server with auto-reload
npm run dev

# Make changes to src/players/controllers.js
# Changes auto-reload - no restart needed
```

### 2. Frontend Development

```bash
cd frontend

# Start dev server with hot reload
npm run dev

# Make changes to src/pages/PlayerDashboard.jsx
# Changes instantly visible in browser
```

### 3. Database Changes

```bash
# Create new migration
npm run migrate:create add_player_tier

# Edit src/database/migrations/{timestamp}_add_player_tier.js

# Run migration
npm run migrate:up
```

### 4. Test Your Changes

```bash
cd backend
npm run test

# Test specific file
npm run test -- src/players/services.test.js

# Watch mode
npm run test -- --watch
```

---

## API Testing

### Using Postman

1. Import collection: `backend/postman_collection.json`
2. Set environment variables
3. Test endpoints

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"player@example.com","password":"password123"}'

# Get player profile
curl -X GET http://localhost:5000/api/v1/players/P001 \
  -H "Authorization: Bearer {token}"

# Get wallet balance
curl -X GET http://localhost:5000/api/v1/wallet/balance \
  -H "Authorization: Bearer {token}"
```

### Using fetch (Browser Console)

```javascript
// Login
fetch('http://localhost:5000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'player@example.com',
    password: 'password123'
  })
})
.then(r => r.json())
.then(data => localStorage.setItem('token', data.access_token))

// Get profile
fetch('http://localhost:5000/api/v1/players/P001', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
})
.then(r => r.json())
.then(data => console.log(data))
```

---

## File Structure Quick Reference

```
Important Frontend Files:
- src/components/LoginPage.jsx      - Login UI
- src/pages/PlayerDashboard.jsx     - Player dashboard
- src/pages/AdminDashboard.jsx      - Admin dashboard
- src/services/api.js               - API client
- src/store/                        - Redux store

Important Backend Files:
- src/auth/routes.js                - Auth endpoints
- src/players/routes.js             - Player endpoints
- src/tournaments/routes.js         - Tournament endpoints
- src/wallet/services.js            - Wallet logic
- src/database/schema.sql           - Database schema
- .env                              - Environment variables
```

---

## Next Steps

1. **Explore the Code** - Read through the controllers and services
2. **Add Features** - Create new tournament types or features
3. **Write Tests** - Add unit tests for your changes
4. **Deploy** - Follow DEPLOYMENT_GUIDE.md for AWS/production setup

---

## Useful Commands

```bash
# Show all available commands
npm run

# Format code
npm run format

# Lint code
npm run lint

# Build for production
npm run build

# Run in production mode
npm run start

# Database reset
npm run db:reset

# View database stats
npm run db:stats

# Check code coverage
npm run test:coverage

# Run load tests
npm run load:test
```

---

## Resources

- [Full README](./README.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Database Schema](./DATABASE_SCHEMA_ARCHITECTURE.md)
- [GitHub Repository](https://github.com/munene-esports/arena)

---

## Support

- **Documentation:** https://docs.muneneesports.com
- **Issues:** GitHub Issues
- **Email:** dev-support@muneneesports.com
- **Discord:** [Join Developer Community](https://discord.gg/munene-dev)

---

## Tips for Success

✅ Keep both servers running (backend + frontend)
✅ Check the console for error messages
✅ Verify database is running before starting backend
✅ Use mock payment methods in development
✅ Check API logs for debugging: `docker logs munene-backend`
✅ Clear browser cache if UI doesn't update: `Ctrl+Shift+Delete`
✅ Use Postman or Insomnia for API testing
✅ Read through existing code before adding new features

---

Happy coding! 🚀

Last updated: June 26, 2026
