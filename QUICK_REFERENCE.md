# AMBEY LIBRARY MANAGEMENT DASHBOARD
## Quick Reference & Setup Guide

---

## 📌 PROJECT SUMMARY

**What is it?**
A web-based library management system for tracking member accounts, monthly fees, and payment reminders via WhatsApp.

**Who uses it?**
- Library administrators
- Staff members managing memberships

**Key Functions:**
- ✅ Member database management
- ✅ Monthly payment tracking
- ✅ Overdue payment identification
- ✅ WhatsApp payment reminders
- ✅ Admin dashboard with analytics
- ✅ PDF member reports

---

## 🛠 TECH STACK AT A GLANCE

### Backend
```
Node.js + Express.js
├── Database: MongoDB (Mongoose ODM)
├── Auth: JWT + bcryptjs
├── Logging: Morgan
└── API: RESTful endpoints
```

### Frontend
```
React 18 + Vite
├── Routing: React Router v6
├── Styling: Tailwind CSS
├── Animations: Framer Motion
├── Icons: Lucide React
└── Notifications: React Hot Toast
```

---

## 📁 PROJECT STRUCTURE OVERVIEW

```
Project/
├── backend/
│   ├── src/
│   │   ├── config/         → Database & environment setup
│   │   ├── models/         → MongoDB schemas (User, Member, AdminProfile, ReminderLog)
│   │   ├── controllers/    → API request handlers
│   │   ├── routes/         → API endpoints
│   │   ├── middleware/     → Auth, error handling
│   │   ├── services/       → Business logic
│   │   └── utils/          → Helper functions
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/          → Dashboard, Login, Welcome
    │   ├── components/     → Reusable UI components
    │   ├── context/        → Auth & Theme state
    │   ├── lib/            → API client
    │   └── utils/          → Formatting, WhatsApp helpers
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 📊 DATABASE SCHEMA

### Collections

| Collection | Purpose | Key Fields |
|-----------|---------|-----------|
| **Users** | Admin login | name, username, passwordHash |
| **AdminProfiles** | Library info | user, libraryName, phone |
| **Members** | Membership data | name, phone, monthlyFee, status, payments (map) |
| **ReminderLogs** | Audit trail | member, status, sentAt, message, provider |

### Fiscal Year System
- **Cycle:** March → February (12 months)
- **Month 0:** March
- **Month 11:** February
- **Payment Key Format:** `"2024-3"` (FY2024, April)

---

## 🔐 AUTHENTICATION FLOW

```
User Login
    ↓
Verify username/password (bcrypt compare)
    ↓
Generate JWT Token (7-day expiration)
    ↓
Client stores token in localStorage
    ↓
All requests include: Authorization: Bearer <token>
    ↓
Middleware validates token → Access granted/denied
```

---

## 📡 MAIN API ENDPOINTS

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with credentials |
| GET | `/api/auth/me` | Get current user |

### Members
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/members` | List all members (with search/filter) |
| GET | `/api/members/due-members` | Get overdue members |
| POST | `/api/members` | Create member |
| PUT | `/api/members/:id` | Update member |
| DELETE | `/api/members/:id` | Delete member |
| PATCH | `/api/members/:id/status` | Toggle active/inactive |
| PATCH | `/api/members/:id/payments` | Mark payment paid/unpaid |
| POST | `/api/members/:id/reminders/whatsapp` | Log reminder |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/profile` | Get admin profile |
| POST/PUT | `/api/admin/profile` | Create/Update profile |

---

## 🚀 QUICK START

### Step 1: Setup Backend
```bash
cd backend
npm install
```

### Step 2: Create .env file (backend/.env)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ambey-library-dashboard
JWT_SECRET=your-secret-key-here
CLIENT_URLS=http://localhost:5173
ADMIN_USERNAME=Shashank
ADMIN_PASSWORD=Shanky03@26Ro
LIBRARY_NAME=Ambey Library
```

