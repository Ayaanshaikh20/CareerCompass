# 🧭 CareerCompass

> A comprehensive job application tracking system to manage your job search journey efficiently.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![DynamoDB](https://img.shields.io/badge/Database-DynamoDB-4053D6?logo=amazondynamodb)](https://aws.amazon.com/dynamodb/)
[![AWS S3](https://img.shields.io/badge/Storage-AWS_S3-569A31?logo=amazons3)](https://aws.amazon.com/s3/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [High-Level Architecture](#high-level-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## 🎯 Overview

**CareerCompass** is a full-stack web application designed to help job seekers organize and track their job applications efficiently. It provides a centralized platform to manage applications, store documents, track companies, and receive interview reminders.

### Key Highlights
- 📊 **Dashboard Analytics** - Visual insights into application status and trends
- 📝 **Application Tracking** - Manage job applications with detailed information
- 🏢 **Company Database** - Maintain a list of target companies with contact details
- 📄 **Document Manager** - Upload and view resumes, cover letters, and other documents
- 🔔 **Interview Reminders** - Get notified about upcoming interviews
- 📈 **Resume Analyzer** - Analyze resume against job descriptions (upcoming feature)
- 🌓 **Dark Mode Support** - Toggle between light and dark themes

---

## ✨ Features

### Authentication & Security
- ✅ JWT-based authentication with access and refresh tokens
- ✅ Secure password hashing with bcrypt
- ✅ Session management with HTTP-only cookies
- ✅ Password reset functionality via email
- ✅ Token refresh mechanism for seamless user experience

### Application Management
- ✅ Create, read, update, delete (CRUD) job applications
- ✅ Track application status (Pending, Approved, Rejected)
- ✅ Store job details (role, company, location, package, experience)
- ✅ Add interview dates and job links
- ✅ Filter and sort applications

### Company Tracking
- ✅ Maintain a database of target companies
- ✅ Store contact information (HR email, phone, website)
- ✅ Track contacted status
- ✅ Quick search and filter capabilities

### Document Management
- ✅ Upload documents to AWS S3
- ✅ Preview PDFs and images in-browser
- ✅ Generate signed URLs for secure access
- ✅ Download documents anytime
- ✅ Organize documents by user

### Notifications
- ✅ Interview reminder notifications
- ✅ Alerts for interviews within 5 days
- ✅ Real-time notification badge

### User Profile
- ✅ Update personal information
- ✅ Manage contact details
- ✅ Customizable user settings

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                    (React SPA + Vite)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │Dashboard │  │Applications│ │Companies │  │Documents │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Profile  │  │Notifications│ │ Resume  │  │ Settings │      │
│  │          │  │            │  │Analyzer │  │          │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└───────────────────────┬─────────────────────────────────────────┘
                        │ HTTPS/REST API
                        │ (axios + JWT tokens)
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
│                   (Node.js + Express.js)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Middleware Layer                             │  │
│  │  • CORS  • Cookie Parser  • Rate Limiting                │  │
│  │  • File Upload  • JWT Verification                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Controllers & Routes                         │  │
│  │  • Auth (Login, Register, Reset Password, Refresh Token) │  │
│  │  • Applications (CRUD operations)                        │  │
│  │  • Companies (CRUD operations)                           │  │
│  │  • Documents (Upload, View, Delete)                      │  │
│  │  • Notifications (Interview reminders)                   │  │
│  │  • User Profile (Fetch, Update)                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────┬───────────────────────────────┬─────────────────────────┘
        │                               │
        ▼                               ▼
┌──────────────────────┐     ┌──────────────────────┐
│   DATA LAYER         │     │   STORAGE LAYER      │
│   (AWS DynamoDB)     │     │   (AWS S3)           │
├──────────────────────┤     ├──────────────────────┤
│ • register_users     │     │ • Document Storage   │
│   PK: user_id        │     │ • Pre-signed URLs    │
│                      │     │ • Secure Access      │
│ • applications       │     │ • File Management    │
│   PK: user_id        │     └──────────────────────┘
│   SK: application_id │
│                      │
│ • companies          │
│   PK: user_id        │
│   SK: company_id     │
│                      │
│ • documents          │
│   PK: user_id        │
│   SK: document_id    │
└──────────────────────┘

                        ┌──────────────────────┐
                        │   EXTERNAL SERVICES  │
                        ├──────────────────────┤
                        │ • EmailJS            │
                        │   (Password Reset)   │
                        └──────────────────────┘
```

### Architecture Flow

1. **Client Layer (Frontend)**
   - React SPA with routing (react-router)
   - State management with React Query
   - Responsive UI with Tailwind CSS
   - Material-UI components for enhanced UX

2. **Application Layer (Backend)**
   - RESTful API built with Express.js
   - JWT authentication with access & refresh tokens
   - Token refresh interceptor for seamless auth
   - Rate limiting for API protection

3. **Data Layer**
   - **DynamoDB Tables:**
     - `register_users`: User authentication data
     - `applications`: Job application records
     - `companies`: Company database
     - `documents`: Document metadata

4. **Storage Layer**
   - AWS S3 for file storage
   - Pre-signed URLs for secure document access
   - Automatic file naming and organization

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite 6.2.0
- **Styling:** Tailwind CSS 3.4.17
- **UI Library:** Material-UI 6.4.10, Ant Design 5.24.9
- **State Management:** TanStack React Query 5.71.1
- **Routing:** React Router 7.4.0
- **Charts:** Chart.js + react-chartjs-2
- **PDF Viewer:** react-pdf 10.4.1
- **Notifications:** react-hot-toast 2.5.2
- **HTTP Client:** Axios 1.8.4

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5.1.0
- **Database:** AWS DynamoDB (local + cloud)
  - `@aws-sdk/client-dynamodb` 3.1063.0
  - `@aws-sdk/lib-dynamodb` 3.1063.0
- **File Storage:** AWS S3
  - `@aws-sdk/client-s3` 3.1029.0
  - `@aws-sdk/s3-request-presigner` 3.1029.0
- **Authentication:** JWT (jsonwebtoken 9.0.2)
- **Password Hashing:** bcrypt 6.0.0
- **File Upload:** express-fileupload 1.5.2
- **Security:** 
  - CORS 2.8.5
  - express-rate-limit 8.2.1
  - cookie-parser 1.4.7

### DevOps & Deployment
- **Hosting:** AWS EC2 (Backend) + Static hosting (Frontend)
- **Serverless:** AWS Lambda ready (serverless-http)
- **Local Development:** DynamoDB Local

---

## 📁 Project Structure

```
CareerCompass/
│
├── backend/
│   ├── config/
│   │   ├── dbConnect.js          # DynamoDB client configuration
│   │   ├── env.js                # Environment variables loader
│   │   ├── generateTokens.js     # JWT token generation & verification
│   │   └── s3client.js           # S3 client configuration
│   │
│   ├── controllers/
│   │   ├── auth/
│   │   │   ├── Login.js          # User login
│   │   │   ├── Register.js       # User registration
│   │   │   ├── RefreshToken.js   # Token refresh
│   │   │   ├── ForgetPassword.js # Password reset request
│   │   │   ├── ResetPassword.js  # Password reset
│   │   │   └── Logout.js         # User logout
│   │   │
│   │   └── main/
│   │       ├── Applications.js   # Application CRUD
│   │       ├── Companies.js      # Company CRUD
│   │       ├── Documents.js      # Document management
│   │       ├── Notifications.js  # Interview notifications
│   │       ├── User.js           # User profile management
│   │       └── Analyzer.js       # Resume analyzer (WIP)
│   │
│   ├── scripts/
│   │   └── table_creation.sql    # DynamoDB table schemas
│   │
│   ├── .env.example              # Environment variables template
│   ├── server.js                 # Express server
│   ├── handler.js                # Lambda handler
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/               # Images and styles
│   │   ├── components/           # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── NotificationBell.jsx
│   │   │
│   │   ├── config/
│   │   │   ├── AxiosInstance.js  # Axios with token refresh
│   │   │   └── Router.jsx        # Application routing
│   │   │
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx    # Protected routes layout
│   │   │   └── MainLayout.jsx    # Public routes layout
│   │   │
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   │
│   │   │   └── Main/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Applications.jsx
│   │   │       ├── Companies.jsx
│   │   │       ├── Documents.jsx
│   │   │       ├── Profile.jsx
│   │   │       ├── Settings.jsx
│   │   │       └── NotFound.jsx
│   │   │
│   │   ├── services/             # API service functions
│   │   ├── shared/               # Shared utilities
│   │   ├── utilities/            # Helper components
│   │   └── main.jsx              # Application entry point
│   │
│   ├── public/
│   ├── .env.example
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- AWS Account (for DynamoDB and S3)
- DynamoDB Local (for development)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/CareerCompass.git
cd CareerCompass
```

#### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your configurations:
```env
NODE_ENV=development
PORT=8000

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Frontend URLs
FRONTEND_URL_DEV=http://localhost:5173
FRONTEND_URL_PROD=https://your-frontend-url.com

# AWS Configuration (for local development)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local
DYNAMODB_ENDPOINT=http://localhost:5000

# S3 Configuration
S3_BUCKET_NAME=your-bucket-name
```

#### 3. Setup DynamoDB Local

```bash
# Download DynamoDB Local
# https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html

# Run DynamoDB Local on port 5000
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -port 5000
```

#### 4. Create DynamoDB Tables

Use the AWS CLI or DynamoDB admin tool to create tables based on schemas in `backend/scripts/table_creation.sql`

#### 5. Setup Frontend

```bash
cd ../frontend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL_LOCAL=http://localhost:8000
VITE_API_URL_PROD=https://your-api-url.com

# EmailJS Configuration
VITE_SERVICE_ID=your_emailjs_service_id
VITE_TEMPLATE_ID=your_emailjs_template_id
VITE_PUBLIC_KEY=your_emailjs_public_key
```

### Running the Application

#### Backend
```bash
cd backend
npm start
```
Server runs on `http://localhost:8000`

#### Frontend
```bash
cd frontend
npm run dev
```
Application runs on `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `8000` |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | `your_secret_key` |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | `your_refresh_secret` |
| `FRONTEND_URL_DEV` | Local frontend URL | `http://localhost:5173` |
| `FRONTEND_URL_PROD` | Production frontend URL | `https://app.example.com` |
| `AWS_REGION` | AWS region | `ap-south-1` |
| `DYNAMODB_ENDPOINT` | DynamoDB endpoint (local) | `http://localhost:5000` |
| `S3_BUCKET_NAME` | S3 bucket name | `careercompass-docs` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL_LOCAL` | Local API URL | `http://localhost:8000` |
| `VITE_API_URL_PROD` | Production API URL | `https://api.example.com` |
| `VITE_SERVICE_ID` | EmailJS service ID | `service_xxxxxxx` |
| `VITE_TEMPLATE_ID` | EmailJS template ID | `template_xxxxxxx` |
| `VITE_PUBLIC_KEY` | EmailJS public key | `xxxxxxxxxxxxxxx` |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/register` | Register new user | ❌ |
| POST | `/api/login` | User login | ❌ |
| POST | `/api/logout` | User logout | ✅ |
| POST | `/api/refresh-token` | Refresh access token | ❌ |
| POST | `/api/forget-password` | Request password reset | ❌ |
| POST | `/api/reset-password` | Reset password | ❌ |

### Applications
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/applications?user_id={id}` | Get all applications | ✅ |
| POST | `/api/new-application` | Create application | ✅ |
| POST | `/api/edit-application` | Update application | ✅ |
| DELETE | `/api/delete-application` | Delete application | ✅ |

### Companies
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/companies?user_id={id}` | Get all companies | ✅ |
| POST | `/api/companies` | Create company | ✅ |
| PUT | `/api/companies/:id` | Update company | ✅ |
| DELETE | `/api/companies/:id` | Delete company | ✅ |

### Documents
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/get-documents?user_id={id}` | Get all documents | ✅ |
| POST | `/api/upload-document` | Upload document | ✅ |
| DELETE | `/api/delete-document` | Delete document | ✅ |

### User Profile
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/fetch-user?userId={id}` | Get user details | ✅ |
| POST | `/api/edit-profile` | Update profile | ✅ |

### Notifications
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications?user_id={id}` | Get interview reminders | ✅ |

---

## 🚢 Deployment

### Backend Deployment (AWS EC2)

1. Launch EC2 instance (Ubuntu)
2. Install Node.js and dependencies
3. Clone repository
4. Setup environment variables
5. Configure DynamoDB and S3 access
6. Use PM2 for process management
7. Setup Nginx as reverse proxy

See `ec2-setup.md` for detailed instructions.

### Frontend Deployment

#### Option 1: Static Hosting (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

#### Option 2: AWS S3 + CloudFront
```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

### Lambda Deployment (Optional)

See `backend/LAMBDA_DEPLOY.md` for serverless deployment.

---

## 🎨 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)
*Track your application metrics at a glance*

### Applications
![Applications](./screenshots/applications.png)
*Manage all your job applications in one place*

### Companies
![Companies](./screenshots/companies.png)
*Maintain your target company database*

### Documents
![Documents](./screenshots/documents.png)
*Upload and preview your documents*

---

## 🔮 Future Enhancements

- [ ] Resume Analyzer - AI-powered resume analysis against job descriptions
- [ ] Email Integration - Send applications directly from the platform
- [ ] Calendar Integration - Sync interview dates with Google Calendar
- [ ] Analytics Dashboard - Advanced insights and reporting
- [ ] Mobile App - React Native mobile application
- [ ] Chrome Extension - Quick application tracking from job boards

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Icons by [Material-UI Icons](https://mui.com/material-ui/material-icons/)
- Charts by [Chart.js](https://www.chartjs.org/)
- UI Components by [Tailwind CSS](https://tailwindcss.com/)
- Email Service by [EmailJS](https://www.emailjs.com/)

---

## 📞 Support

For support, email your.email@example.com or open an issue in the repository.

---

<div align="center">
  <strong>Made with ❤️ for job seekers everywhere</strong>
</div>
