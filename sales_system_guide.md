You are a senior full-stack engineer and product designer.

Your task is to BUILD a clean, professional internal sales dashboard
for selling websites to small Arabic brands.

IMPORTANT RULES:
- Build step by step
- Start with MVP
- No external APIs
- Manual outreach only
- Clean logic and simple UX
- Production-ready code
- Explain each file briefly

TECH STACK:
- Next.js (App Router)
- React (simple)
- MongoDB (Mongoose)
- Tailwind CSS
- Local authentication (admin only)

START WITH:
1. Project structure
2. MongoDB schemas
3. Core pages:
   - Brand list
   - Brand detail
   - Status pipeline
   - Message generator
4. Simple UI (admin dashboard)

DO NOT:
- Add automation
- Add Instagram APIs
- Over-engineer

Then continue implementing features described below.







# Sales Outreach & Order Management System (Pro Guide)

## 1. Goal of the System
The goal of this system is to **help you sell a simple order-management / sales solution** to multiple small Arabic brands efficiently.
It allows you to:
- Find good brands
- Contact them with professional Arabic messages
- Track replies
- Send a demo website
- Convert free audit → paid fix
- Manage everything in **one logical workflow**

This system is designed to be **simple, scalable, and professional**, without needing complex APIs at the beginning.

---

## 2. Business Model (Simple)
**Free Audit → Paid Fix**

- You analyze the brand’s current order situation (Instagram DMs, WhatsApp chaos, no tracking).
- You show them problems + missed sales.
- You offer a **paid solution**:
  - Order page
  - Admin dashboard
  - Product management
  - Order tracking

---

## 3. Workflow – How YOU Will Use the System

### Step 1: Choose the Right Brand
You DO NOT contact everyone.

Good brand criteria:
- Followers: **1k – 50k**
- Posts: Active (at least 2–3 per week)
- Comments: Real people asking about price / availability
- Sales via DMs or WhatsApp (not website)
- Product-based business (food, perfume, clothes, accessories)

Bad brands:
- No comments
- Dropshipping pages with fake engagement
- Huge brands (already have systems)

---

### Step 2: Send Outreach Message
You send a **short Arabic DM** (not selling, not pushing).

Platform priority:
1. **Instagram DM** (best)
2. Messenger (if linked to FB page)
3. WhatsApp (ONLY if number is public)

---

### Step 3: Track Replies
You track brands in a simple table:
- Brand name
- Platform
- Date contacted
- Reply (Yes / No)
- Status (Interested / Seen / No reply)
- Demo sent?

(You can automate this later, but manual first = better learning)

---

### Step 4: Send Demo Website
If they reply → you send:
- Demo order page
- Screenshot / short explanation
- Clear value (less chaos, more orders)

---

### Step 5: Close the Deal
You offer:
- Setup
- Customization
- Monthly or one-time payment

---

## 4. System Features (What You Are Selling)

### Admin Dashboard
- Login (admin only)
- View orders
- Order status (new / confirmed / delivered)
- Customer info
- Export orders

### Product Management
YES — **admin MUST manage products**:
- Create product
- Update price / stock
- Delete product
- Activate / deactivate product

This is VERY important for real businesses.

---

## 5. Do You Need APIs?
### Short answer: ❌ NO (at first)

Why?
- Same database
- Same app
- Orders saved directly

You will need APIs later ONLY if:
- Mobile app
- External delivery service
- Payment gateway

---

## 6. Technology Stack (Simple & Pro)

### Frontend
- **Next.js**
- React components
- Tailwind CSS

### Backend
- Next.js API routes
- Server Actions (optional)

### Database
- **MongoDB**
- Collections:
  - Users
  - Products
  - Orders
  - Leads (brands contacted)

### Auth
- Simple email/password
- Admin role only

---

## 7. Prompt for Cursor AI (Core Prompt)

Use this prompt inside Cursor AI:

"""
You are a senior full-stack developer.
Build a professional order management system for small Arabic brands.

Requirements:
- Next.js app
- Admin dashboard
- Product CRUD
- Order creation & tracking
- MongoDB database
- Clean UI
- Arabic-friendly layout (RTL ready)
- Simple authentication

Focus on logic, clarity, and scalability.
"""

---

## 8. Arabic Outreach Messages (Copy & Paste)

### Message 1 – First Contact
السلام عليكم  
تابعت صفحة البراند متاعكم وحبيت نوريكم فكرة بسيطة تنجم تنظّم الطلبات وتخفف ضغط الرسائل في الإنستغرام وواتساب.  
إذا تحبوا، نبعثلكم مثال عملي تشوفوه.

---

### Message 2 – After Reply
تمام 👍  
هذا مثال لصفحة طلبات بسيطة مع لوحة تحكم للإدارة، تنجموا من خلالها:
- تجمعوا الطلبات في بلاصة وحدة  
- تتحكموا في المنتجات  
- ما يضيع حتى طلب  

نبعثلكم الرابط تشوفوه؟

---

### Message 3 – Follow-up (No Reply)
مرحبا، حبيت نرجعلكم بخصوص الرسالة السابقة.  
الفكرة فقط لتنظيم الطلبات وتسهيل البيع، بدون التزام.  
كان تحبوا نشوفوها مع بعضنا 👍

---

## 9. Design Inspiration (UI/UX)

Look for inspiration from:
- Stripe Dashboard
- Shopify Admin
- Vercel Dashboard
- Notion UI
- Linear App

Keywords to search:
- "Admin dashboard clean UI"
- "Order management system UI"
- "SaaS dashboard minimal"

---

## 10. Why This System Helps You
- You look professional
- You save time
- You can handle many brands
- You build a real product (not just service)
- You can scale later to SaaS

---

## Final Advice
Start SIMPLE.
Manual first.
Then automate.
Do not overbuild.

This is how real operators work.