### Step 3: Start MongoDB
```bash
# Ensure MongoDB is running on localhost:27017
mongod
```

### Step 4: Start Backend
```bash
npm run dev
# Runs on http://localhost:5000
```

### Step 5: Setup Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Step 6: Access Dashboard
```
Login URL: http://localhost:5173/login
Username: Shashank
Password: Shanky03@26Ro
```

---

## 💾 DATA MODEL EXAMPLES

### Member Record
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Rajesh Kumar",
  "phoneNumber": "+919876543211",
  "monthlyFee": 500,
  "status": "active",
  "dateOfJoining": "2024-01-15",
  "monthlyFees": {
    "2024-3": { "paid": true, "paidAt": "2024-04-10" },
    "2024-4": { "paid": false, "paidAt": null },
    "2024-5": { "paid": false, "paidAt": null }
  }
}
```

### Dashboard Member Object
```json
{
  "id": "507f1f77bcf86cd799439013",
  "name": "Rajesh Kumar",
  "monthlyFee": 500,
  "status": "active",
  "overdueCount": 2,
  "overdueAmount": 1000,
  "paidCount": 6,
  "dueDate": "2024-05-15T23:59:59Z",
  "canSendReminder": true,
  "reminderStatus": "clear",
  "months": [
    {
      "key": "2024-3",
      "label": "Apr 2024",
      "isPaid": true,
      "isOverdue": false,
      "dueDate": "2024-04-15T23:59:59Z"
    }
  ]
}
```

### Reminder Log Entry
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "member": "507f1f77bcf86cd799439013",
  "memberName": "Rajesh Kumar",
  "phoneNumber": "+919876543211",
  "message": "Payment reminder for Apr-May 2024: ₹1000",
  "provider": "whatsapp",
  "status": "sent",
  "sentAt": "2024-05-10T14:30:00Z",
  "triggeredBy": "manual"
}
```

---

## 🎯 KEY FEATURES EXPLAINED

### 1. Payment Tracking
- Each member has a map of payments by month
- Format: `{ "2024-3": { paid: true/false, paidAt: date } }`
- UI shows 12-month calendar with payment status
- Color-coded: Green (paid), Red (overdue), Gray (future)

### 2. Due Member Detection
- Automatically identifies members with unpaid fees
- Shows earliest due date and total overdue amount
- Displays reminder status (pending/recently-sent/clear)
- Only allows reminders for members with phone numbers

### 3. WhatsApp Reminders
- Pre-fills message with member name, months, and amount
- Opens WhatsApp Web via link
- User manually sends message from WhatsApp
- Optionally logs reminder for audit trail

### 4. Dashboard Analytics
- **Total Members:** Active + Inactive count
- **Monthly Revenue:** Sum of active members' fees
- **Collected:** Sum of paid payments
- **Outstanding:** Revenue - Collected
- **Metrics by Member:** Overdue count, paid count, status

### 5. Fiscal Year Reporting
- All data organized by fiscal year (March-February)
- Month labels generated dynamically
- PDF export includes full member list with payment matrix

---

## 🔧 CONFIGURATION DETAILS

### Environment Variables

**Backend (.env)**
| Variable | Default | Notes |
|----------|---------|-------|
| PORT | 5000 | Server port |
| MONGODB_URI | localhost:27017 | MongoDB connection |
| JWT_SECRET | (required) | Must be 32+ chars in production |
| JWT_EXPIRES_IN | 7d | Token expiration |
| CLIENT_URLS | http://localhost:5173 | CORS whitelist |
| ADMIN_USERNAME | Shashank | Default admin login |
| ADMIN_PASSWORD | Shanky03@26Ro | Default admin password |
| LIBRARY_NAME | Ambey Library | Library name |

### Frontend Configuration
**API Base URL:** Configured in `frontend/src/lib/api.js`
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 📱 FRONTEND PAGES

### WelcomePage (`/`)
- Landing page
- Shows library introduction
- Links to login for authenticated users

