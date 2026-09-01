# TaxEase Backend

Node.js + Express + MongoDB backend for the TaxEase app. Handles real user
signup/login (with hashed passwords + JWT tokens) and stores income/expense
transactions in a database instead of the browser's localStorage.

## Setup

1. Install [Node.js](https://nodejs.org) (v18 or higher) if you don't have it.

2. Install MongoDB — either:
   - Install MongoDB locally ([download here](https://www.mongodb.com/try/download/community)), or
   - Create a free cloud database at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (easier, no local install)

3. Open a terminal in this folder and install dependencies:
   ```
   npm install
   ```

4. Copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
   Then open `.env` and fill in:
   - `MONGO_URI` — your MongoDB connection string
   - `JWT_SECRET` — any long random string (used to sign login tokens)

5. Start the server:
   ```
   npm run dev
   ```
   (or `npm start` if you don't have nodemon)

   You should see:
   ```
   ✅ MongoDB connected
   🚀 Server running on http://localhost:5000
   ```

## API Endpoints

### Auth

| Method | Endpoint           | Body                              | Description        |
|--------|---------------------|------------------------------------|---------------------|
| POST   | /api/auth/signup    | `{ name, email, password }`        | Create new account |
| POST   | /api/auth/login     | `{ email, password }`              | Log in, returns token |

Both return: `{ message, token, user: { id, name, email } }`

Save the `token` on the frontend (e.g. in localStorage) and send it with every
request to protected routes as a header:
```
Authorization: Bearer <token>
```

### Transactions (all require the Authorization header above)

| Method | Endpoint                     | Description                     |
|--------|-------------------------------|----------------------------------|
| GET    | /api/transactions             | Get all transactions for the logged-in user |
| POST   | /api/transactions             | Add a transaction `{ type, amount, category, date, description }` |
| DELETE | /api/transactions/:id         | Delete a transaction            |
| GET    | /api/transactions/summary/totals | Get `{ income, expense, balance }` |

## Notes

- Passwords are never stored in plain text — they're hashed with bcrypt.
- Each user only sees their own transactions (enforced on the server, not just the frontend).
- This backend is separate from your `texease.html` frontend. To connect them,
  the frontend's login/signup/transaction forms need to be changed to call
  these API endpoints with `fetch()` instead of using `localStorage` directly.
