# MAXPULSE Complete Platform

A unified monorepo containing both the MAXPULSE Dashboard and Assessment Tool for seamless real-time tracking.

## 🏗️ Architecture

```
maxpulse-complete/
├── dashboard/          # MAXPULSE Platform (Distributor Dashboard)
├── assessment/         # Premium Mobile Assessment Tool
├── vercel.json        # Vercel deployment configuration
└── package.json       # Root package.json with build scripts
```

## 🚀 Deployment URLs

- **Dashboard**: `https://your-domain.com/dashboard`
- **Assessment**: `https://your-domain.com/assessment`
- **Root**: `https://your-domain.com/` (redirects to dashboard)

## 🔧 Development

```bash
# Install all dependencies
npm run install:all

# Run both apps in development
npm run dev

# Build both apps for production
npm run build
```

## ✨ Features

- **Same-Domain Deployment**: Enables real-time tracking via shared localStorage
- **Professional URLs**: Clean `/dashboard` and `/assessment` paths
- **Unified Build**: Single deployment for both applications
- **Migration-Ready**: Designed for easy upgrade to backend API

## 🎯 Real-Time Tracking

With same-domain deployment, the assessment tool and dashboard can share localStorage, enabling:

- ✅ Real-time progress updates
- ✅ Cross-tab communication
- ✅ Seamless data synchronization
- ✅ Professional user experience

## 🔄 Future Migration

This architecture is designed for easy migration to a backend API:

1. **Current**: localStorage-based tracking (same domain)
2. **Future**: API-based tracking (just uncomment API calls)
3. **Migration**: ~2 hours of work, zero architectural changes

## 📊 Monitoring

The dashboard provides real-time monitoring of:

- Client assessment progress
- Completion rates
- Detailed activity timelines
- Status tracking (started/in-progress/completed/abandoned)
