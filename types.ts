export enum BookingStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  WAITING = 'Waiting',
  COMPLETED = 'Completed',
}

export type ConfirmationMethod = 'SMS' | 'WhatsApp' | 'Email';

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  guests: number;
  date: string;
  time: string;
  note?: string;
  status: BookingStatus;
  confirmationMethod?: ConfirmationMethod;
}
