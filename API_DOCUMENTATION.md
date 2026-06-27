# Munene Esports Arena - API Documentation

## Base URL
```
Production: https://api.muneneesports.com/v1
Staging: https://staging-api.muneneesports.com/v1
```

---

## Authentication

### JWT Token Format
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

### Headers
```
Authorization: Bearer {access_token}
Content-Type: application/json
X-Request-ID: {uuid}
```

---

## Authentication Endpoints

### POST /auth/register
Register a new player account.

**Request:**
```json
{
  "email": "player@example.com",
  "username": "Champion_Ken",
  "password": "SecurePass123!",
  "country": "KE",
  "dateOfBirth": "1995-06-15",
  "agreeToTerms": true
}
```

**Response:** `201 Created`
```json
{
  "id": "P001",
  "email": "player@example.com",
  "username": "Champion_Ken",
  "kycStatus": "pending",
  "emailVerified": false,
  "createdAt": "2026-06-26T10:30:00Z"
}
```

---

### POST /auth/login
Authenticate and receive access tokens.

**Request:**
```json
{
  "email": "player@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "P001",
    "username": "Champion_Ken",
    "email": "player@example.com",
    "rank": 4500
  }
}
```

---

### POST /auth/2fa/verify
Verify two-factor authentication code.

**Request:**
```json
{
  "userId": "P001",
  "code": "123456",
  "method": "sms"
}
```

