# SMACS (Student Management and Attendance Control System)

## Overview
SMACS is a comprehensive web-based system designed for managing student attendance, user administration, and event tracking. The system consists of a modern React frontend and a robust Node.js backend, providing a complete solution for educational institutions.

## Technology Stack

### Frontend (Client)
- **Framework:** React with Vite
- **UI Library:** Ant Design (antd)
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Date Handling:** Day.js
- **State Management:** React Hooks

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** bcrypt
- **Middleware:** CORS enabled

## Core Features

### 1. Authentication & Security
- Secure login system for administrators
- Registration for new admin accounts
- Password hashing using bcrypt
- Protected routes and session management
- CORS protection

### 2. User Management
- CRUD operations for user accounts
- Role-based user categorization (Student/Faculty)
- Advanced search and filtering capabilities
- Bulk user actions support
- User profile management

### 3. Event Management
- Create and schedule events
- Event categorization and filtering
- Real-time event tracking
- Attendance monitoring
- Event reports generation

### 4. Attendance System
- Real-time attendance tracking
- QR code-based check-in system
- Attendance statistics and analytics
- Comprehensive attendance reports
- Automated attendance monitoring

### 5. Dashboard & Analytics
- System-wide statistics
- Real-time updates
- Performance metrics
- User activity monitoring
- Data visualization

## Project Structure

```
project/
├── client/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── App.jsx      
│   │   └── main.jsx     
│   └── public/          
│
├── server/
│   ├── _admins/         # Admin functionality
│   ├── _users/          # User management
│   ├── _event/          # Event management
│   ├── _attendance/     # Attendance tracking
│   ├── configs/         # Configuration files
│   └── index.js         # Server entry point
```

## API Endpoints

### Admin Routes (`/api/admins`)
- `POST /` - Create admin
- `POST /login` - Admin login
- `GET /:id` - Get admin details
- `POST /reset-password` - Password reset

### User Routes (`/api/users`)
- `POST /` - Create user
- `GET /` - List users
- `GET /idNumber/:idNumber` - Get user by ID
- `PUT /:idNumber` - Update user
- `DELETE /:idNumber` - Delete user

### Event Routes (`/api/events`)
- `POST /` - Create event
- `GET /` - List events
- `GET /:id` - Get event
- `PUT /:id` - Update event
- `DELETE /:id` - Delete event
- `POST /check-in` - Record attendance

## Setup and Installation

### Prerequisites
- Node.js (Latest LTS version)
- MongoDB
- npm or yarn package manager

### Client Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
# Server runs on http://localhost:5173
```

### Server Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start development server
npm run dev
# Server runs on http://localhost:5000
```

## Development Guidelines

### Code Standards
- Use functional React components
- Implement proper error handling
- Follow consistent code formatting
- Use proper documentation
- Implement security best practices

### Performance Optimization
- Component memoization
- Lazy loading for routes
- Database query optimization
- Proper caching strategies
- Regular performance monitoring

## Troubleshooting

### Common Issues
1. **Build Errors**
   - Clear node_modules and reinstall
   - Check package version conflicts
   - Verify configuration files

2. **Runtime Errors**
   - Check console logs
   - Verify API endpoints
   - Check database connection
   - Validate environment variables

3. **Database Issues**
   - Verify MongoDB connection
   - Check authentication credentials
   - Validate schema constraints

## Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Submit pull request

## License
This project is licensed under the ISC License.

## Support
For support and queries, please create an issue in the repository or contact the development team.
