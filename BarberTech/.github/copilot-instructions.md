# BarberTech - AI Coding Assistant Instructions

## Architecture Overview
BarberTech is a single-page React application for barber shop management built with Vite. It uses Supabase for authentication and real-time data synchronization. The app features a neon-themed UI with glassmorphism effects, powered by vanilla CSS and Framer Motion animations.

**Key Components:**
- `App.jsx`: Main component handling all state, UI, and business logic
- `supabase.js`: Supabase client configuration
- Services defined in `SERVICOS_DISPONIVEIS` array within App.jsx

**Data Flow:**
- Appointments stored in Supabase `agendamentos` table
- Real-time updates via Supabase subscriptions
- Local state for UI interactions and form data

## Critical Workflows
- **Development:** `npm run dev` starts Vite dev server
- **Build:** `npm run build` creates production bundle with PWA assets
- **Authentication:** Supabase auth with email/password; session managed in `useEffect`
- **Real-time Sync:** Appointments update automatically via `postgres_changes` subscription

## Project-Specific Conventions
- **Services Configuration:** Edit `SERVICOS_DISPONIVEIS` array in App.jsx to add/modify services (includes name, price, color, duration)
- **Phone Formatting:** Use regex in `handleTelefone` for Brazilian phone mask: `(XX) XXXXX-XXXX`
- **Availability Logic:** Time slots blocked based on active barbers count and service duration; calculate in minutes
- **Date Handling:** Use `YYYY-MM-DD` format for storage; display as `DD/MM`
- **Status Management:** Appointments have 'pendente', 'concluido', 'excluido' statuses
- **WhatsApp Integration:** Format URLs as `https://wa.me/55{phone}?text={message}` with pre-filled reminders

## Integration Points
- **Supabase Tables:** `agendamentos` (cliente, telefone, servico, horario, data, valor, status)
- **PWA:** Configured in `vite.config.js` for offline capability
- **Charts:** Recharts BarChart for financial dashboard; data filtered by period ('hoje', 'mes', 'tudo')
- **Animations:** Framer Motion for dropdowns and list items; use `AnimatePresence` for smooth transitions

## Common Patterns
- **Form Validation:** Check required fields before submission; use alerts for errors
- **Calendar Rendering:** Custom grid with `gridDias` array; disable past dates
- **Time Slots:** Generated from 08:00 to 20:30 in 30-min increments
- **Search/Filter:** Client-side filtering on `cliente` name for appointments list
- **Optimistic Updates:** Update local state immediately, rollback on Supabase error

## Environment Setup
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` file
- Ensure Supabase project has `agendamentos` table with RLS policies for authenticated access</content>
<parameter name="filePath">vsls:/BarberTech/.github/copilot-instructions.md