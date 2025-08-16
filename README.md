# FILALI EMPIRE - Elite CRM

A powerful, elite-focused Customer Relationship Management system built with React, TypeScript, and Supabase.

## 🚀 Features

- **Elite Client Management**: Comprehensive client database with advanced filtering and search
- **Calendar Integration**: Microsoft Outlook calendar sync for elite scheduling
- **Mass Email Campaigns**: Professional email templates with HTML formatting
- **Revenue Tracking**: Invoice management and payment processing
- **Analytics Dashboard**: Real-time business insights and metrics
- **Elite Communications**: Call, text, and email actions with activity logging

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd filali-empire-crm
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

5. Start the development server:
```bash
npm run dev
```

## 🚀 Deployment

### Netlify Deployment via GitHub

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Netlify will automatically use the `netlify.toml` configuration
4. Environment variables are pre-configured in `netlify.toml`

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to Netlify (requires Netlify CLI)
netlify deploy --prod --dir=dist
```

## 🔧 Configuration

The project includes:
- `netlify.toml` - Netlify deployment configuration
- Environment variables configured for all deployment contexts
- SPA routing with proper redirects
- Optimized build settings

## 🔐 Authentication

Default login credentials:
- Password: `dominate`

## 📱 Features Overview

### Client Management
- Add, edit, and delete elite clients
- Advanced search and filtering
- Custom fields and tags
- Activity tracking and notes

### Communications
- Mass email campaigns with HTML templates
- Call, text, and FaceTime integration
- Email template customization
- Activity logging

### Calendar
- Microsoft Outlook integration
- Event creation and management
- Timeline view with filtering
- Real-time synchronization

### Analytics
- Revenue tracking and metrics
- Client conversion analytics
- Performance insights
- Export capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by FILALI EMPIRE.

## 🆘 Support

For support and inquiries, contact the FILALI EMPIRE team.

---

**FILALI EMPIRE - CONQUER. DOMINATE. WIN.**