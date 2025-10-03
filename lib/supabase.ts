import { createClient } from '@supabase/supabase-js'
import { Booking } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug environment variables
console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Supabase Key:', supabaseAnonKey ? 'Set' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          name: string
          phone: string
          email: string | null
          guests: number
          date: string
          time: string
          note: string | null
          status: string
          confirmation_method: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email?: string | null
          guests: number
          date: string
          time: string
          note?: string | null
          status?: string
          confirmation_method?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string | null
          guests?: number
          date?: string
          time?: string
          note?: string | null
          status?: string
          confirmation_method?: string | null
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          email?: string
        }
      }
    }
  }
}

// Booking operations
export const bookingService = {
  // Get all bookings
  async getBookings(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data.map(booking => ({
      id: booking.id,
      name: booking.name,
      phone: booking.phone,
      email: booking.email || undefined,
      guests: booking.guests,
      date: booking.date,
      time: booking.time,
      note: booking.note || undefined,
      status: booking.status as any,
      confirmationMethod: booking.confirmation_method as any
    }))
  },

  // Create a new booking (with proper error handling)
  async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    try {
      // First, try to insert the booking
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          name: booking.name,
          phone: booking.phone,
          email: booking.email || null,
          guests: booking.guests,
          date: booking.date,
          time: booking.time,
          note: booking.note || null,
          status: booking.status,
          confirmation_method: booking.confirmationMethod || null
        })
        .select()
        .single()
      
      if (error) {
        console.error('Supabase insert error:', error)
        // If RLS is blocking, we might need to handle this differently
        throw new Error(`Failed to create booking: ${error.message}`)
      }
      
      return {
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        guests: data.guests,
        date: data.date,
        time: data.time,
        note: data.note || undefined,
        status: data.status as any,
        confirmationMethod: data.confirmation_method as any
      }
    } catch (error) {
      console.error('Booking creation failed:', error)
      throw error
    }
  },

  // Update booking status
  async updateBookingStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('bookings')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) throw error
  },

  // Subscribe to booking changes
  subscribeToBookings(callback: (bookings: Booking[]) => void) {
    return supabase
      .channel('bookings')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' },
        async () => {
          const bookings = await this.getBookings()
          callback(bookings)
        }
      )
      .subscribe()
  }
}

// Authentication helpers
export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }
}