**Response:** `200 OK`
```json
{
  "verified": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Player Endpoints

### GET /players/{playerId}
Get player profile information.

**Response:** `200 OK`
```json
{
  "id": "P001",
  "username": "Champion_Ken",
  "email": "ken@example.com",
  "rank": 4500,
  "totalWinnings": 5000,
  "tournamentCount": 3,
  "leagueCount": 2,
  "joinedAt": "2025-06-15",
  "kycStatus": "approved",
  "profilePicture": "https://cdn.muneneesports.com/profiles/P001.jpg",
  "stats": {
    "wins": 28,
    "losses": 5,
    "winRate": 84.8,
    "goalsFor": 145,
    "goalsAgainst": 32
  }
}
```

---

### PUT /players/{playerId}/profile
Update player profile.

**Request:**
```json
{
  "username": "Champion_Ken_Pro",
  "bio": "Professional eFootball player",
  "profilePicture": "base64_encoded_image"
}
```

**Response:** `200 OK`
```json
{
  "message": "Profile updated successfully"
}
```

---

## KYC Endpoints

### POST /kyc/submit
Submit KYC verification documents.

**Request:**
```json
{
  "idType": "national_id",
  "idNumber": "12345678",
  "fullName": "Kenneth Omondi",
  "dateOfBirth": "1995-06-15",
  "phoneNumber": "+254712345678",
  "idDocument": "base64_encoded_file",
  "selfie": "base64_encoded_file"
}
```

**Response:** `201 Created`
```json
{
  "kycId": "KYC001",
  "status": "pending",
  "submittedAt": "2026-06-26T10:30:00Z",
  "estimatedProcessingTime": "24-48 hours"
}
```

---

### GET /kyc/status
Get KYC verification status.

**Response:** `200 OK`
```json
{
  "status": "approved",
  "approvedAt": "2026-06-26T14:30:00Z",
  "documents": {
    "idVerified": true,
    "phoneVerified": true,
    "emailVerified": true,
    "selfieVerified": true
  }
}
```

---

## Wallet Endpoints

### GET /wallet/balance
Get current wallet balance.

**Response:** `200 OK`
```json
{
  "balance": 2500,
  "currency": "KES",
  "lastUpdated": "2026-06-26T10:30:00Z",
  "pendingDeposits": 0,
  "pendingWithdrawals": 1000
}
```

---

### POST /wallet/deposit
Initiate deposit transaction.

**Request:**
```json
{
  "amount": 1000,
  "gateway": "mpesa",
  "phoneNumber": "+254712345678"
}
```

**Response:** `201 Created`
```json
{
  "transactionId": "TXN001",
  "status": "pending",
  "amount": 1000,
  "gateway": "mpesa",
  "stkPush": {
    "checkoutRequestId": "ws_CO_26062026103000ac45cf9a22c3d0",
    "responseCode": "0",
    "responseDescription": "Success. Request accepted for processing"
  }
}
```

---

### POST /wallet/withdraw
Request withdrawal of funds.

**Request:**
```json
{
  "amount": 500,
  "method": "mpesa",
  "accountNumber": "254712345678"
}
```

**Response:** `201 Created`
```json
{
  "withdrawalId": "WD001",
  "status": "pending",
  "amount": 500,
  "method": "mpesa",
  "fee": 50,
  "netAmount": 450,
  "estimatedTime": "1-5 minutes"
}
```

---

### GET /wallet/transactions
Get transaction history.

**Query Parameters:**
- `limit`: 10-50 (default: 20)
- `offset`: 0
- `type`: deposit, withdrawal, tournament_entry, prize_payout

**Response:** `200 OK`
```json
{
  "transactions": [
    {
      "id": "TXN001",
      "type": "deposit",
      "amount": 1000,
      "status": "completed",
      "gateway": "mpesa",
      "timestamp": "2026-06-26T10:30:00Z"
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

---

## Tournament Endpoints

### GET /tournaments
List all tournaments with filters.

**Query Parameters:**
- `status`: active, upcoming, completed
- `type`: free, paid, sponsored, invitational
- `league`: bronze, silver, gold, platinum, champions
- `sort`: prize_desc, player_count, entry_fee

**Response:** `200 OK`
```json
{
  "tournaments": [
    {
      "id": 1,
      "name": "eFootball Premier Cup 2026",
      "type": "paid",
      "entryFee": 500,
      "prize": 32000,
      "players": 64,
      "maxPlayers": 128,
      "stage": "Round of 16",
      "status": "active",
      "startDate": "2026-06-26",
      "endDate": "2026-07-15",
      "sponsorId": "SPONSOR001"
    }
  ],
  "total": 12,
  "filters": {
    "status": "active"
  }
}
```

---

### GET /tournaments/{tournamentId}
Get tournament details.

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "eFootball Premier Cup 2026",
  "description": "Premier league tournament for top eFootball players",
  "type": "paid",
  "entryFee": 500,
  "prize": 32000,
  "players": 64,
  "maxPlayers": 128,
  "stage": "Round of 16",
  "stageProgress": {
    "current": "Round of 16",
    "completed": ["Group Stage", "Round of 64", "Round of 32"],
    "upcoming": ["Quarter Finals", "Semi Finals", "Final"]
  },
  "prizeDistribution": {
    "1st": { "position": 1, "percentage": 40, "amount": 12800 },
    "2nd": { "position": 2, "percentage": 30, "amount": 9600 },
    "3rd": { "position": 3, "percentage": 20, "amount": 6400 }
  },
  "bracket": {},
  "schedule": [],
  "status": "active"
}
```

---

### POST /tournaments/{tournamentId}/join
Join a tournament.

**Request:**
```json
{
  "playerId": "P001"
}
```

**Response:** `201 Created`
```json
{
  "tournamentId": 1,
  "playerId": "P001",
  "joinedAt": "2026-06-26T10:30:00Z",
  "status": "active",
  "walletDeduction": 500
}
```

---

## League Endpoints

### GET /leagues
List all leagues.

**Query Parameters:**
- `tier`: bronze, silver, gold, platinum, champions

**Response:** `200 OK`
```json
{
  "leagues": [
    {
      "id": 1,
      "name": "Bronze League",
      "tier": "bronze",
      "entryFee": 200,
      "members": 500,
      "minRank": 0,
      "seasonStart": "2026-06-01",
      "seasonEnd": "2026-08-31"
    }
  ]
}
```

---

### POST /leagues/{leagueId}/join
Join a league.

**Request:**
```json
{
  "playerId": "P001"
}
```

**Response:** `201 Created`
```json
{
  "leagueId": 1,
  "playerId": "P001",
  "joinedAt": "2026-06-26T10:30:00Z",
  "currentRank": 500,
  "seasonPoints": 0
}
```

---

## Match Endpoints

### POST /matches/submit-result
Submit match result.

**Request:**
```json
{
  "matchId": "M001",
  "playerId": "P001",
  "opponentId": "P002",
  "score": "3-1",
  "screenshot": "base64_encoded_image",
  "matchEvidence": "base64_encoded_video"
}
```

**Response:** `201 Created`
```json
{
  "resultId": "RES001",
  "matchId": "M001",
  "status": "pending_approval",
  "submittedAt": "2026-06-26T10:30:00Z",
  "estimatedApprovalTime": "24-48 hours"
}
```

---

### GET /matches/history
Get player match history.

**Query Parameters:**
- `playerId`: Player ID (required)
- `status`: pending, approved, disputed, completed
- `limit`: 20

**Response:** `200 OK`
```json
{
  "matches": [
    {
      "id": "M001",
      "opponent": "ProShooter_88",
      "score": "3-1",
      "result": "win",
      "date": "2026-06-26T10:30:00Z",
      "pointsEarned": 150
    }
  ],
  "total": 28,
  "stats": {
    "wins": 28,
    "losses": 5,
    "winRate": 84.8
  }
}
```

---

## Admin Endpoints

### GET /admin/dashboard
Get admin dashboard analytics.

**Response:** `200 OK`
```json
{
  "overview": {
    "totalUsers": 2547,
    "totalRevenue": 125000,
    "activeTourn": 8,
    "pendingWithdrawals": 12
  },
  "userGrowth": [
    { "month": "June", "users": 340 }
  ],
  "revenueBreakdown": {
    "tournamentFees": 56250,
    "commissions": 37500,
    "premiumMembers": 18750,
    "sponsorships": 12500
  }
}
```

---

### GET /admin/kyc/pending
Get pending KYC verifications.

**Response:** `200 OK`
```json
{
  "pending": [
    {
      "kycId": "KYC001",
      "playerId": "P001",
      "username": "Champion_Ken",
      "submittedAt": "2026-06-26T10:30:00Z",
      "documents": {
        "id": "verified",
        "selfie": "pending",
        "phone": "verified"
      }
    }
  ],
  "total": 15
}
```

---

### POST /admin/kyc/approve
Approve KYC verification.

**Request:**
```json
{
  "kycId": "KYC001",
  "notes": "All documents verified"
}
```

**Response:** `200 OK`
```json
{
  "message": "KYC approved successfully",
  "playerId": "P001",
  "canWithdraw": true
}
```

---

### GET /admin/withdrawals/pending
Get pending withdrawals.

**Response:** `200 OK`
```json
{
  "withdrawals": [
    {
      "id": "WD001",
      "playerId": "P001",
      "username": "Champion_Ken",
      "amount": 500,
      "method": "mpesa",
      "requestedAt": "2026-06-26T10:30:00Z",
      "fee": 50,
      "netAmount": 450
    }
  ],
  "total": 12
}
```

---

### POST /admin/withdrawals/approve
Approve withdrawal.

**Request:**
```json
{
  "withdrawalId": "WD001",
  "processedBy": "ADMIN001"
}
```

**Response:** `200 OK`
```json
{
  "message": "Withdrawal approved and processing",
  "withdrawalId": "WD001",
  "estimatedDelivery": "1-5 minutes"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "invalid_request",
  "message": "Missing required field: amount",
  "statusCode": 400
}
```

### 401 Unauthorized
```json
{
  "error": "unauthorized",
  "message": "Invalid or expired token",
  "statusCode": 401
}
```

### 403 Forbidden
```json
{
  "error": "forbidden",
  "message": "You don't have permission to access this resource",
  "statusCode": 403
}
```

### 404 Not Found
```json
{
  "error": "not_found",
  "message": "Tournament not found",
  "statusCode": 404
}
```

### 429 Too Many Requests
```json
{
  "error": "rate_limit",
  "message": "Too many requests. Please try again later",
  "retryAfter": 60
}
```

### 500 Internal Server Error
```json
{
  "error": "internal_error",
  "message": "An unexpected error occurred",
  "requestId": "req_26062026_123456"
}
```

---

## Webhook Events

### tournament.created
```json
{
  "event": "tournament.created",
  "timestamp": "2026-06-26T10:30:00Z",
  "data": {
    "tournamentId": 1,
    "name": "Premier Cup",
    "entryFee": 500
  }
}
```

### player.kyc_approved
```json
{
  "event": "player.kyc_approved",
  "timestamp": "2026-06-26T10:30:00Z",
  "data": {
    "playerId": "P001",
    "username": "Champion_Ken"
  }
}
```

### payment.completed
```json
{
  "event": "payment.completed",
  "timestamp": "2026-06-26T10:30:00Z",
  "data": {
    "transactionId": "TXN001",
    "playerId": "P001",
    "amount": 1000,
    "gateway": "mpesa"
  }
}
```

---

## Rate Limits

- Public endpoints: 100 requests/minute
- Authenticated endpoints: 300 requests/minute
- Admin endpoints: 500 requests/minute

---

## Security

- All endpoints use HTTPS/TLS 1.3+
- JWT tokens expire after 1 hour
- Refresh tokens expire after 7 days
- API keys should be rotated quarterly
- All passwords hashed with bcrypt (salt rounds: 12)
- 2FA required for sensitive operations
