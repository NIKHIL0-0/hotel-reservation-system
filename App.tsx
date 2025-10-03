import React from 'react';
import { useState, useEffect } from 'react';
import { Booking, BookingStatus, ConfirmationMethod } from './types';
import Header from './components/Header';
import BookingForm from './components/BookingForm';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import { bookingService, authService } from './lib/supabase';
import { smsService } from './lib/sms';


const App: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);

  // Load bookings from Supabase on component mount
  useEffect(() => {
    loadBookings();
    
    // Set up real-time subscription
    const subscription = bookingService.subscribeToBookings((updatedBookings) => {
      setBookings(updatedBookings);
    });

    // Set up auth state listener
    const { data: { subscription: authSubscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
      setIsAuthenticated(!!user);
      if (!user) {
        setIsAdminView(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      authSubscription?.unsubscribe();
    };
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await bookingService.getBookings();
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (newBookingData: Omit<Booking, 'id' | 'status'>, confirmationMethod: ConfirmationMethod) => {
    try {
      console.log('Creating booking with data:', newBookingData);
      
      const newBooking: Omit<Booking, 'id'> = {
        ...newBookingData,
        status: BookingStatus.PENDING,
        confirmationMethod: confirmationMethod,
      };
      
      console.log('Submitting to Supabase:', newBooking);
      const createdBooking = await bookingService.createBooking(newBooking);
      console.log('Booking created successfully:', createdBooking);
      
      // Send confirmation SMS/WhatsApp to customer about pending reservation
      if (confirmationMethod === 'SMS' || confirmationMethod === 'WhatsApp') {
        const pendingMessage = `🍽️ ReserveEase

Hi ${createdBooking.name}!

We've received your reservation request:
📅 Date: ${createdBooking.date}
🕐 Time: ${createdBooking.time}
👥 Guests: ${createdBooking.guests}

Status: PENDING REVIEW

We'll confirm your reservation shortly!`;
        
        try {
          if (confirmationMethod === 'SMS') {
            await smsService.sendSMS(createdBooking.phone, pendingMessage);
          } else {
            await smsService.sendWhatsApp(createdBooking.phone, pendingMessage);
          }
        } catch (smsError) {
          console.error('Error sending confirmation:', smsError);
          // Don't fail the booking if SMS fails
        }
      }
      
      // Refresh bookings list
      await loadBookings();
      
      // Show success message
      alert('Booking submitted successfully! We will confirm your reservation shortly.');
      
    } catch (error: any) {
      console.error('Error creating booking:', error);
      alert(`Failed to create booking: ${error.message || 'Please try again.'}`);
    }
  };

  const handleBookingStatusChange = async (id: string, status: BookingStatus) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      
      // Find the booking to send notification
      const booking = bookings.find(b => b.id === id);
      if (booking && booking.confirmationMethod && 
          (booking.confirmationMethod === 'SMS' || booking.confirmationMethod === 'WhatsApp')) {
        try {
          const updatedBooking = { ...booking, status };
          await smsService.sendBookingNotification(updatedBooking);
        } catch (smsError) {
          console.error('Error sending status notification:', smsError);
          // Don't fail the status update if SMS fails
        }
      }
      
      // Refresh bookings list
      await loadBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status. Please try again.');
    }
  };

  const handleAdminClick = () => {
    setShowAuthModal(true);
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    setIsAdminView(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-gray-900 font-sans">
      <Header 
        isAdminView={isAdminView} 
        isAuthenticated={isAuthenticated}
        setIsAdminView={setIsAdminView} 
        onAdminClick={handleAdminClick}
        onLogout={handleLogout}
      />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        {isAdminView && isAuthenticated ? (
          <AdminPanel bookings={bookings} onStatusChange={handleBookingStatusChange} />
        ) : (
          <BookingForm onBookingSubmit={handleBookingSubmit} />
        )}
      </main>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
        onAuthenticated={handleAuthenticated}
      />
      
      <footer className="text-center py-6 text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} ReserveEase. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
