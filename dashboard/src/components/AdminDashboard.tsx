import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminOverview } from './AdminOverview';
import { AnnouncementEditor } from './AnnouncementEditor';
import { AdminDistributors } from './AdminDistributors';
import { AdminAnalytics } from './AdminAnalytics';
import { RevenueDetails } from './RevenueDetails';
import { ProductManagement } from './admin/ProductManagement';

interface AdminDashboardProps {
  user: any;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <AdminSidebar user={user} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="overview" replace />} />
          <Route path="/overview" element={<AdminOverview user={user} />} />
          <Route path="/announcements" element={<AnnouncementEditor />} />
          <Route path="/distributors" element={<AdminDistributors user={user} />} />
          <Route path="/analytics" element={<AdminAnalytics user={user} />} />
          <Route path="/revenue" element={<RevenueDetails user={user} />} />
          <Route path="/products" element={<ProductManagement />} />
          {/* Future admin routes can be added here */}
          <Route path="/settings" element={<div className="p-6"><h1>Settings Coming Soon</h1></div>} />
          <Route path="/security" element={<div className="p-6"><h1>Security Coming Soon</h1></div>} />
          <Route path="/system" element={<div className="p-6"><h1>System Health Coming Soon</h1></div>} />
          <Route path="/database" element={<div className="p-6"><h1>Database Management Coming Soon</h1></div>} />
        </Routes>
      </div>
    </div>
  );
}