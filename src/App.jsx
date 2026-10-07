
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
import ResellersPage from './pages/admin/ResellersPage';
import ResellerDetailPage from './pages/admin/ResellerDetailPage';
import RequestsPage from './pages/admin/RequestsPage';
import ResellerPage from './pages/reseller/ResellerPage';
import ResellerCardEditPage from './pages/reseller/ResellerCardEditPage';

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
          <Route
            path="/admin/resellers"
            element={
              <ProtectedRoute role="superadmin">
                <ResellersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/resellers/:id"
            element={
              <ProtectedRoute role="superadmin">
                <ResellerDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute role="superadmin">
                <RequestsPage />
              </ProtectedRoute>
            }
          />

          {/* Reseller */}
          <Route
            path="/reseller"
            element={
              <ProtectedRoute role="reseller">
                <ResellerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reseller/cards/:id"
            element={
              <ProtectedRoute role="reseller">
                <ResellerCardEditPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
