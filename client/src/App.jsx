import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// Import pages
import Login from './pages/Login'
import Register from './pages/Register'
import AttendanceConsole from './pages/_attendanceConsole'
import AttendanceDashboard from './pages/_attendanceDashboard'
import AttendeesManagement from './pages/_attendeesManagement'
import AttendanceManagement from './pages/_attendanceManagement'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/attendance-console" element={<AttendanceConsole />} />
        <Route path="/attendance-dashboard" element={<AttendanceDashboard />} />
        <Route path="/user-management" element={<AttendeesManagement />} />
        <Route path="/attendance-management" element={<AttendanceManagement />} />
      </Routes>
    </Router>
  )
}

export default App
