-- Updated Supabase SQL for fixing Row Level Security
-- Run this in your Supabase SQL Editor

-- First, let's check current policies
-- SELECT * FROM pg_policies WHERE tablename = 'bookings';

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Authenticated users can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Authenticated users can update bookings" ON bookings;

-- Create new policies that allow anonymous booking creation
-- Allow anyone (including anonymous users) to insert bookings
CREATE POLICY "Allow anonymous booking creation" ON bookings
    FOR INSERT 
    WITH CHECK (true);

-- Allow authenticated users to view all bookings
CREATE POLICY "Authenticated users can view bookings" ON bookings
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Allow authenticated users to update bookings
CREATE POLICY "Authenticated users can update bookings" ON bookings
    FOR UPDATE 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete bookings (if needed)
CREATE POLICY "Authenticated users can delete bookings" ON bookings
    FOR DELETE 
    USING (auth.role() = 'authenticated');

-- Verify the policies are working
-- You can test this by trying to insert a booking as an anonymous user