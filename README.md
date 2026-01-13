# Sales Outreach & Order Management System

A professional internal admin dashboard for managing sales outreach to small Arabic brands and managing orders.

## Tech Stack

- **Next.js 14+** (App Router)
- **React** with TypeScript
- **MongoDB** with Mongoose
- **Tailwind CSS** for styling
- **Simple password-based authentication** (single admin)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance running (local or cloud)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/sales_system
SESSION_SECRET=your-secret-key-here-change-in-production
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
sales_system/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── leads/             # Lead management components
│   ├── products/          # Product management components
│   └── orders/            # Order management components
├── lib/
│   ├── db/                # Database connection
│   ├── models/            # Mongoose models
│   └── utils/             # Utility functions
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## Data Models

### User
- Admin authentication
- Password-only login (single admin)

### Lead
- Brand information
- Outreach tracking
- Status pipeline

### Product
- Product catalog
- Price and stock management
- Active/inactive status

### Order
- Customer orders
- Product line items
- Status tracking

## Features

- ✅ Lead/Brand management
- ✅ Product CRUD operations
- ✅ Order management
- ✅ Admin authentication
- ✅ Dashboard overview

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   - Copy `.env.example` to `.env`
   - Add your MongoDB connection string
   - Add a session secret

3. **Start MongoDB** (if using local)

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **First login:**
   - Go to http://localhost:3000
   - Enter any password (this becomes your admin password)
   - System auto-creates admin user

## Detailed Setup

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for complete setup instructions and usage guide.

## Development

- Follow the project plan in `PROJECT_PLAN.md`
- Build features step by step
- Keep it simple and production-ready
- No external APIs in MVP
- Manual outreach only

## License

Private project
