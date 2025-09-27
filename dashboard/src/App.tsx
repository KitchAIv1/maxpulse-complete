import React, { useState } from 'react';
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import { DistributorDashboard } from './components/DistributorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { TrainerDashboard } from './components/TrainerDashboard';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { PublicLayout } from './components/PublicLayout';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { SuccessStoriesPage } from './components/SuccessStoriesPage';
import { ProfileSettings } from './components/ProfileSettings';
import { AccountSettings } from './components/AccountSettings';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'distributor' | 'admin' | 'trainer' | null>(null);

  // Debug user state changes
  React.useEffect(() => {
    console.log('👤 User state changed:', { user: user?.id || 'null', userRole });
  }, [user, userRole]);

  // Load user from localStorage on app start
  React.useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('🔄 Loading saved user from localStorage:', userData);
        
        // Ensure we have a valid role
        if (userData && userData.role) {
          setUser(userData);
          setUserRole(userData.role);
        } else {
          console.log('⚠️ Invalid user data in localStorage, clearing...');
          localStorage.removeItem('currentUser');
        }
      } catch (error) {
        console.error('❌ Error loading saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  const handleLogin = (userData: any, role: 'distributor' | 'admin' | 'trainer') => {
    console.log('🔄 App.tsx handleLogin called with:', { userData, role });
    setUser(userData);
    setUserRole(role);
    
    // Save to localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('currentUser');
  };

  const handleShowProfile = () => {
    setShowProfileSettings(true);
  };

  const handleShowAccountSettings = () => {
    setShowAccountSettings(true);
  };

  const handleCloseProfile = () => {
    setShowProfileSettings(false);
  };

  const handleCloseAccountSettings = () => {
    setShowAccountSettings(false);
  };

  const handleSaveProfile = (userData: any) => {
    setUser({ ...user, ...userData });
    setShowProfileSettings(false);
  };

  const handleSaveAccountSettings = (settings: any) => {
    setUser({ ...user, ...settings });
    setShowAccountSettings(false);
  };

  // Debug logging and prevent server requests in iframe environment
  React.useEffect(() => {
    console.log('🚀 MAXPULSE Dashboard App mounted successfully!');
    console.log('📍 Current hash:', window.location.hash);
    console.log('🌐 Full URL:', window.location.href);
    console.log('⚛️ React Router ready for HashRouter');

    // Configure HTML head to prevent server requests in iframe environment
    
    // Set base href to prevent server requests
    const existingBase = document.querySelector('base');
    if (!existingBase) {
      const base = document.createElement('base');
      base.href = window.location.href.split('#')[0]; // Use current URL without hash
      document.head.appendChild(base);
      console.log('✅ Base href set to:', base.href);
    }

    // Prevent favicon requests that cause 404s in iframe
    let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><text y="32" font-size="32">🔥</text></svg>';
    console.log('✅ Favicon set to prevent 404');

    // Add meta tags to prevent additional requests
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(viewport);
    }

    // Set document title
    document.title = 'MAXPULSE - Distributor Dashboard & Link Generator';
    console.log('✅ Document title set');

    // Add global error listener to catch any unhandled errors
    const handleError = (event: ErrorEvent) => {
      // Filter out expected iframe errors
      if (event.message?.includes('favicon') || event.filename?.includes('favicon')) {
        console.log('ℹ️ Favicon error suppressed (expected in iframe)');
        return;
      }
      console.error('🚨 Global error caught:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🚨 Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Add navigation listener to track route changes
    const handleHashChange = () => {
      console.log('🔄 Route changed to:', window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);

    // Intercept any problematic requests and ensure client-side routing
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0];
      if (typeof url === 'string') {
        // Block requests to root that would cause 404 in iframe
        if (url === '/' || url === window.location.origin + '/') {
          console.log('🚫 Blocked root fetch request - using client-side routing instead');
          return Promise.reject(new Error('Root requests redirected to client-side routing'));
        }
        // Block favicon requests
        if (url.includes('favicon.ico')) {
          console.log('🚫 Blocked favicon request - using inline favicon instead');
          return Promise.reject(new Error('Favicon requests blocked in iframe'));
        }
      }
      return originalFetch.apply(this, args);
    };

    // Handle browser navigation attempts to root
    const handlePopState = (event: PopStateEvent) => {
      if (window.location.pathname === '/' && !window.location.hash) {
        console.log('🔄 Root navigation detected, redirecting to home hash');
        window.location.hash = '#/';
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePopState);
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* 
            PUBLIC MARKETING PAGES 
          */}
          <Route 
            path="/" 
            element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            } 
          />
          <Route 
            path="/about" 
            element={
              <PublicLayout>
                <AboutPage />
              </PublicLayout>
            } 
          />
          <Route 
            path="/how-it-works" 
            element={
              <PublicLayout>
                <HowItWorksPage />
              </PublicLayout>
            } 
          />
          <Route 
            path="/success-stories" 
            element={
              <PublicLayout>
                <SuccessStoriesPage />
              </PublicLayout>
            } 
          />
          
          {/* 
            AUTHENTICATION 
          */}
          <Route 
            path="/login" 
            element={
              user && userRole ? (
                <Navigate to={
                  userRole === 'admin' ? '/admin' : 
                  userRole === 'trainer' ? '/trainer' : 
                  '/dashboard'
                } replace />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            } 
          />
          
          
          
          {/* 
            PROTECTED DISTRIBUTOR ROUTES 
          */}
          <Route 
            path="/dashboard/*" 
            element={
              user && userRole === 'distributor' ? (
                <>
                  <Header 
                    user={user} 
                    onLogout={handleLogout}
                    onShowProfile={handleShowProfile}
                    onShowAccountSettings={handleShowAccountSettings}
                  />
                  <DistributorDashboard user={user} />
                </>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* 
            PROTECTED TRAINER ROUTES 
          */}
          <Route 
            path="/trainer/*" 
            element={
              user && userRole === 'trainer' ? (
                <>
                  <Header 
                    user={user} 
                    onLogout={handleLogout}
                    onShowProfile={handleShowProfile}
                    onShowAccountSettings={handleShowAccountSettings}
                  />
                  <TrainerDashboard user={user} />
                </>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* 
            PROTECTED ADMIN ROUTES 
          */}
          <Route 
            path="/admin/*" 
            element={
              user && userRole === 'admin' ? (
                <>
                  <Header 
                    user={user} 
                    onLogout={handleLogout}
                    onShowProfile={handleShowProfile}
                    onShowAccountSettings={handleShowAccountSettings}
                  />
                  <AdminDashboard user={user} />
                </>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Handle preview_page.html redirect */}
          <Route path="/preview_page.html" element={<Navigate to="/" replace />} />
          
          {/* Catch-all for unknown routes - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Profile Settings Modal */}
        {showProfileSettings && user && (
          <ProfileSettings
            user={user}
            onClose={handleCloseProfile}
            onSave={handleSaveProfile}
          />
        )}

        {/* Account Settings Modal */}
        {showAccountSettings && user && (
          <AccountSettings
            user={user}
            onClose={handleCloseAccountSettings}
            onSave={handleSaveAccountSettings}
          />
        )}
      </div>
    </HashRouter>
  );
}