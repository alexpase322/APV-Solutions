import React from 'react';
import AppHeader from '../../components/nfc/AppHeader';
import AppointmentsPanel from '../../components/nfc/AppointmentsPanel';
import BookingSettings from '../../components/nfc/BookingSettings';
import DashboardNav from './DashboardNav';
import useNoIndex from '../../hooks/useNoIndex';

/** Card owner: who booked with me + booking settings. */
const DashboardAppointmentsPage = () => {
  useNoIndex('Appointments · APV');
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <AppHeader subtitle="MY DIGITAL CARD" />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <DashboardNav />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#263646]">Appointments</h1>
          <p className="text-gray-600">People who tap your card can book a time with you. You get an email for every booking.</p>
        </div>
        <AppointmentsPanel endpoint="/api/me/appointments" cancelPath={(a) => `/api/me/appointments/${a.id}/cancel`} title="Your appointments" />
        <BookingSettings endpoint="/api/me/booking" />
      </main>
    </div>
  );
};

export default DashboardAppointmentsPage;
