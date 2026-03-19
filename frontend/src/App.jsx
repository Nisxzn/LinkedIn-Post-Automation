import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import GeneratePost from './pages/GeneratePost'
import Scheduler from './pages/Scheduler'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import LinkedInCallback from './pages/LinkedInCallback'
import DashboardLayout from './components/layout/DashboardLayout'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' },
            success: { iconTheme: { primary: '#2563EB', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* LinkedIn OAuth callback */}
          <Route
            path="/linkedin/callback"
            element={<PrivateRoute><LinkedInCallback /></PrivateRoute>}
          />

          {/* Protected dashboard routes */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="generate" element={<GeneratePost />} />
            <Route path="scheduler" element={<Scheduler />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
