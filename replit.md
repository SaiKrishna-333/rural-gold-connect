# RuralConnect - Decentralized P2P Lending Platform

## Overview

RuralConnect is a peer-to-peer lending platform designed to empower rural finance through decentralized lending mechanisms. The application connects borrowers with lenders, featuring KYC verification, face authentication, and comprehensive loan management capabilities. Built as a full-stack application with a React frontend and Node.js/Express backend, it provides secure, transparent financial connectivity for rural communities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system featuring a premium gold palette and glass-morphism effects
- **Routing**: React Router v6 for client-side navigation
- **State Management**: React Context API for authentication state, TanStack Query for server state
- **Animations**: Framer Motion for smooth transitions and interactive elements

**Design System**
- Dark theme with glass-morphism aesthetic (glass panels with backdrop blur)
- Gold-accented color scheme representing premium/trust (HSL-based color tokens)
- Responsive layout with mobile-first approach
- Custom glassmorphic card components for consistent visual language

**Key Pages & Features**
- Landing page with marketing content
- Authentication flows (login, signup, face verification)
- Dashboard with analytics and statistics visualization using Recharts
- Loan management (issue, view all, borrower-specific, repayment)
- User settings and profile management
- Protected routes requiring authentication

**Component Architecture**
- Layout components (DashboardLayout with Sidebar and Topbar)
- Reusable UI components from shadcn/ui (buttons, cards, forms, dialogs, etc.)
- Custom GlassCard component for consistent glass-morphism effects
- Form handling with react-hook-form and zod validation

### Backend Architecture

**Technology Stack**
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication with bcryptjs for password hashing
- **File Handling**: Multer for multipart/form-data processing
- **Document Processing**: Tesseract.js for OCR, Sharp for image processing

**API Structure**
RESTful API with the following route modules:
- `/api/auth` - User registration, login, OTP verification, KYC document upload
- `/api/loans` - Loan creation, retrieval, status management, repayment
- `/api/face` - Biometric face verification endpoints
- `/api/analytics` - Dashboard statistics and loan analytics
- `/api/wallet` - Wallet balance and transaction history
- `/api/user` - User profile management and verification status

**Authentication & Authorization**
- JWT tokens stored in localStorage on client, sent via Authorization header
- Middleware-based route protection (`authenticateToken`)
- Password hashing using bcryptjs before storage
- Token verification on protected endpoints

**Data Models**
- **User Model**: Stores user credentials, role (Lender/Borrower), KYC status, face verification status, wallet address, Aadhar hash
- **Loan Model**: Tracks loan amount, duration, interest rate, purpose, status (Pending/Active/Completed), repayment details, installments

**Verification System**
- Document verification via OCR (Aadhar, PAN, Voter ID pattern matching)
- Secure hashing of sensitive documents (Aadhar) using SHA-256 with salting
- Biometric face verification with confidence scoring
- Cosine similarity for face matching (mock implementation ready for integration)

### External Dependencies

**Payment Integration**
- **Razorpay**: Payment gateway for loan disbursement and repayment processing (configured but requires API keys)
- **PayU**: Alternative payment processor (configured in backend)

**SMS/Communication**
- **Fast2SMS**: OTP delivery for phone verification during registration (requires API key configuration)

**Development Tools**
- **Concurrently**: Runs frontend and backend servers simultaneously in development
- **Nodemon**: Auto-restart for backend during development
- **ESLint**: Code linting with TypeScript support
- **TypeScript**: Type safety across frontend codebase

**Database**
- **MongoDB**: Primary database (connection URI via environment variable `MONGODB_URI`)
- Mongoose for schema definition and data validation
- Graceful handling of database connection failures

**Frontend Libraries**
- **@tanstack/react-query**: Server state management and caching
- **date-fns**: Date formatting and manipulation
- **axios**: HTTP client for API requests (used in backend)
- **framer-motion**: Animation library
- **recharts**: Charting library for analytics visualization
- **sonner**: Toast notifications
- **react-hook-form** with **@hookform/resolvers**: Form handling and validation
- **zod**: Schema validation (implied by resolver usage)

**Environment Configuration**
The application expects environment variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `FAST2SMS_API_KEY`: API key for SMS service
- `PAYU_KEY`, `PAYU_SALT`, `PAYU_MERCHANT_ID`: PayU payment credentials
- `PORT`: Backend server port (defaults to 3000)
- `VITE_API_URL`: Frontend API base URL (defaults to http://localhost:3000/api)

**Deployment Considerations**
- Frontend builds to static files via Vite
- Backend runs as standalone Express server
- Separate dev and production build scripts
- CORS enabled for cross-origin requests
- Frontend dev server on port 5000, backend on port 3000