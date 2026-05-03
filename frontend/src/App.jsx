import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Toast from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleBasedRoute from './components/common/RoleBasedRoute';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import OTPPage from './pages/auth/OTPPage';

import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import OrganiserDashboard from './pages/dashboard/OrganiserDashboard';

import AppointmentListPage from './pages/organiser/AppointmentListPage';
import AppointmentFormPage from './pages/organiser/AppointmentFormPage';
import AppointmentPreviewPage from './pages/organiser/AppointmentPreviewPage';
import AppointmentMeetingsPage from './pages/organiser/AppointmentMeetingsPage';
import ResourceManagementPage from './pages/organiser/ResourceManagementPage';

import CustomerHomePage from './pages/customer/CustomerHomePage';
import BookingFlowPage from './pages/customer/BookingFlowPage';
import BookingConfirmationPage from './pages/customer/BookingConfirmationPage';
import MyAppointmentsPage from './pages/customer/MyAppointmentsPage';
import RescheduleBookingPage from './pages/customer/RescheduleBookingPage';
import ProfilePage from './pages/customer/ProfilePage';
import ProfileAppointmentDetailsPage from './pages/customer/ProfileAppointmentDetailsPage';
import PrivateBookingPage from './pages/public/PrivateBookingPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserDetailsPage from './pages/admin/AdminUserDetailsPage';
import AdminProvidersPage from './pages/admin/AdminProvidersPage';
import AdminActivityPage from './pages/admin/AdminActivityPage';

import ReportsDashboardPage from './pages/reports/ReportsDashboardPage';
import PeakHoursPage from './pages/reports/PeakHoursPage';
import ProviderUtilizationPage from './pages/reports/ProviderUtilizationPage';

const Guard = ({ roles, children }) => (
  <ProtectedRoute><RoleBasedRoute allowedRoles={roles}>{children}</RoleBasedRoute></ProtectedRoute>
);

export default function App() {
  const { toast, showToast } = useAuth();

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => showToast(null)} />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<OTPPage />} />

        <Route path="/customer/dashboard" element={<Guard roles={['customer']}><CustomerDashboard /></Guard>} />
        <Route path="/customer/appointments" element={<Guard roles={['customer']}><CustomerHomePage /></Guard>} />
        <Route path="/customer/book/:appointmentId" element={<Guard roles={['customer']}><BookingFlowPage /></Guard>} />
        <Route path="/customer/bookings/:bookingId/confirmation" element={<Guard roles={['customer']}><BookingConfirmationPage /></Guard>} />
        <Route path="/customer/my-appointments" element={<Guard roles={['customer']}><MyAppointmentsPage /></Guard>} />
        <Route path="/customer/bookings/:bookingId/reschedule" element={<Guard roles={['customer']}><RescheduleBookingPage /></Guard>} />
        <Route path="/customer/profile" element={<Guard roles={['customer']}><ProfilePage /></Guard>} />
        <Route path="/customer/profile/appointments/:bookingId" element={<Guard roles={['customer']}><ProfileAppointmentDetailsPage /></Guard>} />
        <Route path="/book/private/:shareToken" element={<PrivateBookingPage />} />

        <Route path="/organiser/dashboard" element={<Guard roles={['organiser']}><OrganiserDashboard /></Guard>} />
        <Route path="/organiser/appointments" element={<Guard roles={['organiser', 'admin']}><AppointmentListPage /></Guard>} />
        <Route path="/organiser/appointments/new" element={<Guard roles={['organiser', 'admin']}><AppointmentFormPage /></Guard>} />
        <Route path="/organiser/appointments/:id/edit" element={<Guard roles={['organiser', 'admin']}><AppointmentFormPage /></Guard>} />
        <Route path="/organiser/appointments/:id/preview" element={<Guard roles={['organiser', 'admin']}><AppointmentPreviewPage /></Guard>} />
        <Route path="/organiser/appointments/:id/meetings" element={<Guard roles={['organiser', 'admin']}><AppointmentMeetingsPage /></Guard>} />
        <Route path="/organiser/resources" element={<Guard roles={['organiser', 'admin']}><ResourceManagementPage /></Guard>} />
        <Route path="/organiser/reports" element={<Guard roles={['organiser', 'admin']}><ReportsDashboardPage /></Guard>} />

        <Route path="/admin/dashboard" element={<Guard roles={['admin']}><AdminDashboardPage /></Guard>} />
        <Route path="/admin/users" element={<Guard roles={['admin']}><AdminUsersPage /></Guard>} />
        <Route path="/admin/users/:id" element={<Guard roles={['admin']}><AdminUserDetailsPage /></Guard>} />
        <Route path="/admin/providers" element={<Guard roles={['admin']}><AdminProvidersPage /></Guard>} />
        <Route path="/admin/activity" element={<Guard roles={['admin']}><AdminActivityPage /></Guard>} />
        <Route path="/admin/appointments" element={<Guard roles={['admin']}><AppointmentListPage /></Guard>} />
        <Route path="/admin/appointments/new" element={<Guard roles={['admin']}><AppointmentFormPage /></Guard>} />
        <Route path="/admin/appointments/:id/edit" element={<Guard roles={['admin']}><AppointmentFormPage /></Guard>} />
        <Route path="/admin/appointments/:id/preview" element={<Guard roles={['admin']}><AppointmentPreviewPage /></Guard>} />
        <Route path="/admin/appointments/:id/meetings" element={<Guard roles={['admin']}><AppointmentMeetingsPage /></Guard>} />
        <Route path="/admin/reports" element={<Guard roles={['admin']}><ReportsDashboardPage /></Guard>} />

        <Route path="/reports" element={<Guard roles={['organiser', 'admin']}><ReportsDashboardPage /></Guard>} />
        <Route path="/reports/peak-hours" element={<Guard roles={['organiser', 'admin']}><PeakHoursPage /></Guard>} />
        <Route path="/reports/provider-utilization" element={<Guard roles={['organiser', 'admin']}><ProviderUtilizationPage /></Guard>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}