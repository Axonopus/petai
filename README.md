GoPet AI is a SaaS pet business management platform designed for pet care providers, offering modular features like CRM, POS, Staff Management, Booking, and more.

🛠️ Tech Stack

Frontend
Framework: Next.js (React)
UI Library: [Tailwind CSS](https://reactcomponents.com/)
Authentication: NextAuth.js (Google OAuth)
Payments: Stripe Connect

Backend
Database: PostgreSQL (Supabase)
Serverless Functions: Next.js API Routes

Deployment & Infrastructure
Frontend Hosting: Vercel
Backend & API: Hosted on Vercel serverless functions
Database: Supabase (PostgreSQL)
File Storage: Supabase Storage
Real-Time Features: Supabase Realtime

DevOps & Monitoring
CI/CD: GitHub Actions
Error Tracking & Logs: Sentry
Performance Monitoring: Vercel Analytics


🚀 Deployment Instructions

1️⃣ Clone the repo
git clone https://github.com/your-repo-url.git  
cd gopet-ai  

2️⃣ Install dependencies
pnpm install  

3️⃣ Set up environment variables
Create a .env.local file and add:

DATABASE_URL=your_postgresql_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://your-vercel-url.vercel.app
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
STRIPE_SECRET_KEY=your_stripe_key


4️⃣ Run locally
pnpm dev  


5️⃣ Deploy to Vercel
vercel  
