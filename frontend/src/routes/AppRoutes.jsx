import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"
import Analyze from "../pages/Analyze"
import History from "../pages/History"
import Reports from "../pages/Reports"
import Profile from "../pages/Profile"
import NotFound from "../pages/NotFound"
import Layout from "../components/layout/Layout"
import ForgotPassword from "../pages/ForgotPassword"
import ResetPassword from "../pages/ResetPassword"
import AdminLayout from "../components/layout/AdminLayout"
import AdminDashboard from "../pages/AdminDashboard"
import AdminUsers from "../pages/AdminUsers"
import AdminAnalyses from "../pages/AdminAnalyses"
import AdminReports from "../pages/AdminReports"
import AdminStatistics from "../pages/AdminStatistics"
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <p>Loading...</p>
  if (!user) return <Navigate to="/login" />

  return children
}

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <p>Loading...</p>
  if (!user) return <Navigate to="/login" />
  if (user.role !== "admin") return <Navigate to="/dashboard" />

  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout><Dashboard /></Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/analyze"
        element={
          <PrivateRoute>
            <Layout><Analyze /></Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/history"
        element={
          <PrivateRoute>
            <Layout><History /></Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <Layout><Reports /></Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Layout><Profile /></Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <AdminRoute>
            <AdminLayout>
              <Profile />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin-users"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin-analyses"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminAnalyses />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin-reports"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminReports />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin-statistics"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminStatistics />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes