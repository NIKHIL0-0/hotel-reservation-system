import React from 'react';
import { useState } from 'react';
import { Booking, BookingStatus } from '../types';
import BookingCard from './BookingCard';

interface AdminPanelProps {
  bookings: Booking[];
  onStatusChange: (id: string, status: BookingStatus) => void;
}

type AdminTab = 'requests' | 'ongoing' | 'history';

const AdminPanel: React.FC<AdminPanelProps> = ({ bookings, onStatusChange }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('requests');

  const filteredBookings = bookings.filter(booking => {
    switch (activeTab) {
      case 'requests':
        return booking.status === BookingStatus.PENDING;
      case 'ongoing':
        return booking.status === BookingStatus.ACCEPTED || booking.status === BookingStatus.WAITING;
      case 'history':
        return booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.REJECTED;
      default:
        return false;
    }
  }).sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime()); // Sort descending by creation time

  const getTabClass = (tabName: AdminTab) => {
    return activeTab === tabName
      ? 'border-gray-800 text-gray-900'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Manage all reservations from one place.</p>
      </div>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex justify-center space-x-8" aria-label="Tabs">
          <button onClick={() => setActiveTab('requests')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${getTabClass('requests')}`}>
            Requests ({bookings.filter(b => b.status === BookingStatus.PENDING).length})
          </button>
          <button onClick={() => setActiveTab('ongoing')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${getTabClass('ongoing')}`}>
            Ongoing ({bookings.filter(b => b.status === BookingStatus.ACCEPTED || b.status === BookingStatus.WAITING).length})
          </button>
          <button onClick={() => setActiveTab('history')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${getTabClass('history')}`}>
            History ({bookings.filter(b => b.status === BookingStatus.COMPLETED || b.status === BookingStatus.REJECTED).length})
          </button>
        </nav>
      </div>
      
      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} onStatusChange={onStatusChange} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">No bookings in this category.</p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
