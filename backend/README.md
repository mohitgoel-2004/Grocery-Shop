# Grocery Delivery Backend

Production-ready Node.js and Express backend for OTP login, user profile, and delivery location updates.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv
- cors
- cookie-parser
- express-validator

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`.

3. Start the development server:

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

## API Endpoints

### POST /api/auth/send-otp

Request body:

```json
{
  "mobile": "9876543210"
}
```

Sample response:

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "mobile": "9876543210",
    "userId": "66c2f0d8f7f0e91f0a1e0f11",
    "expiresAt": "2026-07-01T10:05:00.000Z",
    "otp": "123456"
  }
}
```

`otp` is returned only in development mode.

### POST /api/auth/verify-otp

Request body:

```json
{
  "mobile": "9876543210",
  "otp": "123456"
}
```

Sample response:

```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "tokenType": "Bearer",
    "user": {
      "_id": "66c2f0d8f7f0e91f0a1e0f11",
      "mobile": "9876543210",
      "address": "",
      "isVerified": true,
      "createdAt": "2026-07-01T09:59:00.000Z",
      "updatedAt": "2026-07-01T10:00:00.000Z"
    }
  }
}
```

### PUT /api/user/location

Protected route.

Headers:

```http
Authorization: Bearer <accessToken>
```

Request body:

```json
{
  "address": "123 MG Road, Bengaluru, Karnataka 560001"
}
```

Sample response:

```json
{
  "success": true,
  "message": "Location updated successfully",
  "data": {
    "user": {
      "_id": "66c2f0d8f7f0e91f0a1e0f11",
      "mobile": "9876543210",
      "address": "123 MG Road, Bengaluru, Karnataka 560001",
      "isVerified": true,
      "createdAt": "2026-07-01T09:59:00.000Z",
      "updatedAt": "2026-07-01T10:02:00.000Z"
    }
  }
}
```

### GET /api/user/profile

Protected route.

Headers:

```http
Authorization: Bearer <accessToken>
```

Sample response:

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "user": {
      "_id": "66c2f0d8f7f0e91f0a1e0f11",
      "mobile": "9876543210",
      "address": "123 MG Road, Bengaluru, Karnataka 560001",
      "isVerified": true,
      "createdAt": "2026-07-01T09:59:00.000Z",
      "updatedAt": "2026-07-01T10:02:00.000Z"
    }
  }
}
```

## Notes

- OTP expires after 5 minutes.
- OTP records are deleted after successful verification.
- The OTP provider is abstracted so Twilio or Firebase can be added later.
- In development, the generated OTP is returned in the response for frontend testing.