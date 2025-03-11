# GoPet AI

GoPet AI is a **SaaS pet business management platform** designed for pet care providers, offering modular features such as **CRM, POS, Staff Management, Booking**, and more.

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js (React)](https://nextjs.org/)
- **UI Library:** [Tailwind CSS](https://reactcomponents.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Google OAuth)
- **Payments:** [Stripe Connect](https://stripe.com/connect)

### Backend
- **Database:** [PostgreSQL (Supabase)](https://supabase.com/)
- **Serverless Functions:** Next.js API Routes

### Deployment & Infrastructure
- **Frontend Hosting:** [Vercel](https://vercel.com/)
- **Backend & API:** Hosted on Vercel serverless functions
- **Database:** Supabase (PostgreSQL)
- **File Storage:** Supabase Storage
- **Real-Time Features:** Supabase Realtime

### DevOps & Monitoring
- **CI/CD:** [GitHub Actions](https://github.com/features/actions)
- **Error Tracking & Logs:** [Sentry](https://sentry.io/)
- **Performance Monitoring:** Vercel Analytics

---

## 🚀 Deployment Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-repo-url.git  
cd gopet-ai  
```

### 2️⃣ Install dependencies
```bash
pnpm install  
```

### 3️⃣ Set up environment variables
Create a `.env.local` file in the root directory and add the following:
```env
DATABASE_URL=your_postgresql_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://your-vercel-url.vercel.app
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
STRIPE_SECRET_KEY=your_stripe_key
```

### 4️⃣ Run locally
```bash
pnpm dev  
```

### 5️⃣ Deploy to Vercel
```bash
vercel  
```

---


## 📩 Support
For any issues or feature requests, open an issue on GitHub or contact us
