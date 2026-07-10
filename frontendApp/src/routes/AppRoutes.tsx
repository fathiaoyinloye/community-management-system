import { Navigate, Route, Routes } from 'react-router-dom'
import App from '../App'
import PlatformAdminLogin from '../pages/auth/PlatformAdminLogin'
import CommunityAdminLogin from '../pages/auth/CommunityAdminLogin'
import PlatformAdminDashboard from '../pages/platform-admin/PlatformAdminDashboard'
import CommunityInfo from '../pages/community-admin/CommunityInfo'
import LevyTypes from '../pages/community-admin/LevyTypes'
import { ProtectedRoute } from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />

      <Route path="/platform-admin/login" element={<PlatformAdminLogin />} />
      <Route
        path="/platform-admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['platform_admin']} redirectTo="/platform-admin/login">
            <PlatformAdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/community-admin/login" element={<CommunityAdminLogin />} />
      <Route
        path="/community-admin/community-info"
        element={
          <ProtectedRoute allowedRoles={['community_admin']} redirectTo="/community-admin/login">
            <CommunityInfo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community-admin/levies"
        element={
          <ProtectedRoute allowedRoles={['community_admin']} redirectTo="/community-admin/login">
            <LevyTypes />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
