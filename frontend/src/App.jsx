import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateItem from './pages/CreateItem.jsx'
import ItemDetails from './pages/ItemDetails.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      {/* First screen is Signup */}
      <Route path="/" element={<Navigate to="/signup" replace />} />

      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/items/new"
        element={
          <ProtectedRoute>
            <CreateItem />
          </ProtectedRoute>
        }
      />

      <Route
        path="/items/:id"
        element={
          <ProtectedRoute>
            <ItemDetails />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  )
}