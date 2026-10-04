
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import LegalPage from './pages/LegalPage';

import NfcLandingPage from './pages/nfc/NfcLandingPage';
import PublicCardPage from './pages/nfc/PublicCardPage';
import LoginPage from './pages/auth/LoginPage';
import ActivatePage from './pages/auth/ActivatePage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AdminPage from './pages/admin/AdminPage';
import AdminCardEditPage from './pages/admin/AdminCardEditPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Marketing site */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/nfc" element={<NfcLandingPage />} />

          {/* Public NFC card — this is the URL programmed into each chip */}
          <Route path="/c/:code" element={<PublicCardPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/activate" element={<ActivatePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Card owner */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="user">
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Super admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="superadmin">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cards/:id"
            element={
              <ProtectedRoute role="superadmin">
                <AdminCardEditPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
