# Authentication System - Simplified

## Overview
Simple password-only authentication for a single admin user. No email, no usernames - just a password.

## How It Works

### 1. Password Storage
- Password is hashed using `bcryptjs` and stored in MongoDB
- Single admin user record in the `users` collection
- Auto-initialized on first login (if no admin exists)

### 2. Login Flow
1. User enters password on `/login` page
2. Password is sent to `/api/auth/login`
3. System checks if admin exists:
   - If not, creates admin with provided password
   - If exists, verifies password against hash
4. On success, creates session cookie
5. Redirects to dashboard

### 3. Session Management
- Session token stored in HTTP-only cookie (`admin_session`)
- Cookie expires after 24 hours
- Session verified on each request via middleware
- Protected routes automatically redirect to login if not authenticated

### 4. Protected Routes
- All routes except `/login` and `/api/auth/*` are protected
- Middleware checks authentication before allowing access
- Unauthenticated users are redirected to `/login`

## Files Created

### Authentication Utilities
- **`lib/auth/session.ts`** - Session management functions
  - `createSession()` - Generate session token
  - `verifySession()` - Verify session validity
  - `isAuthenticated()` - Check if user is logged in (server-side)
  - `getSession()` - Get session from cookies (server-side)

- **`lib/auth/password.ts`** - Password hashing and verification
  - `hashPassword()` - Hash password with bcrypt
  - `verifyPassword()` - Verify password against hash
  - `getAdminPasswordHash()` - Get admin password from DB or env
  - `initializeAdmin()` - Create admin user on first setup

### API Routes
- **`app/api/auth/login/route.ts`** - Login endpoint
  - POST: Accepts password, verifies, creates session

- **`app/api/auth/logout/route.ts`** - Logout endpoint
  - POST: Clears session cookie

- **`app/api/auth/check/route.ts`** - Check authentication status
  - GET: Returns `{ authenticated: boolean }`

### Middleware
- **`middleware.ts`** - Route protection
  - Protects all routes except public ones
  - Redirects to login if not authenticated

### Login Page
- **`app/login/page.tsx`** - Simple password login form
- **`app/login/layout.tsx`** - Login page layout

## Updated Models

### User Model (Simplified)
```typescript
{
  password: string (hashed, required)
  createdAt: Date
  updatedAt: Date
}
```

- Removed: `email`, `role` fields
- Kept: `password` (hashed), timestamps

## Environment Variables

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/sales_system

# Session Secret (for cookie encryption)
SESSION_SECRET=your-secret-key-here-change-in-production

# Optional: Pre-hashed password (if you want to set it manually)
# ADMIN_PASSWORD_HASH=your-bcrypt-hash-here
```

## Usage

### First Time Setup
1. Start the application
2. Go to `/login`
3. Enter any password
4. System will create admin user with that password
5. You're logged in!

### Subsequent Logins
1. Go to `/login`
2. Enter the password you set initially
3. You're logged in!

### Changing Password
Currently, password change requires:
- Direct database update, OR
- Delete admin user and login again with new password

(Password change feature can be added later if needed)

## Security Features

✅ Password hashing with bcrypt (10 salt rounds)
✅ HTTP-only cookies (prevents XSS)
✅ Secure cookies in production (HTTPS only)
✅ Session expiration (24 hours)
✅ Middleware protection for all routes
✅ No password in logs or responses

## Next Steps

The authentication system is complete and ready to use. You can now:
1. Build the dashboard layout
2. Create protected pages
3. Add features that require authentication

All routes are automatically protected - just build your pages and they'll be secured!
