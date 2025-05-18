import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
// Import pages and layouts
import MainLayout from './components/MainLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import AttendanceConsole from './pages/_attendanceConsole'
import AttendanceDashboard from './pages/_attendanceDashboard'
import UserManagement from './pages/_userManagement'
import AttendanceManagement from './pages/_attendanceManagement'
import EventManagement from './pages/_eventManagement'


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes - inside MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/attendance-dashboard" element={<AttendanceDashboard />} />
          <Route path="/attendance-console" element={<AttendanceConsole />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/attendance-management" element={<AttendanceManagement />} />
          <Route path="/event-management" element={<EventManagement />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
