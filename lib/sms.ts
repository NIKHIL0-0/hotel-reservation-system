import { Booking, BookingStatus } from '../types'

export interface SMSConfig {
  accountSid: string
  authToken: string
  phoneNumber: string
}

export class SMSService {
  private config: SMSConfig

  constructor(config: SMSConfig) {
    this.config = config
  }

  // Send SMS via serverless function (we'll create this)
  async sendSMS(to: string, message: string): Promise<void> {
    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send SMS')
      }
    } catch (error) {
      console.error('SMS sending error:', error)
      throw error
    }
  }

  // Send WhatsApp message via serverless function
  async sendWhatsApp(to: string, message: string): Promise<void> {
    try {
      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send WhatsApp message')
      }
    } catch (error) {
      console.error('WhatsApp sending error:', error)
      throw error
    }
  }

  // Generate booking confirmation message
  generateConfirmationMessage(booking: Booking): string {
    return `🍽️ ReserveEase Confirmation

Hi ${booking.name}!

Your reservation has been CONFIRMED:
📅 Date: ${booking.date}
🕐 Time: ${booking.time}
👥 Guests: ${booking.guests}
${booking.note ? `📝 Note: ${booking.note}` : ''}

We look forward to serving you!

Need to change? Call us at our restaurant number.`
  }

  // Generate booking rejection message
  generateRejectionMessage(booking: Booking): string {
    return `🍽️ ReserveEase Update

Hi ${booking.name},

Unfortunately, we cannot accommodate your reservation for:
📅 Date: ${booking.date}
🕐 Time: ${booking.time}
👥 Guests: ${booking.guests}

Please call us to discuss alternative times or dates.

Thank you for understanding!`
  }

  // Generate waiting list message
  generateWaitingMessage(booking: Booking): string {
    return `🍽️ ReserveEase Update

Hi ${booking.name}!

Your reservation is on our WAITING LIST:
📅 Date: ${booking.date}
🕐 Time: ${booking.time}
👥 Guests: ${booking.guests}

We'll notify you immediately if a spot opens up!

Thank you for your patience.`
  }

  // Send notification based on booking status
  async sendBookingNotification(booking: Booking): Promise<void> {
    if (!booking.confirmationMethod || !booking.phone) {
      return
    }

    let message: string

    switch (booking.status) {
      case BookingStatus.ACCEPTED:
        message = this.generateConfirmationMessage(booking)
        break
      case BookingStatus.REJECTED:
        message = this.generateRejectionMessage(booking)
        break
      case BookingStatus.WAITING:
        message = this.generateWaitingMessage(booking)
        break
      default:
        return // Don't send notifications for other statuses
    }

    try {
      if (booking.confirmationMethod === 'SMS') {
        await this.sendSMS(booking.phone, message)
      } else if (booking.confirmationMethod === 'WhatsApp') {
        await this.sendWhatsApp(booking.phone, message)
      }
    } catch (error) {
      console.error('Failed to send booking notification:', error)
      throw error
    }
  }
}

// Create a singleton instance (will be configured with environment variables)
export const smsService = new SMSService({
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
  phoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER || '',
})