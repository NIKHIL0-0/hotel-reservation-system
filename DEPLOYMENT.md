# 🌐 ReserveEase - Cloud Deployment Guide

## 🗄️ **Step 1: Set up Supabase Database**

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a database password and region
4. Wait for project to be ready (~2 minutes)

### 1.2 Get Supabase Credentials
1. Go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**
3. Save these for later

### 1.3 Create Database Tables
Go to **SQL Editor** in Supabase and run this SQL:

```sql
-- Create bookings table
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    guests INTEGER NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(20) NOT NULL,
    note TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    confirmation_method VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings (anyone can insert, only authenticated can view/update)
CREATE POLICY "Anyone can create bookings" ON bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view all bookings" ON bookings
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update bookings" ON bookings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for admin_users (only authenticated can view)
CREATE POLICY "Authenticated users can view admin_users" ON admin_users
    FOR SELECT USING (auth.role() = 'authenticated');

-- Insert sample admin user (replace with your email)
INSERT INTO admin_users (email) VALUES ('admin@yourrestaurant.com');
```

### 1.4 Create Admin User
1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter your admin email and password
4. Click **Create User**

## 📱 **Step 2: Set up Twilio for SMS**

### 2.1 Create Twilio Account
1. Go to [twilio.com](https://www.twilio.com)
2. Sign up for a free trial account
3. Verify your phone number

### 2.2 Get Twilio Credentials
1. Go to Twilio Console Dashboard
2. Note down your **Account SID** and **Auth Token**
3. Go to **Phone Numbers** → **Manage** → **Active Numbers**
4. Copy your Twilio phone number

### 2.3 Set up WhatsApp (Optional)
1. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Follow the sandbox setup instructions
3. Note your WhatsApp-enabled number

## 🚀 **Step 3: Deploy to Vercel**

### 3.1 Prepare Environment Variables
Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3.2 Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts to connect your GitHub and deploy

### 3.3 Configure Production Environment Variables in Vercel
Go to your Vercel dashboard → Project → Settings → Environment Variables:

**Add these variables:**
- `VITE_SUPABASE_URL` = your_supabase_url
- `VITE_SUPABASE_ANON_KEY` = your_supabase_anon_key
- `TWILIO_ACCOUNT_SID` = your_twilio_account_sid
- `TWILIO_AUTH_TOKEN` = your_twilio_auth_token
- `TWILIO_PHONE_NUMBER` = your_twilio_phone_number
- `TWILIO_WHATSAPP_NUMBER` = your_twilio_whatsapp_number (if using)

### 3.4 Redeploy
After adding environment variables, trigger a new deployment:
```bash
vercel --prod
```

## 🔧 **Step 4: Alternative Deployment Options**

### Option A: Netlify
1. Connect your GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add the same environment variables in Netlify dashboard

### Option B: Railway
1. Connect GitHub repo to Railway
2. Railway will auto-detect your Vite app
3. Add environment variables in Railway dashboard

## 📱 **Step 5: SMS Testing**

### Test SMS Functionality:
1. Create a booking with SMS confirmation
2. Update booking status in admin panel
3. Customer should receive SMS notifications

### Troubleshooting SMS:
- Check Twilio Console logs
- Verify phone number format (include country code)
- Check Vercel function logs

## 💰 **Cost Breakdown**

### Free Tier Usage:
- **Supabase**: Free for up to 50MB database, 50,000 monthly active users
- **Vercel**: Free for personal projects, 100GB bandwidth
- **Twilio**: $15.50 trial credit, then $0.0075 per SMS
- **Netlify**: Free for personal projects

### Expected Monthly Costs (moderate usage):
- Database: $0-25/month
- Hosting: $0-10/month  
- SMS: $5-30/month (depending on volume)
- **Total: $5-65/month**

## 🚀 **Step 6: Go Live!**

After deployment:
1. Test the booking form on your live site
2. Test admin login and booking management
3. Verify SMS notifications work
4. Share the URL with your customers!

## 🔒 **Security Notes**

- Never expose Twilio Auth Token in client-side code
- Use Supabase Row Level Security policies
- Regular backup your Supabase database
- Monitor usage in Twilio and Vercel dashboards

## 📞 **Support**

If you encounter issues:
1. Check Vercel function logs
2. Check Supabase database logs
3. Check Twilio console for SMS delivery status
4. Verify all environment variables are set correctly

Your reservation system is now live and ready for customers! 🎉