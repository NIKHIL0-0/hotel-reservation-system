import React from 'react';
import { Booking, BookingStatus } from '../types';
import { ClockIcon, MailIcon, PhoneIcon, UsersIcon } from './icons';

interface BookingCardProps {
  booking: Booking;
  onStatusChange: (id: string, status: BookingStatus) => void;
}

const statusColors: { [key in BookingStatus]: string } = {
    [BookingStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    [BookingStatus.ACCEPTED]: 'bg-green-100 text-green-800 border-green-300',
    [BookingStatus.WAITING]: 'bg-blue-100 text-blue-800 border-blue-300',
    [BookingStatus.COMPLETED]: 'bg-gray-100 text-gray-800 border-gray-300',
    [BookingStatus.REJECTED]: 'bg-red-100 text-red-800 border-red-300',
};


const BookingCard: React.FC<BookingCardProps> = ({ booking, onStatusChange }) => {
  const renderActions = () => {
    switch (booking.status) {
      case BookingStatus.PENDING:
        return (
          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={() => onStatusChange(booking.id, BookingStatus.ACCEPTED)} className="flex-1 bg-green-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-green-600 transition">Accept</button>
            <button onClick={() => onStatusChange(booking.id, BookingStatus.WAITING)} className="flex-1 bg-blue-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-600 transition">Waitlist</button>
            <button onClick={() => onStatusChange(booking.id, BookingStatus.REJECTED)} className="flex-1 bg-red-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-red-600 transition">Reject</button>
          </div>
        );
      case BookingStatus.ACCEPTED:
      case BookingStatus.WAITING:
        return (
          <div className="flex mt-4">
            <button onClick={() => onStatusChange(booking.id, BookingStatus.COMPLETED)} className="w-full bg-gray-800 text-white px-3 py-1.5 text-sm rounded-md hover:bg-gray-700 transition">Mark as Completed</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-gray-800">{booking.name}</h3>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[booking.status]}`}>
            {booking.status}
          </span>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex items-center"><PhoneIcon className="w-4 h-4 mr-2" /> {booking.phone}</p>
          {booking.email && <p className="flex items-center"><MailIcon className="w-4 h-4 mr-2" /> {booking.email}</p>}
          <p className="flex items-center"><UsersIcon className="w-4 h-4 mr-2" /> {booking.guests} guest(s)</p>
          <p className="flex items-center"><ClockIcon className="w-4 h-4 mr-2" /> {new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
          {booking.note && <p className="mt-2 pt-2 border-t border-gray-200 text-gray-500 italic">Note: "{booking.note}"</p>}
          {booking.confirmationMethod && <p className="mt-2 text-xs text-gray-400">Confirmation via: {booking.confirmationMethod}</p>}
        </div>
      </div>
      {renderActions()}
    </div>
  );
};

export default BookingCard;
