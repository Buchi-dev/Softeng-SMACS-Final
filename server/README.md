# SMACS Server Documentation

## Overview
SMACS (Student Management and Attendance Control System) is a comprehensive backend server built with Node.js and Express.js, providing RESTful API endpoints for user management, event handling, attendance tracking, and administrative functions.

## Technology Stack
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Security:** bcrypt for password hashing
- **Cross-Origin Resource Sharing:** CORS enabled

## Project Structure
```
server/
├── _admins/            # Admin-related functionality
│   ├── _adminRoutes.js
│   └── _adminController.js
├── _users/             # User management functionality
│   ├── _userRoutes.js
│   └── _userController.js
├── _event/             # Event management functionality
│   ├── _eventRoute.js
│   └── _eventController.js
├── _attendance/        # Attendance tracking functionality
│   ├── _attendanceRoutes.js
│   └── _attendanceController.js
├── configs/            # Configuration files
│   └── db.js          # Database configuration
├── node_modules/       # Dependencies
├── index.js           # Main application entry point
├── package.json       # Project metadata and dependencies
└── package-lock.json  # Locked dependencies
```

## Database Models/ERD

### User Model
```
User {
  idNumber: String (required, unique)
  firstName: String (required)
  lastName: String (required)
  email: String (required, unique)
  course: String (required)
  yearLevel: Number (required)
  section: String (required)
  role: String (enum: ['student', 'faculty'])
  createdAt: Date
  updatedAt: Date
}
```

### Admin Model
```
Admin {
  username: String (required, unique)
  password: String (required)
  firstName: String (required)
  lastName: String (required)
  email: String (required, unique)
  createdAt: Date
  updatedAt: Date
}
```

### Event Model
```
Event {
  title: String (required)
  description: String
  date: Date (required)
  startTime: String (required)
  endTime: String (required)
  venue: String (required)
  organizer: String (required)
  status: String (enum: ['upcoming', 'ongoing', 'completed', 'cancelled'])
  createdAt: Date
  updatedAt: Date
}
```

### Attendance Model
```
Attendance {
  eventId: ObjectId (ref: 'Event')
  userId: ObjectId (ref: 'User')
  checkInTime: Date
  status: String (enum: ['present', 'absent', 'late'])
  createdAt: Date
  updatedAt: Date
}
```

### Entity Relationships
- One Admin can manage many Events (1:N)
- One Event can have many Attendances (1:N)
- One User can have many Attendances (1:N)
- Events and Users have a Many-to-Many relationship through Attendance records

## API Endpoints

### Admin Routes (`/api/admins`)
- `POST /` - Create new admin
- `POST /login` - Admin login
- `GET /:id` - Get admin details
- `POST /reset-password` - Reset admin password

### User Routes (`/api/users`)
- `POST /` - Create new user
- `GET /` - Get all users
- `GET /idNumber/:idNumber` - Get user by ID number
- `GET /mongo/:id` - Get user by MongoDB ID
- `PUT /:idNumber` - Update user
- `DELETE /:idNumber` - Delete user

### Event Routes (`/api/events`)
- `POST /` - Create new event
- `GET /` - Get all events
- `GET /:id` - Get specific event
- `PUT /:id` - Update event
- `DELETE /:id` - Delete event
- `POST /check-in` - Record event attendance

### Attendance Routes (`/api/attendance`)
- Endpoints for managing attendance records

## Setup and Installation

1. **Prerequisites**
   - Node.js (Latest LTS version)
   - MongoDB (Running locally or accessible instance)

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]

   # Navigate to server directory
   cd server

   # Install dependencies
   npm install
   ```

3. **Configuration**
   - MongoDB connection: The server connects to `mongodb://localhost:27017/smacs-db`
   - Server port: Default is 5000
   - CORS: Configured for frontend at `http://localhost:5173`

4. **Running the Server**
   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

## Dependencies
- `express`: ^5.1.0 - Web framework
- `mongoose`: ^8.15.0 - MongoDB ODM
- `bcrypt`: ^6.0.0 - Password hashing
- `cors`: ^2.8.5 - CORS middleware
- `nodemon`: ^3.1.10 - Development server
- `router`: ^2.2.0 - Express routing

## Security Features
- Password hashing using bcrypt
- CORS protection
- Request body parsing and validation
- Secure routes and authentication

## Error Handling
The server implements comprehensive error handling for:
- Database connection errors
- Invalid requests
- Authentication errors
- Resource not found errors

## Development
- Use `npm run dev` for development with hot-reloading
- Server runs on `http://localhost:5000`
- API endpoints are prefixed with `/api`

## Production
For production deployment:
1. Ensure all environment variables are properly set
2. Configure appropriate CORS settings
3. Set up proper MongoDB connection string
4. Use process manager (e.g., PM2) for running the server

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
ISC License
