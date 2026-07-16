import { Navigate, Route, Routes } from 'react-router-dom'
import App from '../App'
import PlatformAdminLogin from '../pages/auth/PlatformAdminLogin'
import CommunityAdminLogin from '../pages/auth/CommunityAdminLogin'
import ResidentLogin from '../pages/auth/ResidentLogin'
import ResidentRegister from '../pages/auth/ResidentRegister'

import PlatformAdminDashboard from '../pages/platform-admin/PlatformAdminDashboard'
import PlatformAdminCommunities from '../pages/platform-admin/PlatformAdminCommunities'
import CommunityInfo from '../pages/community-admin/CommunityInfo'
import LevyTypes from '../pages/community-admin/LevyTypes'
import Houses from '../pages/community-admin/Houses'
import Payments from '../pages/community-admin/Payments'
import ResidentDashboard from '../pages/resident/Dashboard'
import ResidentPayments from '../pages/resident/Payments'
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
      <Route
        path="/platform-admin/communities"
        element={
          <ProtectedRoute allowedRoles={['platform_admin']} redirectTo="/platform-admin/login">
            <PlatformAdminCommunities />
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
        path="/community-admin/houses"
        element={
          <ProtectedRoute allowedRoles={['community_admin']} redirectTo="/community-admin/login">
            <Houses />
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
      <Route
        path="/community-admin/payments"
        element={
          <ProtectedRoute allowedRoles={['community_admin']} redirectTo="/community-admin/login">
            <Payments />
          </ProtectedRoute>
        }
      />

      <Route path="/resident/login" element={<ResidentLogin />} />
      <Route path="/resident/register" element={<ResidentRegister />} />
      <Route
        path="/resident/dashboard"
        element={
          <ProtectedRoute allowedRoles={['resident']} redirectTo="/resident/login">
            <ResidentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resident/payments"
        element={
          <ProtectedRoute allowedRoles={['resident']} redirectTo="/resident/login">
            <ResidentPayments />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}


