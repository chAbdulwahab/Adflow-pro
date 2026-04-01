# 🚀 AdFlow Pro: Premium Ad Management SaaS

<img width="1905" height="939" alt="image" src="https://github.com/user-attachments/assets/b7b25415-1426-476a-95ad-8938bf300345" />

**AdFlow Pro** is a high-fidelity, full-stack SaaS platform designed for creators and advertisers to manage their campaigns with unparalleled ease and premium aesthetics. Built with **Next.js 15**, **Supabase**, and **Framer Motion**, it provides a seamless end-to-end workflow from ad creation to automated publishing.

---

## ✨ Key Features

### 💎 Premium User Experience
- **Stunning Landing Page**: Animated hero sections and feature grids that WOW users from the first second.
- **Glassmorphism UI**: Modern, dark-themed interface with depth, blurs, and sophisticated gradients.
- **Smoothest Animations**: Powered by `framer-motion` for buttery-smooth transitions and micro-interactions.
- **Top-Center Notifications**: Replaced bland browser alerts with elegant, centered `sonner` toast notifications.

### 🛠 Powerful Ad Lifecycle
- **Campaign Dashboard**: Real-time status tracking (Draft → Submitted → Under Review → Published).
- **Drafting Suite**: Intuitive ad creation with auto-save as draft.
- **Moderator Panel**: Dedicated interface for content reviewers to approve or reject submissions.
- **Admin Payment Verification**: Secure payment verification workflow that triggers automatic ad publishing.
- **Integrated Payments**: Simple payment submission flow to finalize campaign publishing.

### 🔐 Enterprise-Grade Security
- **Supabase Authentication**: Secure login and signup with role-based access control (RBAC).
- **Protected Routes**: Middleware and client-side checks ensure users only see what they're authorized to access.
- **Database Scalability**: Powered by PostgreSQL through Supabase for reliable data management.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Database/Auth** | [Supabase](https://supabase.com/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Components** | [Shadcn/UI](https://ui.shadcn.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Notifications** | [Sonner](https://sonner.stevenly.me/) |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed.
- A Supabase account and project.

### 2. Clone and Install
```bash
git clone https://github.com/your-username/adflow-pro.git
cd adflow-pro
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Database Schema
Ensure your Supabase project has the following tables:
- **`users`**: `id`, `email`, `role` (enum: 'client', 'moderator', 'admin').
- **`ads`**: `id`, `user_id`, `title`, `description`, `status` (enum: 'draft', 'submitted', 'under_review', 'rejected', 'published').
- **`payments`**: `id`, `ad_id`, `amount`, `status` (enum: 'pending', 'verified', 'rejected').

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see your premium platform in action!

---

## 🗺 Roadmap
- [ ] Stripe Payment Integration
- [ ] Real-time Ad Performance Analytics
- [ ] Multiple Ad Creative Formats (Video/Image Support)
- [ ] AI-Powered Ad Copy Generation

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed with ❤️ by Abdul Wahab.
