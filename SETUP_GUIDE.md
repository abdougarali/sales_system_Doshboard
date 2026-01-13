# Setup & Usage Guide

## Prerequisites

Before you start, make sure you have:
- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **MongoDB** running (local or cloud)
  - Local: Install MongoDB Community Edition
  - Cloud: Use MongoDB Atlas (free tier available)

## Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages:
- Next.js
- React
- MongoDB (Mongoose)
- Tailwind CSS
- Heroicons (for icons)

## Step 2: Set Up Environment Variables

1. Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/sales_system

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sales_system

# Session Secret (any random string for security)
SESSION_SECRET=your-random-secret-key-change-this-in-production

# Admin Password (this is your login password)
ADMIN_PASSWORD=your-password-here
```

**Important:** 
- Set `ADMIN_PASSWORD` to the password you want to use for login
- Replace `SESSION_SECRET` with a random string
- For MongoDB Atlas, get your connection string from your cluster dashboard

## Step 3: Start MongoDB

### If using Local MongoDB:

**Windows:**
```bash
# MongoDB should start automatically as a service
# Or start it manually:
net start MongoDB
```

**Mac/Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod
# Or:
brew services start mongodb-community
```

### If using MongoDB Atlas:
- No setup needed, just use your connection string in `.env.local`

## Step 4: Run the Development Server

```bash
npm run dev
```

The server will start at: **http://localhost:3001**

## Step 5: Login

1. Open your browser and go to: `http://localhost:3001`
2. You'll be redirected to the login page
3. Enter the password you set in `ADMIN_PASSWORD`
4. You're now logged in!

## Changing Your Password

To change your password:

1. Open `.env.local` file
2. Change the value of `ADMIN_PASSWORD`:
   ```env
   ADMIN_PASSWORD=your-new-password
   ```
3. Save the file
4. Restart the server (if running): `npm run dev`
5. Login with your new password

**That's it!** No database changes needed.

---

## Using the System

### Dashboard Overview

After logging in, you'll see the main dashboard with:
- **Statistics Cards**: Total Revenue, Monthly comparison, Conversion Rate, etc.
- **Quick Actions**: Links to add new leads, products, or orders
- **Charts**: Orders by status, Leads by platform
- **Top Products & Low Stock Alerts**

### Managing Leads

**View All Leads:**
- Click "Leads" in the sidebar
- See all brands you've contacted in a table
- View status, platform, reply status, and demo sent status

**Add New Lead:**
1. Click "Leads" → "+ Add New Lead"
2. Fill in:
   - Brand Name (required)
   - Platform (Instagram/Messenger/WhatsApp)
   - Instagram Handle (optional)
   - Date Contacted
   - Status (New, Contacted, Replied, Demo Sent, Converted, Lost)
   - Reply Status
   - Interest Level
   - Notes
3. **See the message template** based on selected status
4. Click "Create Lead"

**Message Templates:**
When you select a status, a pre-written Arabic message template appears. Click "Copy Message" to copy it and send to the brand!

**Lead Status Pipeline:**
- **New**: Just added, not contacted yet
- **Contacted**: Initial message sent
- **Replied**: Brand replied to your message
- **Demo Sent**: Demo website sent
- **Converted**: Successfully converted to customer
- **Lost**: Not interested or no response

### Managing Products

**View All Products:**
- Click "Products" in the sidebar
- See all products with price, stock, and status

**Add New Product:**
1. Click "Products" → "+ Add New Product"
2. Fill in:
   - Product Name (English) - required
   - Product Name (Arabic) - optional
   - Price - required (must be ≥ 0)
   - Stock Quantity - required (must be ≥ 0)
   - Description (English & Arabic) - optional
   - Image URL - optional
   - Active checkbox - checked by default
3. Click "Create Product"

**Activate/Deactivate Product:**
- Click "Activate" or "Deactivate" button on product row
- Inactive products won't appear in order creation

### Managing Orders

**View All Orders:**
- Click "Orders" in the sidebar
- See all orders with customer info, products, total, and status

**Create New Order:**
1. Click "Orders" → "+ Create New Order"
2. Fill in customer information:
   - Customer Name (required)
   - Customer Phone (required)
   - Customer Address (optional)
3. Add Products:
   - Click "+ Add Product"
   - Select product from dropdown
   - Enter quantity
   - Total is calculated automatically
4. Click "Create Order"

**Update Order Status:**
- New → Confirmed → In Progress → Delivered
- Or mark as Cancelled
- **Completed orders are counted in Total Revenue**

---

## Navigation

The sidebar provides quick access to:
- **Dashboard**: Overview and statistics
- **Leads**: Brand outreach management
- **Products**: Product catalog
- **Orders**: Customer orders

## Logout

Click "Logout" button in the top-right corner to log out.

---

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify your `MONGODB_URI` in `.env.local` is correct
- For Atlas: Check your IP whitelist and credentials

### Login Issues
- Make sure `ADMIN_PASSWORD` is set in `.env.local`
- Check for typos in the password
- Restart the server after changing the password

### Products Not Showing in Order Form
- Check if product is marked as "Active"
- Check if product has stock > 0
- Only active products with stock appear in order creation

---

## Production Deployment

For production:
1. Set `NODE_ENV=production` in `.env.local`
2. Generate a strong `SESSION_SECRET`
3. Set a strong `ADMIN_PASSWORD`
4. Use a secure MongoDB connection
5. Build the app: `npm run build`
6. Start: `npm start`

---

## Environment Variables Summary

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ Yes |
| `SESSION_SECRET` | Random string for session security | ✅ Yes |
| `ADMIN_PASSWORD` | Your login password | ✅ Yes |

---

The system is ready to use! 🚀
