# CipherNest - Password Manager Vault

CipherNest is a full-featured, production-grade MERN stack password manager vault, inspired by commercial tools like LastPass and Bitwarden. It provides secure, zero-knowledge password management with a modern, responsive UI.

## Features
- User authentication (JWT, refresh tokens, 2FA via email OTP)
- Secure password vault (AES-256-GCM encryption, client-side decryption)
- Password generator, health meter, analytics dashboard
- Device/session management, activity logs
- Export/import encrypted vault
- Responsive, glassmorphism UI with dark/light mode

## Tech Stack
- MongoDB, Mongoose, Express.js, Node.js
- React.js, TailwindCSS, Framer Motion
- JWT, Bcrypt, Nodemailer, dotenv
- Axios, React Router DOM, Zxcvbn, Heroicons

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local or Atlas)

### Setup
1. Clone/download this repository.
2. Copy `.env.example` to `.env` in both `/server` and `/client` (fill in secrets).
3. Install dependencies:
   - `cd server && npm install`
   - `cd ../client && npm install`
4. In the root, run: `npm run dev` (runs both client & server with concurrently)

### Test User
- Email: `test@ciphervault.com`
- Password: `Test@1234!`

## Security Best Practices Used
- Zero-knowledge encryption (server never sees plain passwords)
- Bcrypt password hashing
- JWT with refresh tokens (HTTP-only cookies)
- Rate limiting, IP blocking, CSRF/XSS protection
- HTTPS enforcement
- Strong password requirements

## Scripts
- `npm run dev` - Run client & server together
- `npm run seed` - Seed database with sample data

## License
MIT
