<img width="476" height="531" alt="image" src="https://github.com/user-attachments/assets/ecd6babf-a9ee-4f77-88f7-eb549e9d667f" /># Finance Data Processing & Access Control System

A production-quality backend for managing financial data with role-based access control (RBAC), JWT authentication, and comprehensive analytics APIs.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Role-Based Access Control](#role-based-access-control)
- [Database Models](#database-models)
- [Sample Requests](#sample-requests)
- [Error Handling](#error-handling)

---

## ✨ Features

### 1. User & Role Management

- User registration and authentication
- JWT-based authentication
- Three user roles: Viewer, Analyst, Admin
- User status management (active/inactive)
- Secure password hashing with bcryptjs

### 2. Role-Based Access Control (RBAC)

- **Viewer**: Can only view dashboard summaries
- **Analyst**: Can view financial records and detailed summaries
- **Admin**: Full CRUD access to users and financial records

### 3. Financial Record Management

- Create, read, update, delete financial records
- Record fields: amount, type (income/expense), category, date, notes
- Categorized transactions (salary, bonus, food, transport, etc.)
- Record filtering by date range, category, and type
- Pagination and sorting support

### 4. Dashboard Analytics

- Financial summary (total income, expenses, net balance)
- Category-wise breakdown of transactions
- Monthly trends analysis
- Daily summary reports
- Recent transactions tracking
- MongoDB aggregation pipelines for optimal performance

### 5. Security Features

- JWT token-based authentication
- Password hashing with bcryptjs (10 salt rounds)
- RBAC middleware for route protection
- Input validation with Joi
- Centralized error handling

### 6. Additional Features

- Comprehensive logging with Morgan
- Pagination with customizable limits
- Sorting by date and amount
- Environment-based configuration
- CORS support
- Health check endpoint

---

## 🛠 Tech Stack

- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (json-web-token)
- **Password Hashing**: bcryptjs
- **Input Validation**: Joi
- **Logging**: Morgan
- **Environment Management**: dotenv
- **CORS**: cors

---

## 📁 Project Structure

```
zorvyn_project/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── constants.js         # App constants (roles, types)
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── FinancialRecord.js    # Financial record schema
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── rbac.js              # Role-based access control
│   │   └── errorHandler.js      # Global error handler
│   ├── controllers/
│   │   ├── userController.js         # User management
│   │   ├── financialController.js    # Financial records
│   │   └── dashboardController.js    # Analytics
│   ├── services/
│   │   ├── userService.js           # User business logic
│   │   ├── financialService.js      # Financial business logic
│   │   └── dashboardService.js      # Dashboard aggregations
│   ├── routes/
│   │   ├── userRoutes.js        # User endpoints
│   │   ├── financialRoutes.js   # Financial record endpoints
│   │   └── dashboardRoutes.js   # Dashboard endpoints
│   ├── utils/
│   │   ├── validators.js        # Joi validation schemas
│   │   └── responseHandler.js   # Response formatting
│   └── app.js                   # Express app configuration
├── index.js                     # Server entry point
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
└── README.md                    # Documentation
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation Steps

1. **Clone/Download the project**

   ```bash
   cd zorvyn_project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   # Copy .env.example to .env
   cp .env.example .env

   # Edit .env with your configuration
   ```

4. **Set up MongoDB**

   ```bash
   # For local MongoDB, ensure MongoDB is running
   # For MongoDB Atlas, update MONGODB_URI in .env
   ```

5. **Start the server**

   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

6. **Verify the server**
   ```bash
    http://localhost:5000/health
   ```

---

## 📚 API Endpoints

### Base URL

```
http://localhost:5000/api
```

### Health Check

```
GET /health
```

---

## 👤 User Management

### Register User

```
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Login User

```
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "viewer",
      "status": "active"
    }
  }
}
```

### Get Current Profile

```
GET /users/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": { ... user data ... }
}
```

### Get All Users (Admin Only)

```
GET /users?page=1&limit=10
Authorization: Bearer <admin-token>

Response: 200 OK
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [ ... ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  }
}
```

### Get User by ID (Admin Only)

```
GET /users/:id
Authorization: Bearer <admin-token>
```

### Update User (Admin Only)

```
PUT /users/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "role": "analyst",
  "status": "active"
}
```

### Delete User (Admin Only)

```
DELETE /users/:id
Authorization: Bearer <admin-token>
```

---

## 💰 Financial Records

### Create Financial Record (Admin Only)

```
POST /records
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "date": "2024-01-15T00:00:00Z",
  "notes": "Monthly salary"
}

Response: 201 Created
```

### Get All Financial Records (Analyst/Admin)

```
GET /records?page=1&limit=10&sortBy=date&sortOrder=desc&type=income&category=salary&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>

Query Parameters:
- page: 1-n (default: 1)
- limit: 1-100 (default: 10)
- sortBy: date | amount (default: date)
- sortOrder: asc | desc (default: desc)
- type: income | expense (optional)
- category: string (optional)
- startDate: ISO date (optional)
- endDate: ISO date (optional)

Response: 200 OK
{
  "success": true,
  "message": "Records retrieved successfully",
  "data": {
    "records": [ ... ],
    "pagination": { ... }
  }
}
```

### Get Record by ID (Analyst/Admin)

```
GET /records/:id
Authorization: Bearer <token>
```

### Update Record (Admin Only)

```
PUT /records/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "amount": 6000,
  "category": "bonus"
}
```

### Delete Record (Admin Only)

```
DELETE /records/:id
Authorization: Bearer <admin-token>
```

### Get Recent Transactions

```
GET /records/recent?limit=5
Authorization: Bearer <analyst-token>
```

---

## 📊 Dashboard Analytics

### Get Complete Dashboard Data

```
GET /dashboard
Authorization: Bearer <token>

Response includes:
- Financial summary (income, expenses, balance)
- Category breakdown
- Monthly trends
- Recent transactions
```

### Get Financial Summary

```
GET /dashboard/summary
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Financial summary retrieved successfully",
  "data": {
    "totalIncome": 50000,
    "totalExpenses": 15000,
    "netBalance": 35000
  }
}
```

### Get Category Breakdown

```
GET /dashboard/category-breakdown
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Category breakdown retrieved successfully",
  "data": [
    {
      "_id": "salary",
      "total": 50000,
      "count": 2,
      "type": "income"
    },
    ...
  ]
}
```

### Get Monthly Trends

```
GET /dashboard/monthly-trends?months=12
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Monthly trends retrieved successfully",
  "data": [
    {
      "month": "2024-01",
      "income": 10000,
      "expenses": 3000,
      "netBalance": 7000
    },
    ...
  ]
}
```

### Get Expenses by Category

```
GET /dashboard/expenses-by-category
Authorization: Bearer <token>
```

### Get Income by Category

```
GET /dashboard/income-by-category
Authorization: Bearer <token>
```

### Get Recent Transactions

```
GET /dashboard/recent-transactions?limit=5
Authorization: Bearer <token>
```

### Get Daily Summary

```
GET /dashboard/daily-summary?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>

Query Parameters:
- startDate: ISO date (required)
- endDate: ISO date (required)
```

---

## 🔐 Authentication

### JWT Token Structure

```javascript
{
  id: "user_id",
  email: "user@example.com",
  role: "admin",
  exp: 1705353600
}
```

### Using the Token

All protected endpoints require the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Expiry

Configure in `.env`:

```
JWT_EXPIRY=7d    // Can be: 7d, 24h, 60m, 30s
```

---

## 🎭 Role-Based Access Control

### Roles and Permissions

#### Viewer

- ✓ View profile
- ✓ View dashboard summary
- ✓ View recent transactions
- ✗ Cannot view detailed records
- ✗ Cannot create/edit records
- ✗ Cannot manage users

#### Analyst

- ✓ View profile
- ✓ View all financial records
- ✓ View dashboard and analytics
- ✓ Filter and sort records
- ✗ Cannot create/edit/delete records
- ✗ Cannot manage users

#### Admin

- ✓ Full access to users management
- ✓ Full CRUD on financial records
- ✓ View all analytics
- ✓ Promote/demote users
- ✓ Activate/deactivate users

### Permission Matrix

| Resource  | Viewer       | Analyst      | Admin |
| --------- | ------------ | ------------ | ----- |
| Users     | Read Profile | Read Profile | CRUD  |
| Records   | None         | Read         | CRUD  |
| Dashboard | View         | View         | View  |

---

## 📊 Database Models

### User Model

```javascript
{
  name: String (required, 2-100 chars),
  email: String (required, unique, email format),
  password: String (required, hashed, min 6 chars),
  role: String (viewer/analyst/admin, default: viewer),
  status: String (active/inactive, default: active),
  createdAt: Date,
  updatedAt: Date
}
```

### FinancialRecord Model

```javascript
{
  amount: Number (required, >= 0),
  type: String (income/expense, required),
  category: String (from predefined categories, required),
  date: Date (required),
  notes: String (optional, max 500 chars),
  createdBy: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

### Indexed Fields for Performance

- FinancialRecord: date, category, type, createdBy, createdAt

---

## 📝 Sample Requests

### Complete Workflow Example

1. **Register User**

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "alice@example.com",
    "password": "SecurePass123"
  }'
```

2. **Login User**

```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePass123"
  }'
```

3. **Create Financial Record (as Admin)**

```bash
curl -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "type": "income",
    "category": "salary",
    "date": "2024-01-15T00:00:00Z",
    "notes": "Monthly salary"
  }'
```

4. **Get Dashboard Summary**

```bash
curl -X GET http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer <token>"
```

5. **Filter Records**

```bash
curl -X GET "http://localhost:5000/api/records?startDate=2024-01-01&endDate=2024-01-31&type=income&page=1&limit=20" \
  -H "Authorization: Bearer <token>"
```

---
## 📬 Postman Collection

All APIs can be tested using the provided Postman collection:

* File: `/postman/finance-apis.json`

### Steps to use:

1. Import the file into Postman
2. Set environment variable:

   * `base_url = http://localhost:5000/api`
3. Login once to auto-generate `token`
4. Use `Bearer {{token}}` for authenticated APIs

---


## ⚠️ Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "details": [ ... ] // Optional, for validation errors
}
```

### HTTP Status Codes

| Code | Meaning                                                   |
| ---- | --------------------------------------------------------- |
| 200  | OK - Request successful                                   |
| 201  | Created - Resource created successfully                   |
| 400  | Bad Request - Invalid input or validation error           |
| 401  | Unauthorized - Missing or invalid token                   |
| 403  | Forbidden - Access denied due to insufficient permissions |
| 404  | Not Found - Resource doesn't exist                        |
| 500  | Internal Server Error - Server error                      |

### Common Error Scenarios

**Missing Token**

```json
{
  "success": false,
  "message": "No token provided. Authorization required."
}
```

**Invalid Token**

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**Insufficient Permissions**

```json
{
  "success": false,
  "message": "You don't have permission to update records."
}
```

**Validation Error**

```json
{
  "success": false,
  "message": "Validation error",
  "details": [
    {
      "field": "email",
      "message": "\"email\" must be a valid email"
    }
  ]
}
```

---

## 🔧 Environment Variables

```bash
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>
MONGODB_URI_PRODUCTION=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRY=7d

# Logging
LOG_LEVEL=debug

# CORS (optional)
CORS_ORIGIN=*
```

---

## 📈 Performance Considerations

1. **Database Indexing**: Financial records are indexed on frequently queried fields (date, category, type)
2. **Aggregation Pipelines**: Dashboard queries use MongoDB aggregation for efficiency
3. **Pagination**: Records endpoints support pagination to limit returned data
4. **Lean Queries**: Dashboard queries use `.lean()` for faster JSON conversion
5. **Response Caching**: Consider implementing caching for dashboard data in production

---

## 🐛 Development

### Running in Development Mode

```bash
npm run dev
```

This uses nodemon for auto-reload on file changes.

### Production Build

```bash
npm start
```

---

## 📜 License

This project is open source and available under the ISC License.

---

## 🤝 Support

For issues or questions, please refer to the inline code comments and API documentation above.

---

## 🎯 Next Steps for Production

1. Add comprehensive unit and integration tests
2. Implement request rate limiting
3. Add audit logging
4. Set up monitoring and alerting
5. Implement data encryption at rest
6. Add two-factor authentication
7. Implement API versioning
8. Add comprehensive API documentation (Swagger/OpenAPI)
9. Set up CI/CD pipeline
10. Implement backup and disaster recovery procedures

---

## 👨‍💻 Author

Paras Gogia
Electronics & Communication Engineering, PEC Chandigarh

## ⭐ Final Note

This project demonstrates backend engineering concepts including authentication, fine-grained RBAC, data validation, and scalable API design.

