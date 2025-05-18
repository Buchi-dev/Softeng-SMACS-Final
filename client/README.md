# SMACS Client Documentation

## Overview
SMACS (Student Management and Attendance Control System) is a modern web application built with React and Vite, providing a comprehensive interface for managing student attendance, user management, and event tracking. The application uses Ant Design (antd) for UI components and offers a responsive, user-friendly interface.

## Technology Stack
- **Framework:** React 
- **Build Tool:** Vite
- **UI Library:** Ant Design (antd)
- **Routing:** React Router DOM
- **HTTP Client:** Axios (implied from services)
- **Date Handling:** Day.js
- **State Management:** React Hooks

## Features

### 1. Authentication
- Login system for administrators
- Registration for new admin accounts
- Secure session management

### 2. User Management
- Create, read, update, and delete users
- Filter users by role (Student/Faculty)
- Search functionality by name or ID
- Tabbed interface for different user categories
- Bulk actions support

### 3. Event Management
- Create and manage events
- Schedule events with date and time
- Track event attendance
- Event categorization and filtering

### 4. Attendance System
- Real-time attendance tracking
- Attendance dashboard with statistics
- Check-in console for event attendance
- Attendance reports and management

### 5. Dashboard
- Overview of system statistics
- Quick access to key functions
- Real-time updates

## Project Structure
```
client/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── MainLayout.jsx # Main application layout
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── _userManagement.jsx
│   │   ├── _eventManagement.jsx
│   │   └── ...
│   ├── services/         # API service functions
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html          # HTML entry point
└── package.json        # Project dependencies
```

## Setup and Installation

1. **Prerequisites**
   - Node.js (Latest LTS version)
   - npm or yarn package manager

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]

   # Navigate to client directory
   cd client

   # Install dependencies
   npm install
   # or
   yarn install
   ```

3. **Development**
   ```bash
   # Start development server
   npm run dev
   # or
   yarn dev
   ```
   The development server will start at `http://localhost:5173`

4. **Production Build**
   ```bash
   # Create production build
   npm run build
   # or
   yarn build
   ```

## Usage Guide

### 1. Authentication
- Access the system through the login page
- New administrators can register through the registration page
- Use valid credentials to log in

### 2. Navigation
- Use the sidebar menu to navigate between different sections
- The sidebar can be collapsed for more screen space
- Breadcrumb navigation shows current location

### 3. User Management
- Access User Management through the sidebar
- Use the search bar to find specific users
- Filter users by role using tabs
- Add new users with the "Add User" button
- Edit or delete users using row actions

### 4. Event Management
- Create new events with date, time, and location
- Manage event details and attendance
- Track event participation
- Generate event reports

### 5. Attendance Tracking
- Use the Attendance Console for check-ins
- View attendance records in the dashboard
- Generate attendance reports
- Manage attendance records

## Development Guidelines

1. **Code Style**
   - Follow React best practices
   - Use functional components with hooks
   - Implement proper error handling
   - Maintain consistent code formatting

2. **Component Structure**
   - Keep components small and focused
   - Use proper prop types
   - Implement error boundaries
   - Follow the container/presenter pattern

3. **State Management**
   - Use React hooks for local state
   - Implement context for global state when needed
   - Keep state management simple and predictable

4. **Performance**
   - Implement proper memoization
   - Use lazy loading for routes
   - Optimize component renders
   - Follow React performance best practices

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Troubleshooting

### Common Issues
1. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check for version conflicts in package.json
   - Verify Vite configuration

2. **Runtime Errors**
   - Check browser console for errors
   - Verify API endpoint configuration
   - Check network requests in browser tools

3. **UI Issues**
   - Clear browser cache
   - Check for CSS conflicts
   - Verify antd component usage

## License
This project is licensed under the ISC License.
