import { VercelRequest, VercelResponse } from '@vercel/node'
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { to, message } = req.body

    if (!to || !message) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Format phone number for WhatsApp (must include country code and 'whatsapp:' prefix)
    const whatsappNumber = `whatsapp:${to.startsWith('+') ? to : '+1' + to}`

    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`, // Your Twilio WhatsApp number
      to: whatsappNumber,
    })

    res.status(200).json({ 
      success: true, 
      messageSid: result.sid 
    })
  } catch (error) {
    console.error('WhatsApp sending error:', error)
    res.status(500).json({ 
      error: 'Failed to send WhatsApp message',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}