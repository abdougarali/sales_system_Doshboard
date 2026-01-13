# Sales Outreach & Order Management System - Project Plan

## Project Overview
A professional internal admin dashboard for managing sales outreach to small Arabic brands and managing orders for the order management system being sold.

## Business Model
**Free Audit → Paid Fix**
- Analyze brand's current order situation
- Show problems + missed sales
- Offer paid solution: Order page, Admin dashboard, Product management, Order tracking

## Core Features

### 1. Lead/Brand Management
- Track brands contacted for outreach
- Fields:
  - Brand name
  - Instagram handle
  - Platform (Instagram/Messenger/WhatsApp)
  - Date contacted
  - Reply status (Yes/No/Seen/No reply)
  - Interest level (Interested/Not interested/Pending)
  - Demo sent (Yes/No)
  - Notes
  - Status pipeline (New → Contacted → Replied → Demo Sent → Converted → Lost)

### 2. Product Management (CRUD)
- Create product
- Update product (price, stock, details)
- Delete product
- Activate/Deactivate product
- Fields:
  - Name (Arabic/English)
  - Description
  - Price
  - Stock quantity
  - Image URL
  - Active status
  - Created/Updated dates

### 3. Order Management
- Create orders
- Track order status (New → Confirmed → In Progress → Delivered → Cancelled)
- View customer info
- Export orders
- Fields:
  - Order number (auto-generated)
  - Customer name
  - Customer phone
  - Customer address
  - Products (array with quantity)
  - Total amount
  - Status
  - Notes
  - Created/Updated dates

### 4. Admin Authentication
- **Simple password-only login** (single admin user)
- Password stored in database (hashed with bcrypt)
- Session-based authentication with cookies
- Protected routes via middleware
- Auto-initializes admin on first login

### 5. Dashboard Overview
- Statistics:
  - Total leads
  - Active leads (in pipeline)
  - Converted leads
  - Total orders
  - Orders by status
  - Revenue (if applicable)
- Recent activity
- Quick actions

## Technical Stack

### Frontend
- **Next.js 14+** (App Router)
- **React** (simple components)
- **Tailwind CSS** (styling)
- **TypeScript** (type safety)

### Backend
- **Next.js API Routes** (server-side logic)
- **Server Actions** (form handling)

### Database
- **MongoDB** (via Mongoose)
- Collections:
  - `users` (admin users)
  - `leads` (brands contacted)
  - `products` (product catalog)
  - `orders` (customer orders)

### Authentication
- **Simple password-only authentication**
- Single admin user (stored in MongoDB)
- Session cookies (24-hour expiration)
- Middleware for route protection
- bcryptjs for password hashing

### UI/UX Design Principles
- Clean, minimal design
- Inspired by: Stripe Dashboard, Shopify Admin, Vercel Dashboard
- RTL-ready for Arabic content
- Responsive design
- Logical navigation
- Clear status indicators
- Simple forms

## Project Structure

```
sales_system/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── leads/
│   │   ├── products/
│   │   └── orders/
│   ├── api/
│   │   ├── auth/
│   │   ├── leads/
│   │   ├── products/
│   │   └── orders/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (reusable UI components)
│   ├── leads/
│   ├── products/
│   └── orders/
├── lib/
│   ├── db/ (MongoDB connection)
│   ├── models/ (Mongoose schemas)
│   └── utils/
├── types/
│   └── index.ts
├── public/
└── package.json
```

## Data Models

### User Model (Simplified - Single Admin)
```typescript
{
  password: string (hashed, required)
  createdAt: Date
  updatedAt: Date
}
```

### Lead Model
```typescript
{
  brandName: string (required)
  instagramHandle: string
  platform: 'instagram' | 'messenger' | 'whatsapp' (required)
  dateContacted: Date
  replyStatus: 'yes' | 'no' | 'seen' | 'no_reply'
  interestLevel: 'interested' | 'not_interested' | 'pending'
  demoSent: boolean (default: false)
  status: 'new' | 'contacted' | 'replied' | 'demo_sent' | 'converted' | 'lost'
  notes: string
  createdAt: Date
  updatedAt: Date
}
```

### Product Model
```typescript
{
  name: string (required)
  nameAr: string (Arabic name, optional)
  description: string
  descriptionAr: string (Arabic description, optional)
  price: number (required, min: 0)
  stock: number (required, min: 0)
  imageUrl: string
  active: boolean (default: true)
  createdAt: Date
  updatedAt: Date
}
```

### Order Model
```typescript
{
  orderNumber: string (unique, auto-generated, required)
  customerName: string (required)
  customerPhone: string (required)
  customerAddress: string
  products: Array<{
    productId: ObjectId (ref: Product)
    quantity: number (min: 1)
    price: number (snapshot at time of order)
  }>
  totalAmount: number (required, calculated)
  status: 'new' | 'confirmed' | 'in_progress' | 'delivered' | 'cancelled'
  notes: string
  createdAt: Date
  updatedAt: Date
}
```

## MVP Features (Phase 1)

### Must Have
1. ✅ Admin login/logout
2. ✅ Lead list view (table)
3. ✅ Lead detail view
4. ✅ Create/Edit lead
5. ✅ Lead status pipeline
6. ✅ Product list view
7. ✅ Create/Edit/Delete product
8. ✅ Order list view
9. ✅ Create/Edit order
10. ✅ Order status management
11. ✅ Dashboard overview with stats

### Nice to Have (Phase 2)
- Export orders to CSV
- Search and filters
- Pagination
- Image upload for products
- Order history/audit log
- Advanced analytics

## Implementation Phases

### Phase 1: Foundation (MVP)
1. Project setup (Next.js, dependencies)
2. Database connection (MongoDB)
3. Data models (Mongoose schemas)
4. Authentication system
5. Basic layout and navigation

### Phase 2: Lead Management
1. Lead list page
2. Lead detail page
3. Create/Edit lead form
4. Status pipeline view
5. Lead filtering

### Phase 3: Product Management
1. Product list page
2. Create/Edit product form
3. Delete product
4. Activate/Deactivate toggle

### Phase 4: Order Management
1. Order list page
2. Create order form
3. Edit order
4. Status updates
5. Order detail view

### Phase 5: Dashboard & Polish
1. Dashboard overview
2. Statistics cards
3. Recent activity
4. UI/UX refinements
5. RTL support for Arabic

## Design Guidelines

### Color Scheme
- Primary: Professional blue (#3B82F6 or similar)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)
- Neutral: Gray scale for backgrounds and text

### Typography
- Clean, readable sans-serif font
- Proper hierarchy (headings, body, captions)
- Support for Arabic text

### Components
- Cards for content sections
- Tables for lists
- Forms with clear labels
- Buttons with clear actions
- Status badges with colors
- Modals for confirmations

## Security Considerations
- Password hashing (bcrypt)
- Session management
- Protected API routes
- Input validation
- XSS prevention
- CSRF protection

## Development Guidelines
- TypeScript for type safety
- Component-based architecture
- Reusable UI components
- Clean code principles
- Error handling
- Loading states
- Form validation

## Testing Strategy (Future)
- Unit tests for utilities
- Integration tests for API routes
- E2E tests for critical flows

## Deployment Considerations
- Environment variables for:
  - MongoDB connection string
  - NextAuth secret
  - Admin credentials
- Production build optimization
- Error logging
- Performance monitoring

## Notes
- No external APIs in MVP
- Manual outreach only
- No automation features
- Keep it simple and production-ready
- Focus on core functionality first
- Arabic-friendly but not Arabic-only