### LoginPage (`/login`)
- Admin login form
- Username/password input
- JWT token generation
- Redirect to dashboard on success

### DashboardPage (`/dashboard`)
- Main admin interface
- Member list with search/filter
- Add/Edit/Delete member modals
- Payment status view
- Reminder interface
- Admin settings
- PDF export
- Dark/Light theme toggle

---

## 🛡️ SECURITY FEATURES

✅ **JWT Authentication** - Token-based with expiration
✅ **Password Hashing** - Bcrypt with salt rounds
✅ **CORS Protection** - Whitelist of allowed origins
✅ **Protected Routes** - Frontend route guards
✅ **No Plain Passwords** - All hashed before storage
✅ **Token Validation** - Signature & expiration checks
✅ **Authorization** - User verification on protected endpoints

---

## 📈 PERFORMANCE CONSIDERATIONS

- **Database Indexes:** ReminderLog has compound index on (member, sentAt)
- **Request Cancellation:** Dashboard supports AbortController for active searches
- **Lazy Loading:** Components load on demand
- **Pagination:** Can be added to member list
- **Caching:** localStorage for token and theme preference

---

## 🐛 TROUBLESHOOTING

### MongoDB Connection Error
```
Error: ECONNREFUSED 127.0.0.1:27017
Solution: Start MongoDB with 'mongod' command
```

### JWT Token Expired
```
Error: 401 Your session is invalid or has expired
Solution: User must login again
```

### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy
Solution: Update CLIENT_URLS in .env to include frontend domain
```

### API Not Responding
```
Solution: Check backend is running on port 5000
         Check MongoDB is running
         Check .env variables are set correctly
```

---

## 📦 BUILD & DEPLOYMENT

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
# Creates optimized dist/ folder (~300KB)
```

**Backend:**
```bash
# No build needed, just set NODE_ENV=production
NODE_ENV=production npm start
```

### Deployment Options

**Frontend:**
- Vercel, Netlify (optimal for React)
- Or serve from backend/dist

**Backend:**
- Heroku, Railway, Render
- AWS EC2, DigitalOcean, Linode
- Keep MongoDB on Atlas (managed service)

---

## 📚 KEY UTILITIES

### Fiscal Year Calculations (cycle.js)
- `getFiscalCycleYear()` - Get FY for date
- `getCycleLabel()` - Format as "2024-25"
- `getMonthKey()` - Generate "2024-3" key
- `buildMemberCycle()` - Build 12-month snapshot

### Payment Helper (memberController.js)
- `buildDashboardResponse()` - Format members with payment matrix
- `ensurePaymentMaps()` - Initialize payment maps

### Reminder Helper (reminderService.js)
- `checkDueMembers()` - Get members with overdue payments
- `logReminderAction()` - Record reminder in audit trail

### WhatsApp Helper (whatsapp.js)
- `generateWhatsAppLink()` - Create WhatsApp link
- `normalizePhoneForWhatsApp()` - Format phone number

---

## 💡 BEST PRACTICES IN PROJECT

✨ **Code Organization** - Clear separation of concerns
✨ **Error Handling** - Global middleware for error catching
✨ **Async Operations** - Proper async/await with try-catch
✨ **Data Validation** - Input validation in controllers
✨ **API Design** - RESTful conventions with proper HTTP methods
✨ **Security** - Password hashing, JWT, CORS, input validation
✨ **UI/UX** - Responsive design, animations, dark mode
✨ **Database** - Proper schema design with relationships

---

## 🎓 LEARNING VALUE

This project demonstrates:
- Full-stack MERN application architecture
- RESTful API design patterns
- JWT authentication implementation
- MongoDB schema design for financial tracking
- React hooks and context API
- Tailwind CSS responsive design
- Framer Motion animations
- Error handling and logging
- Environment configuration management

---

**Ready to deploy or share with ChatGPT? This document combined with the detailed PROJECT_REPORT.md provides complete project documentation!** 🚀
