import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SiteLayout from './site/layout/SiteLayout';
import ProtectedRoute, { FullPageLoader } from './components/auth/ProtectedRoute';

// Marketing site (rendered inside SiteLayout)
const HomePage = lazy(() => import('./site/pages/HomePage'));
const ServicesPage = lazy(() => import('./site/pages/ServicesPage'));
const PortfolioPage = lazy(() => import('./site/pages/PortfolioPage'));
const NfcPage = lazy(() => import('./site/pages/NfcPage'));
const AboutPage = lazy(() => import('./site/pages/AboutPage'));
const LegalPage = lazy(() => import('./site/pages/LegalPage'));
const NotFoundPage = lazy(() => import('./site/pages/NotFoundPage'));

// NFC cards app
const PublicCardPage = lazy(() => import('./pages/nfc/PublicCardPage'));
const ManageAppointmentPage = lazy(() => import('./pages/nfc/ManageAppointmentPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const ActivatePage = lazy(() => import('./pages/auth/ActivatePage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const DashboardAppointmentsPage = lazy(() => import('./pages/dashboard/DashboardAppointmentsPage'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const AdminCardEditPage = lazy(() => import('./pages/admin/AdminCardEditPage'));
const ResellersPage = lazy(() => import('./pages/admin/ResellersPage'));
const ResellerDetailPage = lazy(() => import('./pages/admin/ResellerDetailPage'));
const RequestsPage = lazy(() => import('./pages/admin/RequestsPage'));
const ResellerPage = lazy(() => import('./pages/reseller/ResellerPage'));
const ResellerCardEditPage = lazy(() => import('./pages/reseller/ResellerCardEditPage'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<FullPageLoader />}>
          <Routes>
            {/* Marketing site */}
            <Route element={<SiteLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/nfc" element={<NfcPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Public NFC card — this is the URL programmed into each chip */}
            <Route path="/c/:code" element={<PublicCardPage />} />
            {/* Link from the booking confirmation email */}
            <Route path="/appointment" element={<ManageAppointmentPage />} />

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
            <Route
              path="/dashboard/appointments"
              element={
                <ProtectedRoute role="user">
                  <DashboardAppointmentsPage />
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
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
