# AMBEY LIBRARY MANAGEMENT DASHBOARD - COMPREHENSIVE PROJECT REPORT

**Project Name:** Ambey Library Management Dashboard  
**Version:** 1.0.0  
**Date:** April 2026  
**Type:** Full-Stack Web Application (MERN Stack)

---

## 📋 TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Schema & Models](#database-schema--models)
5. [Backend Architecture](#backend-architecture)
6. [Frontend Architecture](#frontend-architecture)
7. [Core Features & Functionality](#core-features--functionality)
8. [API Endpoints](#api-endpoints)
9. [Authentication & Security](#authentication--security)
10. [Key Utilities & Services](#key-utilities--services)
11. [Configuration & Environment Variables](#configuration--environment-variables)
12. [UI/UX Components](#uiux-components)
13. [Payment & Billing System](#payment--billing-system)
14. [Reminder System](#reminder-system)

---

## PROJECT OVERVIEW

**Purpose:**  
Ambey Library Management Dashboard is a comprehensive web-based library management system designed to help library administrators efficiently manage member accounts, track payments, and send payment reminders.

**Target Users:**
- Library Admin/Manager
- Library Members
- Administrative Staff

**Key Objectives:**
- Centralized member management
- Monthly fee tracking and payment status monitoring
- Automated payment reminders via WhatsApp
- Member onboarding and profile management
- Dashboard analytics and reporting
- Role-based access control (Admin/User)

---

## TECHNOLOGY STACK

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (v4.19.2) - RESTful API server
- **Database:** MongoDB (v8.4.3) with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens v9.0.2)
- **Security:** bcryptjs (v2.4.3) - Password hashing
- **Middleware:**
  - CORS (v2.8.5) - Cross-Origin Resource Sharing
  - Morgan (v1.10.0) - HTTP request logging
  - dotenv (v16.4.5) - Environment variable management

**Dev Tools:**
- Nodemon (v3.1.4) - Auto-restart during development

### Frontend
- **Framework:** React (v18.3.1) - UI library
- **Build Tool:** Vite (v5.3.1) - Fast build tool and dev server
- **Routing:** React Router DOM (v6.24.0) - Client-side routing
- **Styling:** 
  - Tailwind CSS (v3.4.4) - Utility-first CSS framework
  - PostCSS (v8.4.39) - CSS transformation
  - Autoprefixer (v10.4.19) - Vendor prefixes

**Animations & Effects:**
- Framer Motion (v11.2.10) - Declarative animations and page transitions
- Custom animations (ClickSpark, LaserFlow, GradientText)

**UI Components & Icons:**
- Lucide React (v0.395.0) - Icon library

**Notifications:**
- React Hot Toast (v2.4.1) - Toast notifications for user feedback

**PDF Generation:**
- jsPDF (v2.5.1) - PDF generation library
- jspdf-autotable (v3.8.2) - PDF table formatting

---

## PROJECT STRUCTURE

```
PROJECT-Ambey Lib Management Dashboard/
│
├── backend/                          # Node.js/Express API Server
│   ├── src/
│   │   ├── app.js                   # Express app configuration & middleware setup
│   │   ├── server.js                # Server entry point
│   │   ├── config/
│   │   │   ├── db.js               # MongoDB connection
│   │   │   └── env.js              # Environment variables & configuration
│   │   ├── controllers/             # Request handlers
│   │   │   ├── authController.js   # Authentication logic (login, user)
│   │   │   ├── adminController.js  # Admin operations
│   │   │   └── memberController.js # Member CRUD & operations
│   │   ├── models/                 # Mongoose schemas
│   │   │   ├── User.js            # User authentication model
│   │   │   ├── Member.js          # Library member with payment tracking
│   │   │   ├── AdminProfile.js    # Admin profile & library details
│   │   │   └── ReminderLog.js     # Reminder history & audit trail
│   │   ├── routes/                # API endpoints
│   │   │   ├── authRoutes.js      # Auth endpoints
│   │   │   ├── adminRoutes.js     # Admin endpoints
│   │   │   └── memberRoutes.js    # Member endpoints
│   │   ├── middleware/            # Express middleware
│   │   │   ├── auth.js           # JWT authentication
│   │   │   └── errorHandler.js   # Global error handling
│   │   ├── services/             # Business logic & utilities
│   │   │   ├── adminProfileService.js  # Admin profile management
│   │   │   ├── reminderService.js      # Reminder logic
│   │   │   └── smsService.js          # SMS/WhatsApp integration
│   │   ├── utils/               # Helper functions
│   │   │   ├── asyncHandler.js   # Async error wrapper
│   │   │   ├── cycle.js          # Fiscal year cycle utilities
│   │   │   ├── ensureAdmin.js    # Admin authorization
│   │   │   └── migrateLegacyMemberData.js  # Data migration
│   │   └── jobs/               # Background jobs (if any)
│   ├── package.json            # Dependencies & scripts
│   └── .env (not in repo)      # Environment variables
│
├── frontend/                       # React + Vite Application
│   ├── src/
│   │   ├── App.jsx             # Root component with routing
│   │   ├── main.jsx            # React entry point
│   │   ├── index.css           # Global styles
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AdminProfilePanel.jsx      # Admin profile edit form
│   │   │   ├── BookshelfBackdrop.jsx      # Decorative background
│   │   │   ├── ClickSpark.jsx             # Click effect animation
│   │   │   ├── DeleteConfirmModal.jsx     # Confirmation dialog
│   │   │   ├── DueReminderModal.jsx       # Reminder modal
│   │   │   ├── GradientText.jsx           # Gradient text effect
│   │   │   ├── GuestRoute.jsx             # Route guard for guests
│   │   │   ├── LaserFlow.jsx              # Beam animation effect
│   │   │   ├── LogbookTable.jsx           # Member list table
│   │   │   ├── MagicBento.jsx             # Dashboard card layout
│   │   │   ├── MemberFormModal.jsx        # Add/Edit member form
│   │   │   ├── ModalShell.jsx             # Modal wrapper
│   │   │   ├── PageLoader.jsx             # Loading spinner
│   │   │   ├── ProtectedRoute.jsx         # Route guard for auth
│   │   │   ├── Sidebar.jsx                # Navigation sidebar
│   │   │   ├── StatsCard.jsx              # Statistics card
│   │   │   └── ThemeToggle.jsx            # Dark/Light mode toggle
│   │   ├── context/            # React Context for state management
│   │   │   ├── AuthContext.jsx # Authentication state
│   │   │   └── ThemeContext.jsx # Theme state
│   │   ├── pages/              # Page components
│   │   │   ├── DashboardPage.jsx   # Main dashboard
│   │   │   ├── LoginPage.jsx       # Login form
│   │   │   └── WelcomePage.jsx     # Landing page
│   │   ├── lib/                # Libraries & utilities
│   │   │   └── api.js         # API client & HTTP requests
│   │   └── utils/             # Helper functions
│   │       ├── format.js      # Formatting utilities (currency, dates)
│   │       └── whatsapp.js    # WhatsApp message generation
│   ├── index.html              # HTML template
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── postcss.config.js      # PostCSS configuration
│   ├── package.json           # Dependencies & scripts
│   └── dist/                  # Production build (generated)
│
├── .git/                       # Git repository
├── .gitignore                 # Git ignore rules
└── PROJECT_REPORT.md          # This document
```

---

## DATABASE SCHEMA & MODELS

### 1. **User Model** (`User.js`)
Stores authentication credentials for library administrators.

**Fields:**
- `name` (String, Required) - Full name of user
- `username` (String, Required, Unique) - Login username (lowercase)
- `passwordHash` (String, Required) - Bcrypt-hashed password
- `timestamps` - Created and updated timestamps

**Methods:**
- `comparePassword()` - Compares plain password with hashed password using bcryptjs

**Use Case:** Admin login and session management

---

### 2. **AdminProfile Model** (`AdminProfile.js`)
Stores library admin's profile and library information.

**Fields:**
- `user` (ObjectId, Required, Unique) - Reference to User model
- `name` (String, Required) - Admin's full name
- `phone` (String) - Admin's contact number
- `libraryName` (String, Required) - Name of the library (Default: "Ambey Library")
- `timestamps` - Created and updated timestamps

**Use Case:** Library metadata and admin contact information

---

### 3. **Member Model** (`Member.js`)
Core data model tracking library members and their payment information.

**Fields:**
- `name` (String, Required) - Member's full name
- `dateOfJoining` / `joinDate` (Date, Required) - When member joined
- `monthlyFee` (Number, Required, Min: 0) - Monthly subscription fee
- `phoneNumber` / `phone` (String, Required) - Contact number for reminders
- `status` (String, Enum: "active"/"inactive", Default: "active") - Member status
- `monthlyFees` (Map) - Payment tracking by month (maps monthKey → paymentEntry)
- `feeStatus` (Map) - Alternative fee tracking field
- `payments` (Map) - Payment history (maps monthKey → paymentEntry)
- `timestamps` - Created and updated timestamps

**Payment Entry Structure:**
```javascript
{
  paid: Boolean (default: false),
  paidAt: Date (default: null)
}
```

**Month Key Format:** `${cycleYear}-${monthIndex}` (e.g., "2024-5")

**Fiscal Cycle:** March (Month 2) to February (Month 1)
- Month 0 = March
- Month 11 = February

**Use Case:** Core member database with financial tracking

---

### 4. **ReminderLog Model** (`ReminderLog.js`)
Audit trail for all payment reminders sent to members.

**Fields:**
- `member` (ObjectId, Required) - Reference to Member
- `cycleYear` (Number, Required) - Fiscal year
- `monthKeys` (Array) - List of months with overdue payments
- `dueDate` (Date, Required) - Payment due date
- `memberName` (String, Required) - Member's name (denormalized for history)
- `phoneNumber` (String, Required) - Phone number (denormalized for history)
- `message` (String, Required) - Message content sent
- `provider` (String, Required) - "whatsapp" or SMS provider name
- `simulated` (Boolean, Default: false) - Test reminder flag
- `externalId` (String) - Provider's message ID
- `failureReason` (String) - Reason if reminder failed
- `status` (String, Enum: "sent"/"skipped"/"failed", Default: "sent") - Delivery status
- `triggeredBy` (String, Enum: "auto"/"manual", Default: "manual") - Trigger source
- `sentAt` (Date, Default: now) - When reminder was sent
- `timestamps` - Created and updated timestamps

**Indexes:**
- Composite index on `member` and `sentAt` for efficient querying

**Use Case:** Audit trail, reminder history, and reporting

---

## BACKEND ARCHITECTURE

### Application Structure

#### **Entry Points:**
- `server.js` - Starts Express server, connects to MongoDB, listens on configured port
- `app.js` - Configures Express middleware and API routes

#### **API Routes:**

**Base URL:** `http://localhost:5000/api/`

##### Authentication Routes (`/auth`)
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

##### Admin Routes (`/admin`)
- `GET /admin/profile` - Fetch admin profile
- `POST /admin/profile` - Create admin profile
- `PUT /admin/profile` - Update admin profile

##### Member Routes (`/members`)
- `GET /members` - List all members (with search & filter)
- `GET /members/due-members` - Get members with overdue payments
- `POST /members` - Create new member
- `PUT /members/:id` - Update member details
- `DELETE /members/:id` - Delete member
- `PATCH /members/:id/status` - Toggle member active/inactive status
- `PATCH /members/:id/payments` - Toggle payment for specific month
- `POST /members/:id/reminders/whatsapp` - Log WhatsApp reminder

#### **Middleware:**

1. **CORS Middleware**
   - Allows requests from configured client URLs
   - Prevents unauthorized cross-origin access

2. **JSON Parser** - Parses incoming JSON requests

3. **Morgan Logger** - Logs HTTP requests with development format

4. **Authentication Middleware** (`protect`)
   - Validates JWT token from `Authorization: Bearer <token>` header
   - Attaches user object to request
   - Returns 401 if token invalid or expired

5. **Error Handler Middleware**
   - Global error handling
   - Catches async errors
   - Returns formatted error responses

#### **Key Services:**

**reminderService.js:**
- `checkDueMembers()` - Identifies members with overdue payments
- `logReminderAction()` - Records reminder delivery in ReminderLog
- Builds due member entries with payment information

**adminProfileService.js:**
- `ensureAdminProfile()` - Creates default admin profile if missing
- `getPrimaryAdminProfile()` - Fetches primary admin profile
- `serializeAdminProfile()` - Formats admin profile for API response

**smsService.js:**
- Integration with SMS/WhatsApp providers (Twilio)
- Message formatting and sending logic

#### **Utilities:**

**cycle.js:**
- Fiscal year calculations (March-February cycle)
- Month indexing within fiscal year
- Due date calculations based on joining date
- Payment tracking by fiscal month

**asyncHandler.js:**
- Wrapper for async request handlers
- Catches errors and passes to error middleware

**ensureAdmin.js:**
- Middleware to verify admin privileges
- Access control for admin-only routes

---

## FRONTEND ARCHITECTURE

### Page Structure

#### **WelcomePage (`/`)**
- Landing page with library introduction
- Unauthenticated users see this page
- Option to navigate to login

#### **LoginPage (`/login`)**
- Admin login form
- Username and password input
- JWT token generation and storage
- Redirects to dashboard on successful login

#### **DashboardPage (`/dashboard`)**
- Main administrative interface
- Protected route (requires authentication)
- Features:
  - Member list with search and filtering
  - Payment tracking view
  - Add/Edit member forms
  - Delete confirmation dialogs
  - Due payment reminder modal
  - Admin profile management
  - PDF export of member records
  - Dark/Light theme toggle

### State Management

#### **AuthContext** (`context/AuthContext.jsx`)
- Manages user authentication state
- Stores JWT token
- Provides methods: `login()`, `logout()`, `updateUser()`
- Persists token to localStorage

#### **ThemeContext** (`context/ThemeContext.jsx`)
- Manages light/dark theme preference
- Stores preference in localStorage

### Core Components

#### **Protected Route Components:**
- `ProtectedRoute` - Guards dashboard from unauthenticated access
- `GuestRoute` - Prevents logged-in users from accessing login page

#### **Dashboard Components:**
- `Sidebar` - Navigation menu
- `AdminProfilePanel` - Edit admin info and library name
- `LogbookTable` - Displays member list with status and payment info
- `MemberFormModal` - Add/Edit member form with validation
- `DueReminderModal` - Shows due members and WhatsApp reminder interface
- `DeleteConfirmModal` - Confirmation before deleting member
- `StatsCard` - Statistics cards (total members, revenue, etc.)
- `MagicBento` - Dashboard grid layout with cards

#### **UI Effects & Animations:**
- `ClickSpark` - Particle effect on click
- `LaserFlow` - Animated beam effect
- `GradientText` - Text with gradient color animation
- `BookshelfBackdrop` - Decorative background
- `PageLoader` - Loading spinner with animation
- `ThemeToggle` - Dark/light mode switcher

### API Client

**lib/api.js:**
- `apiRequest()` - Centralized HTTP client
- Automatic JWT token injection in Authorization header
- Error handling and response parsing
- Support for AbortController for request cancellation

### Utilities

**utils/format.js:**
- `formatCurrency()` - Format numbers as currency (INR)
- `formatDate()` - Format dates consistently
- `calculatePercentage()` - Calculate completion percentages

**utils/whatsapp.js:**
- `generateWhatsAppLink()` - Creates WhatsApp direct message link
- `openWhatsAppReminder()` - Opens WhatsApp with pre-filled message
- `normalizePhoneForWhatsApp()` - Formats phone numbers for WhatsApp API

---

## CORE FEATURES & FUNCTIONALITY

### 1. **Authentication System**
- **JWT-based** authentication
- Username/password login with bcrypt hashing
- 7-day token expiration (configurable)
- Secure token storage in localStorage

### 2. **Member Management**
- Add new members with joining date, fee, and contact info
- Edit member details (name, fee, phone, status)
- Deactivate/Activate members
- Search members by name or phone
- Filter members by status (active/inactive)
- Delete member records

### 3. **Payment Tracking**
- Monthly fee tracking per member
- Fiscal year cycle (March-February)
- Mark payments as paid/unpaid
- Track payment date
- Display payment status for each month
- Calculate overdue amounts and counts

### 4. **Due Payment Management**
- Automatically identify members with overdue payments
- Display overdue count and amount per member
- Show earliest due date
- Track reminder status per member
- Prevent duplicate reminders (within certain timeframe)

### 5. **WhatsApp Reminders**
- Generate payment reminder messages
- Multi-month overdue handling
- WhatsApp direct chat link generation
- Client-side WhatsApp integration (no API key needed for basic usage)
- Log reminder delivery in audit trail
- Support for manual reminder triggering

### 6. **Admin Profile Management**
- Store library name and admin contact info
- Edit library details
- Display library info on dashboard

### 7. **Dashboard Analytics**
- Total members count (active/inactive)
- Total monthly revenue (all active members)
- Total collected revenue (sum of paid amounts)
- Outstanding amount (unpaid fees)
- Member list with status and metrics

### 8. **PDF Reporting**
- Generate PDF reports of member database
- Table format with member details
- Date-based file naming
- Download for record keeping

### 9. **Data Export & Persistence**
- Member data persists in MongoDB
- Historical reminder logs for audit
- Member profile snapshots in reminder logs

---

## API ENDPOINTS

### Authentication Endpoints

#### **POST** `/api/auth/login`
**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```
**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Shashank Rohilla",
    "username": "shashank"
  }
}
```

#### **GET** `/api/auth/me`
**Headers:** `Authorization: Bearer <token>`
**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Shashank Rohilla",
    "username": "shashank"
  }
}
```

---

### Admin Endpoints

#### **GET** `/api/admin/profile`
**Headers:** `Authorization: Bearer <token>`
**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439012",
  "name": "Shashank Rohilla",
  "phone": "+919876543210",
  "libraryName": "Ambey Library",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### **POST** `/api/admin/profile`
**Headers:** `Authorization: Bearer <token>`
**Request:**
```json
{
  "name": "string",
  "phone": "string",
  "libraryName": "string"
}
```
**Response (201):** Created admin profile object

#### **PUT** `/api/admin/profile`
**Headers:** `Authorization: Bearer <token>`
**Request:** Same as POST
**Response (200):** Updated admin profile object

---

### Member Endpoints

#### **GET** `/api/members`
**Headers:** `Authorization: Bearer <token>`
**Query Params:**
- `search` (optional) - Search by name or phone
- `status` (optional) - Filter by "active" or "inactive"

**Response (200):**
```json
{
  "adminProfile": { ...},
  "members": [
    {
      "id": "507f1f77bcf86cd799439013",
      "name": "Rajesh Kumar",
      "phoneNumber": "+919876543211",
      "monthlyFee": 500,
      "status": "active",
      "dateOfJoining": "2024-01-01T00:00:00Z",
      "overdueCount": 2,
      "overdueAmount": 1000,
      "paidCount": 6,
      "dueDate": "2024-03-15T23:59:59Z",
      "canSendReminder": true,
      "reminderStatus": "clear",
      "reminderLastSentAt": null,
      "months": [
        {
          "key": "2024-3",
          "label": "Apr 2024",
          "isPaid": true,
          "isOverdue": false,
          "dueDate": "2024-04-01T23:59:59Z"
        },
        ...
      ]
    },
    ...
  ]
}
```

#### **GET** `/api/members/due-members`
**Headers:** `Authorization: Bearer <token>`
**Response (200):**
```json
[
  {
    "memberId": "507f1f77bcf86cd799439013",
    "name": "Rajesh Kumar",
    "phoneNumber": "+919876543211",
    "monthlyFee": 500,
    "dueDate": "2024-03-15T23:59:59Z",
    "overdueCount": 2,
    "overdueAmount": 1000,
    "cycleYear": 2024,
    "cycleLabel": "2024-25",
    "monthKeys": ["2024-1", "2024-2"],
    "overdueMonths": [
      {
        "label": "Mar 2024",
        "dueDate": "2024-03-15T23:59:59Z",
        "amount": 500
      },
      ...
    ],
    "lastReminderAt": null,
    "reminderStatus": "pending",
    "canSendReminder": true
  },
  ...
]
```

#### **POST** `/api/members`
**Headers:** `Authorization: Bearer <token>`
**Request:**
```json
{
  "name": "string",
  "dateOfJoining": "2024-01-15",
  "monthlyFee": 500,
  "phoneNumber": "+919876543211",
  "status": "active"
}
```
**Response (201):** Created member object

#### **PUT** `/api/members/:id`
**Headers:** `Authorization: Bearer <token>`
**Request:** Same fields as POST (partial update allowed)
**Response (200):** Updated member object

#### **DELETE** `/api/members/:id`
**Headers:** `Authorization: Bearer <token>`
**Response (200):** Success message

#### **PATCH** `/api/members/:id/status`
**Headers:** `Authorization: Bearer <token>`
**Request:**
```json
{
  "status": "active" | "inactive"
}
```
**Response (200):** Updated member object

#### **PATCH** `/api/members/:id/payments`
**Headers:** `Authorization: Bearer <token>`
**Request:**
```json
{
  "monthKey": "2024-3",
  "action": "mark-paid" | "mark-unpaid"
}
```
**Response (200):** Updated member object

#### **POST** `/api/members/:id/reminders/whatsapp`
**Headers:** `Authorization: Bearer <token>`
**Request:**
```json
{
  "message": "Payment reminder message",
  "monthKeys": ["2024-1", "2024-2"]
}
```
**Response (201):** Created ReminderLog entry

---

## AUTHENTICATION & SECURITY

### Authentication Flow

1. **User Login**
   - User submits username/password
   - Server verifies credentials against hashed password in database
   - If valid: JWT token is generated with 7-day expiration
   - Token is returned to client

2. **Token Storage**
   - Token stored in browser localStorage
   - Persists across browser sessions

3. **Protected Requests**
   - Client includes `Authorization: Bearer <token>` header
   - Server middleware (`protect`) validates token signature and expiration
   - If valid: Request proceeds; User object attached to request
   - If invalid/expired: 401 error returned

4. **Token Expiration**
   - Default: 7 days (configurable via `JWT_EXPIRES_IN`)
   - User must re-login after expiration
   - Client automatically logs out on 401 responses

### Security Features

1. **Password Security**
   - Passwords hashed with bcryptjs (salt rounds: 10, default)
   - Passwords never stored in plain text
   - Password field excluded from queries by default (`.select("+passwordHash")`)

2. **JWT Security**
   - HMAC-SHA256 algorithm
   - Secret key stored in environment variables (not in code)
   - Token signed with secret for signature verification

3. **CORS Protection**
   - Whitelist of allowed client URLs
   - Prevents unauthorized cross-origin requests
   - Configured via `CLIENT_URLS` environment variable

4. **Protected Routes**
   - All API routes require authentication (except `/api/health`)
   - Frontend route protection with `ProtectedRoute` component
   - Unauthorized access redirects to login

---

## KEY UTILITIES & SERVICES

### Fiscal Year Cycle Utilities (`cycle.js`)

The library operates on a fiscal year running from March to February.

**Key Functions:**

1. **`getFiscalCycleYear(referenceDate)`**
   - Returns fiscal year for a given date
   - Example: March 2024 → 2024 (March 2024 is start of 2024-25 cycle)
   - Example: February 2024 → 2023 (end of 2023-24 cycle)

2. **`getCycleLabel(cycleYear)`**
   - Formats cycle year as "2024-25" (for 2024 FY)

3. **`getCycleMonthIndex(referenceDate)`**
   - Returns 0-indexed month position in fiscal year
   - March = 0, April = 1, ..., February = 11

4. **`getMonthKey(cycleYear, monthIndex)`**
   - Creates unique key: "2024-3" (2024 FY, April)
   - Used for payment tracking map keys

5. **`getDueDateForMonth(joinDate, cycleYear, monthIndex)`**
   - Calculates payment due date based on joining date
   - Ensures due date doesn't exceed month's day count
   - Example: If joined on 31st, but month has 30 days → due date = 30th

6. **`buildMemberCycle(member, referenceDate, cycleYear)`**
   - Generates snapshot of member's payment status for all 12 months
   - Returns `months` array with:
     - `key`, `label`, `isPaid`, `isOverdue`, `dueDate`, `daysSince`, `daysUntil`

### Reminder Service (`reminderService.js`)

**`checkDueMembers(options)`**
- Identifies members with at least one overdue payment
- Returns array of due member entries with:
  - Member ID, name, phone
  - Total overdue amount and count
  - Earliest due date
  - Reminder status and last reminder date
  - Can send reminder flag (true if phone number exists)
- Used for dashboard display and reminder modal

**`logReminderAction(memberId, dueEntry, referenceDate)`**
- Creates ReminderLog entry when reminder is sent
- Records member info, message content, delivery status
- Supports manual or auto triggers
- Used for audit trail and reminder history

### Admin Profile Service (`adminProfileService.js`)

**`ensureAdminProfile()`**
- Creates default admin profile if none exists
- Uses environment variables for defaults
- Called on first dashboard load

**`getPrimaryAdminProfile()`**
- Fetches the admin profile for the current user/library
- Returns single admin profile object

**`serializeAdminProfile(profile)`**
- Formats admin profile for API response
- Ensures consistent field names

---

## CONFIGURATION & ENVIRONMENT VARIABLES

### Backend Configuration (`backend/src/config/env.js`)

All configuration from environment or defaults:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Server port |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/ambey-library-dashboard` | MongoDB connection string |
| `JWT_SECRET` | `replace-this-secret-in-production` | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | Token expiration time |
| `CLIENT_URLS` | `http://localhost:5173` | Comma-separated CORS whitelist |
| `ADMIN_NAME` | `Shashank Rohilla` | Default admin name |
| `ADMIN_USERNAME` | `Shashank` | Default admin login username |
| `ADMIN_PASSWORD` | `Shanky03@26Ro` | Default admin password |
| `ADMIN_PHONE` | `` (empty) | Default admin phone |
| `LIBRARY_NAME` | `Ambey Library` | Default library name |
| `SMS_PROVIDER` | `twilio` | SMS service provider |
| `TWILIO_ACCOUNT_SID` | `` | Twilio account ID |
| `TWILIO_AUTH_TOKEN` | `` | Twilio auth token |
| `TWILIO_FROM_NUMBER` | `` | Twilio phone number |
| `TWILIO_MESSAGING_SERVICE_SID` | `` | Twilio messaging service SID |

### Setup Steps

1. **Environment Setup:**
   ```bash
   # Backend - Create .env file in backend/ root
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/ambey-library-dashboard
   JWT_SECRET=your-super-secret-key-here
   CLIENT_URLS=http://localhost:5173
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=password123
   ```

2. **MongoDB Setup:**
   - Ensure MongoDB is running locally or configure remote connection
   - Database auto-creates on first connection

3. **Frontend Configuration:**
   - API base URL in `frontend/src/lib/api.js`
   - Default: `http://localhost:5000/api`

---

## UI/UX COMPONENTS

### Component Library

#### **Layout Components:**
- `Sidebar` - Navigation menu with active indicator
- `ModalShell` - Reusable modal container
- `PageLoader` - Full-page loading spinner
- `StatsCard` - Dashboard metric card

#### **Feature Components:**
- `LogbookTable` - Member list with inline actions
- `MemberFormModal` - Add/Edit member form with validation
- `DueReminderModal` - Displays due members and reminder interface
- `AdminProfilePanel` - Admin settings panel
- `DeleteConfirmModal` - Confirmation dialog

#### **Animation Components:**
- `ClickSpark` - Particle burst on click
- `LaserFlow` - Animated beam effect (decorative)
- `GradientText` - Text with color gradient animation
- `BookshelfBackdrop` - Decorative bookshelf background pattern

#### **UI Elements:**
- `ThemeToggle` - Dark/light mode switch
- `GuestRoute` - Route wrapper for unauthenticated pages
- `ProtectedRoute` - Route wrapper for authenticated pages

### Styling

**Tailwind CSS:**
- Utility-first CSS framework
- Custom config in `tailwind.config.js`
- Supports dark mode with `dark:` prefix

**Animations:**
- Framer Motion for page transitions and component animations
- `AnimatePresence` for exit animations
- Custom CSS animations for effects

**Icons:**
- Lucide React icon library
- 400+ icons available
- Used throughout UI for navigation, actions, status

### Responsiveness

- Mobile-first design approach
- Responsive Tailwind breakpoints (sm, md, lg, xl)
- Mobile sidebar with hamburger menu
- Adaptive table layout on small screens

---

## PAYMENT & BILLING SYSTEM

### Fee Structure

- **Fiscal Year:** March to February (12 months)
- **Member Fees:** Configurable per member
- **Payment Status:** Paid/Unpaid for each month
- **Overdue Tracking:** Days since due date

### Payment Tracking

**Data Model:**
```javascript
// In Member schema
monthlyFees: Map {
  "2024-3": { paid: true, paidAt: "2024-04-10" },  // April FY2024
  "2024-4": { paid: false, paidAt: null },          // May FY2024
  "2024-5": { paid: false, paidAt: null }           // June FY2024
}
```

**Payment Operations:**
- `PATCH /members/:id/payments` - Mark payment as paid/unpaid
- Toggle updates the payment status and timestamp
- Instantly reflects on dashboard

### Due Payment Calculation

- **Overdue:** Any month where due date has passed and payment not marked as paid
- **Overdue Amount:** `overdueCount × monthlyFee`
- **Overdue Count:** Number of months with unpaid dues

### Dashboard Metrics

- **Total Monthly Revenue:** Sum of all active members' monthly fees
- **Collected Revenue:** Sum of all paid payments
- **Outstanding Amount:** Monthly revenue minus collected revenue
- **Active Members:** Count of active status members
- **Inactive Members:** Count of inactive status members

---

## REMINDER SYSTEM

### WhatsApp Reminder Flow

1. **Identification:**
   - System checks for members with overdue payments
   - Builds message with member name, due amount, months

2. **Message Generation:**
   - Client-side message building in `whatsapp.js`
   - Multi-month formatting (e.g., "Apr, May 2024")
   - Amount calculation: `overdueCount × monthlyFee`

3. **WhatsApp Integration:**
   - Uses WhatsApp Web API (no SMS gateway needed for basic chat)
   - Generates clickable link: `https://wa.me/<phoneNumber>?text=<message>`
   - User clicks link → Opens WhatsApp with pre-filled message
   - User manually sends message

4. **Reminder Logging:**
   - After WhatsApp opens, optionally log reminder in ReminderLog
   - Records delivery status, timestamp, member info
   - Used for audit trail and duplicate prevention

5. **Duplicate Prevention:**
   - Tracks last reminder sent timestamp per member
   - Shows "recently-sent" status if reminder sent in certain period
   - User can still manually resend if needed

### Reminder Status States

- **clear** - No recent reminders
- **pending** - Due for reminder
- **recently-sent** - Reminder sent recently
- **missing-phone** - Phone number not available

### Manual Reminder Triggers

- Admin can manually trigger reminders from Due Reminder Modal
- Opens WhatsApp with pre-filled message
- Logs action in ReminderLog for audit trail

---

## GETTING STARTED

### Installation

**Backend:**
```bash
cd backend
npm install
npm run dev  # Development with nodemon
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev  # Development server with Vite
```

### Default Credentials

```
Username: Shashank (or check .env)
Password: Shanky03@26Ro (or check .env)
```

### Building for Production

**Backend:**
```bash
npm start
```

**Frontend:**
```bash
npm run build
# Creates optimized dist/ folder
# Copy to backend/dist for serving
```

---

## PROJECT STATUS & COMPLETION

### Completed Features ✓
- Full authentication system (login/logout)
- Member CRUD operations
- Payment tracking by fiscal month
- Due payment identification
- WhatsApp reminder integration (client-side)
- Dashboard analytics and statistics
- Admin profile management
- Dark/Light theme support
- PDF export functionality
- Responsive UI design
- Full API with JWT protection

### Potential Enhancements
- SMS gateway integration (Twilio)
- Automated scheduled reminders
- Member notification preferences
- Payment receipts/invoices
- Member search and advanced filtering
- Bulk member import from CSV
- Payment history graphs
- Member portal for self-service
- Email reminders as alternative
- Detailed financial reports

---

## DEPLOYMENT CONSIDERATIONS

1. **Environment Variables:**
   - Set secure `JWT_SECRET` in production
   - Configure `CLIENT_URLS` for deployed domain
   - Set `MONGODB_URI` to production database
   - Update SMS provider credentials if using

2. **MongoDB:**
   - Use MongoDB Atlas for managed database
   - Set up indexes for performance
   - Enable backups

3. **Hosting:**
   - Backend: Node.js hosting (Heroku, Railway, Render, AWS, DigitalOcean)
   - Frontend: Static hosting (Vercel, Netlify) or serve from backend

4. **Security:**
   - HTTPS only
   - Secure JWT secret (32+ characters)
   - CORS whitelist production URLs only
   - Rate limiting on API endpoints
   - Input validation and sanitization

5. **Monitoring:**
   - Error logging (Sentry, LogRocket)
   - Performance monitoring
   - Database metrics
   - API uptime monitoring

---

## CONCLUSION

The **Ambey Library Management Dashboard** is a production-ready library management system with comprehensive member tracking, payment management, and reminder functionality. The MERN stack architecture provides scalability, modern UI/UX, and robust backend API for managing library operations efficiently.

The project demonstrates best practices in:
- Full-stack application architecture
- Database schema design for financial tracking
- JWT-based security
- Responsive React UI with animations
- RESTful API design
- Error handling and logging

---

**Document Generated:** April 18, 2026  
**Total Project Size:** ~15 MB (excluding node_modules)  
**Technology:** MERN Stack (MongoDB, Express, React, Node.js)
