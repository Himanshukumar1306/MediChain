import React, { useEffect, useState, useContext } from 'react';
import { collection, query, where, getDocs, doc, setDoc } from '@firebase/firestore';
import { auth, db } from '../firebase/config';
import { BookingTabs } from '../doc-dashboard/Tabs';
import AppointmentCard from '../components/AppointmentCard';
import { AuthContext } from '../AuthContext';
import { PatientSidebar } from '../doc-dashboard/PatientSidebar';

function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const appointmentsRef = collection(db, 'appointments');
        const q = query(appointmentsRef, where('patientId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const fetchedAppointments = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          startTime: doc.data().date.toDate(),
        }));

        setAppointments(fetchedAppointments);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [currentUser]);

  const filteredAppointments = appointments.filter(appointment => {
    const now = new Date();
    const appointmentDate = new Date(appointment.startTime);

    switch (activeTab) {
      case 'Upcoming':
        return appointmentDate > now && appointment.status !== 'cancelled';
      case 'Past':
        return appointmentDate < now || appointment.status === 'completed';
      case 'Cancelled':
        return appointment.status === 'cancelled';
      default:
        return true;
    }
  });

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await setDoc(appointmentRef, {
        status: 'cancelled',
        updatedAt: new Date()
      }, { merge: true });

      // Update local state to reflect the change
      setAppointments(prevAppointments => 
        prevAppointments.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'cancelled' }
            : apt
        )
      );
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment');
    }
  };

  if (loading) {
    return <div className="p-6 text-center mt-20">Loading appointments...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500 mt-20">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-20 text-left">
      <BookingTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {filteredAppointments.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          No {activeTab.toLowerCase()} appointments found
        </p>
      ) : (
        <div className="space-y-6">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              handleCancelAppointment={handleCancelAppointment}
            />
          ))}
        </div>
      )}

      <PatientSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        patientId={selectedPatientId}
        appointmentId={selectedAppointmentId}
      />
    </div>
  );
}

export default AppointmentsPage;