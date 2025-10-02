import React from 'react';
import { useState } from 'react';
import { TIME_SLOTS } from '../constants';
import { Booking, ConfirmationMethod } from '../types';
import Modal from './Modal';
import { CheckCircleIcon } from './icons';

interface BookingFormProps {
  onBookingSubmit: (booking: Omit<Booking, 'id' | 'status'>, confirmationMethod: ConfirmationMethod) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setGuests(2);
    setDate('');
    setTime('');
    setNote('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !time || guests < 1) {
      setError('Please fill in all required fields: Name, Phone, Date, and select a Time Slot.');
      return;
    }
    setError('');
    setShowConfirmationModal(true);
  };

  const handleConfirm = (method: ConfirmationMethod) => {
    const newBooking: Omit<Booking, 'id' | 'status'> = {
      name,
      phone,
      email,
      guests,
      date,
      time,
      note,
      confirmationMethod: method,
    };
    onBookingSubmit(newBooking, method);
    setShowConfirmationModal(false);
    setShowSuccessModal(true);
    resetForm();
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 md:p-12 shadow-lg rounded-lg border border-gray-200">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Book Your Table</h1>
        <p className="text-gray-500 mt-2">Experience dining at its finest. Reserve your spot now.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-800 transition" placeholder="John Doe" required />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-800 transition" placeholder="(123) 456-7890" required />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-gray-400">(Optional)</span></label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-800 transition" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
          <input type="number" id="guests" value={guests} onChange={(e) => setGuests(parseInt(e.target.value, 10))} min="1" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-800 transition" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Reservation Date</label>
            <input 
              type="date" 
              id="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-800 transition" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select a Time Slot</label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_SLOTS.slice(0, 4).map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`px-3 py-2 text-sm rounded-md transition border-2 ${time === slot ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-800'}`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {TIME_SLOTS.slice(4).map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`px-3 py-2 text-sm rounded-md transition border-2 ${time === slot ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-800'}`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">Special Requests <span className="text-gray-400">(Optional)</span></label>
          <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-800 focus:border-gray-800 transition" placeholder="e.g., anniversary, window seat"></textarea>
        </div>
        
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors duration-300 text-lg">
          Request Booking
        </button>
      </form>
      
      <Modal isOpen={showConfirmationModal} onClose={() => setShowConfirmationModal(false)}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Your Booking</h2>
          <p className="text-gray-600 mb-6">How would you like to receive your confirmation?</p>
          <div className="flex flex-col space-y-3">
            <button onClick={() => handleConfirm('SMS')} className="w-full bg-gray-800 text-white py-2.5 rounded-md hover:bg-gray-700 transition">Confirm via SMS</button>
            <button onClick={() => handleConfirm('WhatsApp')} className="w-full bg-gray-800 text-white py-2.5 rounded-md hover:bg-gray-700 transition">Confirm via WhatsApp</button>
            <button onClick={() => handleConfirm('Email')} className="w-full bg-gray-800 text-white py-2.5 rounded-md hover:bg-gray-700 transition" disabled={!email}>Confirm via Email {!email && '(add email)'}</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <div className="text-center p-4">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Sent!</h2>
          <p className="text-gray-600">Your booking request has been successfully submitted. We will confirm your reservation shortly.</p>
           <button onClick={() => setShowSuccessModal(false)} className="mt-6 bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700 transition">Close</button>
        </div>
      </Modal>

    </div>
  );
};

export default BookingForm;
