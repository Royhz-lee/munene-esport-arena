# Munene Esports Arena - Database Schema & Architecture

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone_number VARCHAR(20),
  country_code VARCHAR(2) DEFAULT 'KE',
  profile_picture_url VARCHAR(500),
  bio TEXT,
  role ENUM('player', 'admin', 'sponsor', 'moderator') DEFAULT 'player',
  kyc_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  kyc_submitted_at TIMESTAMP,
  kyc_approved_at TIMESTAMP,
  two_fa_enabled BOOLEAN DEFAULT false,
  two_fa_method ENUM('sms', 'email', 'authenticator') DEFAULT 'sms',
  last_login TIMESTAMP,
  login_attempts INT DEFAULT 0,
  account_locked BOOLEAN DEFAULT false,
  locked_until TIMESTAMP,
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP,
  phone_verified BOOLEAN DEFAULT false,
  phone_verified_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_banned BOOLEAN DEFAULT false,
  ban_reason TEXT,
  banned_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username),
  INDEX idx_kyc_status (kyc_status),
  INDEX idx_created_at (created_at)
);
```

### Wallets Table
```sql
CREATE TABLE wallets (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'KES',
  total_deposited DECIMAL(15, 2) DEFAULT 0,
  total_withdrawn DECIMAL(15, 2) DEFAULT 0,
  total_earned DECIMAL(15, 2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  type ENUM(
    'deposit',
    'withdrawal',
    'tournament_entry',
    'prize_payout',
    'bonus',
    'refund',
    'commission',
    'league_fee'
  ) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  status ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded') DEFAULT 'pending',
  payment_gateway VARCHAR(50),
  gateway_reference_id VARCHAR(200),
  description TEXT,
  related_tournament_id INT,
  related_league_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (related_tournament_id) REFERENCES tournaments(id),
  FOREIGN KEY (related_league_id) REFERENCES leagues(id),
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_gateway_reference (gateway_reference_id)
);
```

### Tournaments Table
```sql
CREATE TABLE tournaments (
  id SERIAL PRIMARY KEY,
  tournament_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('free', 'paid', 'sponsored', 'invitational') NOT NULL,
  entry_fee DECIMAL(12, 2) DEFAULT 0,
  max_players INT DEFAULT 128,
  current_players INT DEFAULT 0,
  prize_pool DECIMAL(15, 2),
  platform_fee_percentage DECIMAL(5, 2) DEFAULT 20,
  current_stage VARCHAR(100),
  status ENUM('registration', 'group_stage', 'knockout', 'finals', 'completed', 'cancelled') DEFAULT 'registration',
  registration_open BOOLEAN DEFAULT true,
  registration_start_date DATETIME,
  registration_end_date DATETIME,
  tournament_start_date DATETIME,
  tournament_end_date DATETIME,
  sponsor_id INT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sponsor_id) REFERENCES sponsors(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_code (tournament_code)
);
```

### Tournament Participants Table
```sql
CREATE TABLE tournament_participants (
  id SERIAL PRIMARY KEY,
  tournament_id INT NOT NULL,
  user_id INT NOT NULL,
  seed_number INT,
  position INT,
  points INT DEFAULT 0,
  matches_played INT DEFAULT 0,
  matches_won INT DEFAULT 0,
  matches_lost INT DEFAULT 0,
  goals_for INT DEFAULT 0,
  goals_against INT DEFAULT 0,
  status ENUM('active', 'eliminated', 'withdrew', 'disqualified') DEFAULT 'active',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_participant (tournament_id, user_id),
  INDEX idx_tournament_id (tournament_id),
  INDEX idx_user_id (user_id),
  INDEX idx_position (position)
);
```

### Leagues Table
```sql
CREATE TABLE leagues (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  league_code VARCHAR(50) UNIQUE NOT NULL,
  tier ENUM('bronze', 'silver', 'gold', 'platinum', 'champion') NOT NULL,
  description TEXT,
  entry_fee DECIMAL(12, 2),
  min_rank INT DEFAULT 0,
  max_members INT,
  current_members INT DEFAULT 0,
  icon_url VARCHAR(500),
  season_number INT DEFAULT 1,
  season_start_date DATE,
  season_end_date DATE,
  total_prize_pool DECIMAL(15, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tier (tier),
  INDEX idx_code (league_code),
  INDEX idx_season_dates (season_start_date, season_end_date)
);
```

### League Members Table
```sql
CREATE TABLE league_members (
  id SERIAL PRIMARY KEY,
  league_id INT NOT NULL,
  user_id INT NOT NULL,
  season_points INT DEFAULT 0,
  current_rank INT,
  matches_played INT DEFAULT 0,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  win_rate DECIMAL(5, 2) DEFAULT 0,
  promotion_eligible BOOLEAN DEFAULT false,
  relegation_risk BOOLEAN DEFAULT false,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP,
  FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_member (league_id, user_id),
  INDEX idx_league_id (league_id),
  INDEX idx_user_id (user_id),
  INDEX idx_current_rank (current_rank),
  INDEX idx_season_points (season_points)
);
```

### Matches Table
```sql
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  match_code VARCHAR(50) UNIQUE NOT NULL,
  tournament_id INT,
  league_id INT,
  player1_id INT NOT NULL,
  player2_id INT NOT NULL,
  player1_score INT,
  player2_score INT,
  winner_id INT,
  loser_id INT,
  points_awarded INT,
  status ENUM('scheduled', 'in_progress', 'completed', 'disputed', 'cancelled') DEFAULT 'scheduled',
  match_date DATETIME,
  completed_at TIMESTAMP,
  evidence_screenshot_url VARCHAR(500),
  evidence_video_url VARCHAR(500),
  evidence_submitted_by INT,
  evidence_submitted_at TIMESTAMP,
  verified_by INT,
  verified_at TIMESTAMP,
  dispute_reason TEXT,
  dispute_resolution TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
  FOREIGN KEY (league_id) REFERENCES leagues(id),
  FOREIGN KEY (player1_id) REFERENCES users(id),
  FOREIGN KEY (player2_id) REFERENCES users(id),
  FOREIGN KEY (winner_id) REFERENCES users(id),
  FOREIGN KEY (evidence_submitted_by) REFERENCES users(id),
  FOREIGN KEY (verified_by) REFERENCES users(id),
  INDEX idx_tournament_id (tournament_id),
  INDEX idx_league_id (league_id),
  INDEX idx_status (status),
  INDEX idx_match_date (match_date),
  INDEX idx_code (match_code)
);
```

### KYC Documents Table
```sql
CREATE TABLE kyc_documents (
  id SERIAL PRIMARY KEY,
  kyc_id VARCHAR(100) UNIQUE NOT NULL,
  user_id INT UNIQUE NOT NULL,
  id_type ENUM('national_id', 'passport', 'driving_license') NOT NULL,
  id_number VARCHAR(100) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  id_document_url VARCHAR(500),
  selfie_url VARCHAR(500),
  additional_doc_url VARCHAR(500),
  status ENUM('pending', 'approved', 'rejected', 'resubmit_required') DEFAULT 'pending',
  rejection_reason TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_by INT,
  reviewed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_kyc_id (kyc_id)
);
```

### Payment Gateways Transactions Table
```sql
CREATE TABLE payment_gateway_logs (
  id SERIAL PRIMARY KEY,
  transaction_id INT NOT NULL,
  gateway VARCHAR(50) NOT NULL,
  gateway_reference_id VARCHAR(200),
  request_payload LONGTEXT,
  response_payload LONGTEXT,
  status_code INT,
  error_message TEXT,
  retry_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id),
  INDEX idx_gateway (gateway),
  INDEX idx_reference (gateway_reference_id),
  INDEX idx_created_at (created_at)
);
```

### Sponsorships Table
```sql
CREATE TABLE sponsorships (
  id SERIAL PRIMARY KEY,
  sponsor_id INT NOT NULL,
  tournament_id INT NOT NULL,
  sponsorship_amount DECIMAL(15, 2) NOT NULL,
  status ENUM('pending', 'active', 'completed') DEFAULT 'pending',
  advertisement_creative_url VARCHAR(500),
  start_date DATE,
  end_date DATE,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  roi_percentage DECIMAL(8, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sponsor_id) REFERENCES sponsors(id),
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
  INDEX idx_sponsor_id (sponsor_id),
  INDEX idx_tournament_id (tournament_id)
);
```

### Sponsors Table
```sql
CREATE TABLE sponsors (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  company_logo_url VARCHAR(500),
  company_website VARCHAR(500),
  total_sponsored DECIMAL(15, 2) DEFAULT 0,
  total_tournaments INT DEFAULT 0,
  average_roi DECIMAL(8, 2),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_verified (is_verified)
);
```

### Withdrawals Table
```sql
CREATE TABLE withdrawals (
  id SERIAL PRIMARY KEY,
  withdrawal_id VARCHAR(100) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  withdrawal_method ENUM('mpesa', 'pesapal', 'intasend', 'bank_transfer') NOT NULL,
  account_details TEXT NOT NULL,
  status ENUM('pending', 'approved', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  processing_fee DECIMAL(12, 2) DEFAULT 0,
  net_amount DECIMAL(15, 2),
  gateway_reference_id VARCHAR(200),
  approved_by INT,
  approved_at TIMESTAMP,
  completed_at TIMESTAMP,
  failure_reason TEXT,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_requested_at (requested_at)
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data LONGTEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
);
```

### Admin Activity Logs Table
```sql
CREATE TABLE admin_activity_logs (
  id SERIAL PRIMARY KEY,
  admin_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id INT,
  old_value LONGTEXT,
  new_value LONGTEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id),
  INDEX idx_admin_id (admin_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
);
```

---

## System Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────────────────┐
│              Presentation Layer                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  React Components (tsx/jsx)                   │   │
│  │  ├── Pages                                    │   │
│  │  │   ├── LoginPage                           │   │
│  │  │   ├── PlayerDashboard                     │   │
│  │  │   ├── AdminDashboard                      │   │
│  │  │   ├── TournamentBrowser                   │   │
│  │  │   └── WalletPage                          │   │
│  │  ├── Components                               │   │
│  │  │   ├── Tournament Cards                    │   │
│  │  │   ├── Player Profile                      │   │
│  │  │   ├── Wallet Display                      │   │
│  │  │   └── Match Results                       │   │
│  │  └── Layouts                                  │   │
│  │      ├── Header                              │   │
│  │      ├── Sidebar                             │   │
│  │      └── Footer                              │   │
│  └──────────────────────────────────────────────┘   │
│                       ↓                              │
│  ┌──────────────────────────────────────────────┐   │
│  │  State Management (Redux/Zustand)            │   │
│  │  ├── Auth State                              │   │
│  │  ├── Player State                            │   │
│  │  ├── Tournament State                        │   │
│  │  └── UI State                                │   │
│  └──────────────────────────────────────────────┘   │
│                       ↓                              │
│  ┌──────────────────────────────────────────────┐   │
│  │  Services Layer (Axios/Fetch)                │   │
│  │  ├── AuthService                             │   │
│  │  ├── PlayerService                           │   │
│  │  ├── TournamentService                       │   │
│  │  ├── WalletService                           │   │
│  │  └── PaymentService                          │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
            REST API Calls (HTTPS)
                  ↓
```

### Backend Architecture

```
┌─────────────────────────────────────────────────────┐
│              API Gateway / Routing                   │
│  Express.js Router + Middleware Stack               │
│  ├── Authentication Middleware                       │
│  ├── Authorization Middleware                        │
│  ├── Rate Limiting Middleware                        │
│  ├── Validation Middleware                           │
│  └── Error Handling Middleware                       │
└───────────────────────┬─────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│              Controllers Layer                        │
│  ├── AuthController                                  │
│  │   ├── register()                                 │
│  │   ├── login()                                    │
│  │   ├── logout()                                   │
│  │   └── verify2FA()                                │
│  ├── PlayerController                                │
│  │   ├── getProfile()                               │
│  │   ├── updateProfile()                            │
│  │   └── getStats()                                 │
│  ├── TournamentController                            │
│  │   ├── listTournaments()                           │
│  │   ├── getTournamentDetails()                      │
│  │   └── joinTournament()                            │
│  ├── WalletController                                │
│  │   ├── getBalance()                               │
│  │   ├── deposit()                                  │
│  │   └── withdraw()                                 │
│  └── AdminController                                 │
│      ├── getDashboard()                             │
│      ├── approveKYC()                               │
│      └── processWithdrawal()                         │
└───────────────────────┬─────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│              Services Layer                           │
│  ├── AuthService                                     │
│  │   ├── JWT Token Generation                       │
│  │   ├── Password Hashing (bcrypt)                  │
│  │   └── 2FA Logic                                  │
│  ├── PlayerService                                   │
│  │   ├── Profile Management                         │
│  │   ├── Ranking Calculation                        │
│  │   └── Stats Aggregation                          │
│  ├── TournamentService                               │
│  │   ├── Tournament Creation                        │
│  │   ├── Bracket Generation                         │
│  │   ├── Match Scheduling                           │
│  │   └── Prize Distribution                         │
│  ├── WalletService                                   │
│  │   ├── Balance Management                         │
│  │   ├── Transaction Processing                     │
│  │   └── Reconciliation                             │
│  ├── PaymentService                                  │
│  │   ├── M-Pesa Integration                         │
│  │   ├── Pesapal Integration                        │
│  │   └── IntaSend Integration                       │
│  ├── KYCService                                      │
│  │   ├── Document Verification                      │
│  │   ├── Photo Analysis                             │
│  │   └── Compliance Checks                          │
│  └── NotificationService                             │
│      ├── Email Notifications                        │
│      ├── SMS Notifications                          │
│      └── In-App Notifications                       │
└───────────────────────┬─────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│              Repository Layer (Data Access)           │
│  ├── UserRepository                                  │
│  ├── TournamentRepository                            │
│  ├── WalletRepository                                │
│  ├── TransactionRepository                           │
│  ├── MatchRepository                                 │
│  └── LeagueRepository                                │
└───────────────────────┬─────────────────────────────┘
                        ↓
```

### Database Layer

```
┌──────────────────────────────────────────────────────┐
│              Database (PostgreSQL)                    │
│  ├── Core Tables (Users, Wallets, Transactions)      │
│  ├── Tournament Tables                               │
│  ├── League Tables                                   │
│  ├── Match Tables                                    │
│  ├── KYC Tables                                      │
│  ├── Indexes & Constraints                           │
│  └── Triggers & Procedures                           │
└──────────────────────────────────────────────────────┘
         ↑                    ↑                    ↑
         │                    │                    │
   ┌─────┴───────┐    ┌──────┴────────┐    ┌────┴──────────┐
   │  Connection │    │  Query Cache  │    │  Replication  │
   │   Pooling   │    │    (Redis)    │    │  (Standby DB) │
   │  (PgBouncer)│    └───────────────┘    └───────────────┘
   └─────────────┘
```

### External Integrations

```
┌──────────────────────────────────────────┐
│       Payment Gateways                   │
├──────────────────────────────────────────┤
│ 1. M-Pesa (Safaricom Daraja)            │
│    ├── STK Push                          │
│    ├── Callback URL                      │
│    └── Reconciliation                    │
│                                          │
│ 2. Pesapal                               │
│    ├── Redirect Auth                     │
│    ├── Payment Confirmation              │
│    └── Settlement                        │
│                                          │
│ 3. IntaSend                              │
│    ├── Payment Gateway                   │
│    ├── Payout Service                    │
│    └── Disbursement                      │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│       Cloud Services                     │
├──────────────────────────────────────────┤
│ 1. AWS / Google Cloud                    │
│    ├── Compute (EC2/VM)                  │
│    ├── Storage (S3/GCS)                  │
│    ├── CDN (CloudFront)                  │
│    └── Database (RDS)                    │
│                                          │
│ 2. Email Service                         │
│    ├── SendGrid / AWS SES                │
│    └── Transactional Emails              │
│                                          │
│ 3. SMS Service                           │
│    ├── Twilio                            │
│    └── 2FA / Notifications               │
│                                          │
│ 4. Monitoring & Logging                  │
│    ├── Sentry (Error Tracking)           │
│    ├── Datadog (Monitoring)              │
│    └── ELK Stack (Logging)               │
└──────────────────────────────────────────┘
```

### Caching Strategy

```
┌────────────────────────────────────────────────┐
│            Application Cache Layer             │
│  Redis (Primary Cache)                         │
│  ├── Session Cache (TTL: 1 hour)              │
│  │   └── User sessions, tokens                │
│  ├── User Cache (TTL: 5 minutes)              │
│  │   └── Player profiles, rankings            │
│  ├── Tournament Cache (TTL: 30 seconds)       │
│  │   └── Active tournaments, brackets         │
│  ├── Leaderboard Cache (TTL: 1 minute)       │
│  │   └── League rankings                      │
│  ├── Rate Limit Cache (TTL: 1 hour)          │
│  │   └── API request tracking                 │
│  └── Queue (Job Processing)                   │
│      ├── Email Jobs                           │
│      ├── Payment Processing                   │
│      └── Prize Distribution                   │
└────────────────────────────────────────────────┘
```

---

## API Flow Diagrams

### Tournament Registration Flow
```
Player → Submit Entry → Validate Payment → Process Payment → Update Wallet
                              ↓
                     (M-Pesa/Pesapal)
                              ↓
                     Gateway Callback → Confirm Entry → Send Notification
```

### Match Result Submission Flow
```
Player A → Submit Result → Upload Evidence → Validation Check
                                                     ↓
                              Player B Confirms? → Auto-Approve
                                    ↓
                                No Match → Dispute Flag → Admin Review
                                                     ↓
                              Update League Points/Rankings
```

### Withdrawal Request Flow
```
Player → Request Withdrawal → KYC Check → Balance Validation
                                                ↓
                            Within Limits? → Add to Queue
                                    ↓
                            Admin Review → Approval/Rejection
                                    ↓
                            Process via Payment Gateway
                                    ↓
                            Update Wallet → Send Notification
```

---

## Security Architecture

```
┌─────────────────────────────────────────────┐
│         Security Layers                      │
├─────────────────────────────────────────────┤
│ 1. Network Security                         │
│    ├── HTTPS/TLS 1.3+                       │
│    ├── WAF (Web Application Firewall)       │
│    ├── DDoS Protection                      │
│    └── VPN for Admin Access                 │
│                                             │
│ 2. Authentication                           │
│    ├── JWT with short expiry                │
│    ├── Refresh Token Rotation               │
│    ├── 2FA (SMS/Email/Authenticator)        │
│    └── Device Tracking                      │
│                                             │
│ 3. Authorization                            │
│    ├── Role-Based Access Control (RBAC)     │
│    ├── Resource-Level Permissions           │
│    └── Admin Privilege Checks                │
│                                             │
│ 4. Data Protection                          │
│    ├── Password Hashing (bcrypt)            │
│    ├── Sensitive Data Encryption            │
│    ├── Database Backups (encrypted)         │
│    └── PII Masking in Logs                  │
│                                             │
│ 5. Transaction Security                     │
│    ├── Idempotency Keys                     │
│    ├── Double Entry Bookkeeping             │
│    ├── Payment Verification                 │
│    └── Fraud Detection                      │
│                                             │
│ 6. Compliance                               │
│    ├── KYC Verification                     │
│    ├── AML Checks                           │
│    ├── Data Retention Policies               │
│    └── Audit Logging                        │
└─────────────────────────────────────────────┘
```

---

## Performance Optimization

### Database Indexes Strategy
```
Priority 1 (High Traffic):
- idx_users_email
- idx_tournament_status
- idx_wallets_user_id
- idx_transaction_user_id

Priority 2 (Moderate Traffic):
- idx_league_members_rank
- idx_matches_tournament_id
- idx_kyc_status
- idx_users_created_at

Priority 3 (Reporting/Analytics):
- idx_transactions_created_at
- idx_admin_logs_action
- idx_notifications_user_id
```

### Query Optimization
```sql
-- Use EXPLAIN ANALYZE
EXPLAIN ANALYZE SELECT * FROM tournaments 
WHERE status = 'active' AND created_at > NOW() - INTERVAL 30 DAY;

-- Use connection pooling
MAX_CONNECTIONS: 100
MIN_CONNECTIONS: 10

-- Use prepared statements
Prevent SQL injection + Faster execution
```

---

## Monitoring & Observability

```
┌──────────────────────────────────────┐
│  Application Monitoring Dashboard    │
├──────────────────────────────────────┤
│ Metrics:                             │
│ ├── API Response Times               │
│ ├── Error Rates                      │
│ ├── Database Query Performance       │
│ ├── Cache Hit Ratio                  │
│ ├── Transaction Success Rate         │
│ └── Active Users Count               │
│                                      │
│ Alerts:                              │
│ ├── High Error Rate (>5%)            │
│ ├── Database Connection Pool Full    │
│ ├── Redis Memory >80%                │
│ ├── Payment Gateway Down             │
│ ├── Slow Query Detected              │
│ └── Unauthorized Access Attempts     │
│                                      │
│ Logs:                                │
│ ├── Application Logs (JSON format)  │
│ ├── Audit Logs (User actions)       │
│ ├── Error Logs (Stack traces)       │
│ └── API Request/Response Logs       │
└──────────────────────────────────────┘
```

This architecture ensures scalability, security, and reliability for the Munene Esports Arena platform.
