# MAXPULSE Platform Development - Setup Guide

## 🚀 Quick Start

This is a comprehensive React + TypeScript application built with Vite, featuring a complete dashboard ecosystem for distributors, administrators, and trainers.

### Prerequisites

- **Node.js**: v18.0.0 or higher (tested with v24.1.0)
- **npm**: v8.0.0 or higher (tested with v11.3.0)

### Installation

1. **Clone or download the project**
   ```bash
   cd "MAXPULSE Platform Development"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run type-check` | Run TypeScript type checking |
| `npm run lint` | Run ESLint for code quality |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

## 🏗️ Project Structure

```
MAXPULSE Platform Development/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Shadcn/ui component library (50+ components)
│   │   ├── trainer/         # Trainer-specific components
│   │   ├── learning/        # Learning management components
│   │   └── ...              # Dashboard and feature components
│   ├── styles/              # Global styles and Tailwind CSS
│   ├── utils/               # Utility functions
│   ├── assets/              # Static assets
│   └── App.tsx              # Main application component
├── public/                  # Public assets
├── package.json             # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.ts          # Vite build configuration
└── README.md               # Project documentation
```

## 🎨 Tech Stack

### Frontend Framework
- **React 18** with TypeScript
- **Vite 6.3.5** for fast development and building
- **React Router v6** with HashRouter for client-side routing

### UI & Styling
- **Tailwind CSS v3.4** for utility-first styling
- **Shadcn/ui** component library (50+ accessible components)
- **Lucide React** for icons
- **Custom MAXPULSE brand theme** (Dark Metallic Red)

### Data Visualization
- **Recharts** for interactive charts and analytics
- **React Circular Progressbar** for progress indicators

### Form Management
- **React Hook Form v7.55** with validation
- **Radix UI** primitives for accessible form components

### Development Tools
- **TypeScript 5.6** with strict mode
- **ESLint 9.15** for code quality
- **Prettier 3.3** for code formatting
- **PostCSS** with Autoprefixer

## 🎯 Key Features

### 1. **Public Marketing Website**
- Homepage with value proposition
- About page explaining platform benefits
- How It Works process flow
- Success Stories and testimonials

### 2. **Distributor Dashboard**
- Performance overview with real-time metrics
- Link generation (general and customer-specific)
- Client management system
- Revenue analytics with interactive charts
- Learning Management System (LMS)
- Company announcements carousel
- Goals and earnings tracking

### 3. **Admin Dashboard**
- Platform-wide analytics and monitoring
- Distributor management and oversight
- Revenue tracking and reporting
- User activity monitoring

### 4. **Trainer Dashboard**
- Student progress management (scalable for thousands)
- Content creation suite
- Course builder with video integration
- Quiz system with immediate feedback
- Analytics and reporting tools
- Resource library management

### 5. **Learning Management System**
- Interactive courses with video players
- Progress tracking and achievements
- Gamification with badge system
- Quiz system with scoring
- Certificate management

## 🔧 Configuration Files

### TypeScript Configuration (`tsconfig.json`)
- Strict mode enabled for type safety
- Path aliases configured for clean imports
- Modern ES2020 target with DOM support

### Tailwind CSS (`tailwind.config.js`)
- Custom MAXPULSE brand colors
- Dark metallic red theme implementation
- Responsive design utilities
- Animation and glassmorphism effects

### Vite Configuration (`vite.config.ts`)
- React SWC plugin for fast compilation
- Path aliases for clean imports
- Development server on port 3000
- Production build optimization

### ESLint Configuration (`eslint.config.js`)
- React and TypeScript rules
- Accessibility compliance checks
- Code quality enforcement
- Auto-fixable issues

## 🎨 Design System

### Brand Colors
- **Primary**: #8B1538 (Dark Metallic Red)
- **Secondary**: #B45309 (Bronze/Amber)
- **Light Variation**: #A91D47
- **Dark Variation**: #6B1229

### Typography
- **Base Font Size**: 14px
- **Font Family**: Inter (system fallbacks)
- **Headings**: Medium weight (500)
- **Body Text**: Normal weight (400)

### Component Standards
- **Border Radius**: 0.625rem base
- **Spacing**: Consistent 4px grid system
- **Animations**: Smooth 200ms transitions
- **Accessibility**: WCAG 2.1 AA compliant

## 🚀 Development Workflow

### 1. **Start Development**
```bash
npm run dev
```

### 2. **Code Quality Checks**
```bash
npm run type-check    # TypeScript validation
npm run lint          # ESLint checks
npm run format:check  # Prettier formatting
```

### 3. **Auto-fix Issues**
```bash
npm run lint:fix      # Fix ESLint issues
npm run format        # Format with Prettier
```

### 4. **Build for Production**
```bash
npm run build         # Creates optimized build
npm run preview       # Preview production build
```

## 🔍 Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   # Kill process using port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **TypeScript errors**
   ```bash
   # Run type checking
   npm run type-check
   ```

3. **Dependency issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Build errors**
   ```bash
   # Check for linting issues
   npm run lint
   # Fix automatically
   npm run lint:fix
   ```

## 📱 Browser Support

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

## 🔒 Security Features

- **Input validation** on all forms
- **XSS protection** with proper escaping
- **CSRF protection** patterns
- **Secure routing** with authentication guards
- **Content Security Policy** ready

## 📈 Performance Optimizations

- **Code splitting** with React.lazy
- **Tree shaking** for minimal bundle size
- **Image optimization** with proper formats
- **Lazy loading** for components
- **Efficient re-rendering** with React.memo

## 🎯 Next Steps

1. **Backend Integration**: Connect to Supabase for data persistence
2. **Authentication**: Implement user login and role-based access
3. **Real-time Features**: Add live updates and notifications
4. **Testing**: Add comprehensive test coverage
5. **Deployment**: Set up CI/CD pipeline

## 📞 Support

For development questions or issues:
1. Check the console for error messages
2. Review the TypeScript errors with `npm run type-check`
3. Ensure all dependencies are installed correctly
4. Verify Node.js and npm versions meet requirements

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Node.js**: v24.1.0  
**npm**: v11.3.0
