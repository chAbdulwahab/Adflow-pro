# AdFlow Pro Implementation Plan

This plan aims to build a full-stack production-level web application named "AdFlow Pro" using Next.js, Tailwind CSS, Supabase, Chart.js, and Framer Motion. 

## User Review Required

> [!WARNING]
> Please review the database schema and project structure below. 
> To use Supabase, we will need to set up the Postgres tables and authenticate. Since I cannot access your Supabase dashboard, I will provide you with the SQL required to initialize your database tables, or we can use the Supabase CLI if you prefer. 
> Please ensure you have your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` added to your `.env.local` file.

## Proposed Changes

---

### Phase 1: Project Setup & Dependencies
- Initialize Next.js app with App Router, TypeScript, and Tailwind CSS.
- Install necessary dependencies (`@supabase/supabase-js`, `@supabase/ssr`, `framer-motion`, `chart.js`, `react-chartjs-2`, `lucide-react`, `date-fns`).
- Establish folder structure (`src/app`, `src/components`, `src/lib`, `src/services`, `src/types`).
- Configure basic dark glassmorphism design tokens in `tailwind.config.ts` and `globals.css`.

### Phase 2: Database Initialization (Supabase)
- We will define the SQL schema for `profiles`, `ads`, `payments`, `conversations`, and `messages`.
- Implement Row Level Security (RLS) policies to handle permissions for roles (client, moderator, admin) and chat participants securely.

### Phase 3: Core Authentication & Routing
- Create Supabase client utility in `src/lib/supabaseClient.ts`, using the newly recommended `@supabase/ssr` capabilities.
- Set up authentication layouts in `(auth)/login` and `(auth)/signup`.
- Profile creation hook on signup using database triggers or automatic insertion.
- Implement Next.js Middleware (`middleware.ts`) to fetch roles and protect `/client`, `/moderator`, and `/admin` routes.

### Phase 4: Client Area & Ad Creation
- Build `client/dashboard` summarizing user ads.
- Build `client/create-ad` with progress bar, multiple steps, and dynamic ad "score".
- Handle draft saving, editing, and ad submission functionality.

### Phase 5: Explore & Public Interface
- Build comprehensive `/explore` page with advanced filtering (city, category, price, package) and sorting using Framer Motion layouts.
- Build Ad Details page `/ad/[id]` with responsive layout.
- Implement server-side ad ranking formula (Score = Base + Featured weight + Package + Freshness) when sorting explore results.

### Phase 6: Moderator & Admin Operations
- Build `/moderator/dashboard` to review submitted ads. Approve to `payment_pending` status or Reject with a reason.
- Build `/admin/payments` to verify pending screenshots/payments and publish ads.
- Build `/admin/dashboard` & `/admin/analytics` integrating Chart.js for data visualization with Framer Motion entry animations.

### Phase 7: Realtime Chat System
- Setup chat interfaces at `/ad/[id]` (buyer UI) and dashboard messaging panels `/client/messages`.
- Integrate Supabase Realtime subscriptions to push messages seamlessly between participants.

## Open Questions

> [!IMPORTANT]
> 1. **Supabase Database Setup:** Do you already have a Supabase project created? I can provide you an initial `database.sql` script to run in your Supabase SQL editor to create all the required tables and security policies.
> 2. **UI Component Library:** Would you prefer us to build the UI with raw standard Tailwind CSS & HTML (glassmorphism from scratch), or should we incorporate a library like `shadcn/ui` to accelerate development and provide highly-polished accessible components? 
> 3. **Environment Variables:** I noticed `.env.local` is open in your workspace. Are your Supabase credentials loaded into it?

## Verification Plan

### Automated Tests
- Rely on TypeScript compilation for strict type checking.
- Next.js build step to ensure no missing exports or configuration errors.

### Manual Verification
1. User registration, and setting profiles to correct roles in the database.
2. Complete Ad Lifecycle execution: Draft -> Submit -> Moderate -> Pay -> Publish.
3. Test Realtime Messaging with two simulated users.
4. Verify dynamic visual effects like Framer Motion transitions and Chart.js animations.
