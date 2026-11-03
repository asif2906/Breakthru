# BT — BreakThru Platform

> Every breakthrough starts with a BT.

An open research, innovation and problem-solving platform connecting people who want to solve meaningful real-world problems.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for backend)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Dropdown.tsx
│   │   └── Modal.tsx
│   └── layout/       # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Layout.tsx
├── hooks/
│   └── useAuth.tsx   # Authentication hook
├── lib/
│   ├── supabase.ts   # Supabase client
│   └── utils.ts      # Utility functions
├── pages/
│   ├── LandingPage.tsx
│   ├── ExplorePage.tsx
│   ├── BTDetailPage.tsx
│   └── SubmitBTPage.tsx
├── types/
│   └── index.ts      # TypeScript types
├── AppRoutes.tsx     # Route definitions
├── App.tsx           # Root component
└── main.tsx          # Entry point

supabase/
├── migrations/
│   ├── 001_initial_schema.sql
│   └── 002_rls_policies.sql
├── seed.sql
└── functions/
    └── search-bts/
        └── index.ts
```

## 🎨 Design System

### Colors
- **Near Black**: `#171717` - Primary background
- **Electric Lime**: `#D6FF45` - Primary accent
- **Warm Off-White**: `#F7F6F2` - Primary text
- **Violet**: `#8B7CFF` - Secondary accent
- **Dark Cards**: `#222222` - Card backgrounds
- **Muted Text**: `#A3A3A3` - Secondary text

### Typography
- **Headings**: Space Grotesk
- **Body**: Inter

### Components
All components follow a premium editorial technology aesthetic with:
- Strong typography and clear hierarchy
- Generous whitespace
- Consistent spacing (4px base unit)
- Subtle, purposeful animations
- Excellent responsive layouts (390px, 768px, 1440px)

## 🗄️ Database Schema

### Core Tables
- **profiles** - User profiles with skills, expertise, links
- **categories** - Problem categories (AI, Energy, Biotech, etc.)
- **bts** - BreakThru problems (BTs)
- **bt_skills** - Skills required for each BT
- **research_references** - Research papers and sources
- **bt_references** - Junction table linking BTs to references
- **discussions** - Structured discussions (questions, hypotheses, evidence, critiques, updates)
- **teams** - Collaboration teams
- **team_members** - Team membership with roles
- **team_join_requests** - Requests to join teams
- **team_objectives** - Team objectives and tasks
- **team_updates** - Progress updates
- **breakthroughs** - Published outcomes (papers, prototypes, products, startups)
- **notifications** - User notifications
- **reports** - Content moderation reports
- **user_roles** - Role-based access control
- **bt_followers** - BT following system

### Security
- Row Level Security (RLS) enabled on all tables
- Role-based permissions (guest, user, team_member, moderator, admin)
- Server-side authorization, not just frontend hiding

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS v4** for styling
- **React Router v6** for routing
- **Lucide React** for icons
- **clsx + tailwind-merge** for class composition

### Backend
- **Supabase** (PostgreSQL + Auth + Realtime + Storage)
- Row Level Security for authorization
- Edge Functions for complex queries

### Deployment
- **Frontend**: Cloudflare Pages
- **Backend**: Supabase
- **Source Control**: GitHub

## 📋 Implemented Features

### Phase 1: Foundation ✅
- [x] Repository setup with Vite + React + TypeScript
- [x] Tailwind CSS with custom design system
- [x] Component library (Button, Input, Card, Badge, Avatar, Dropdown, Modal)
- [x] Layout system (Header, Footer, Layout variants)

### Phase 2: Authentication ✅
- [x] Supabase Auth integration
- [x] Sign up, login, logout
- [x] Email verification
- [x] Password reset
- [x] Protected routes
- [x] Profile management

### Phase 3: Core Pages ✅
- [x] Landing Page with hero, features, categories, featured BTs
- [x] Explore Problems with search, filters, pagination
- [x] BT Detail Page with problem info, sidebar actions
- [x] Submit BT form with validation

### Phase 4: Database ✅
- [x] Complete PostgreSQL schema
- [x] RLS policies for all tables
- [x] Seed data with notification triggers
- [x] Search edge function

## 🔜 Next Steps (MVP Completion)

### Phase 5: BT Functionality
- [ ] Full BT submission workflow (draft → submitted → review → approved)
- [ ] Research references CRUD
- [ ] Structured discussions with threading
- [ ] BT following system

### Phase 6: Collaboration
- [ ] Team creation and management
- [ ] Join request workflow
- [ ] Team workspace with objectives
- [ ] Progress updates

### Phase 7: Outcomes
- [ ] Breakthrough publishing
- [ ] Public showcase pages
- [ ] Links between BTs, teams, breakthroughs

### Phase 8: Administration
- [ ] Admin dashboard
- [ ] BT review interface
- [ ] User management
- [ ] Content moderation

### Phase 9: Polish & Deploy
- [ ] Comprehensive testing
- [ ] Mobile optimization
- [ ] Performance optimization
- [ ] Production deployment
- [ ] Documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Design inspired by Linear and Stripe
- Icons from Lucide
- Fonts from Google Fonts
- Backend powered by Supabase

---

**Built with transparency and scientific rigor.**