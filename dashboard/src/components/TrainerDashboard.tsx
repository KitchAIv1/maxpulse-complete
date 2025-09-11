import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TrainerSidebar } from './TrainerSidebar';
import { TrainerOverview } from './TrainerOverview';
import { ContentCreator } from './trainer/ContentCreator';
import { CourseBuilder } from './trainer/CourseBuilder';
import { ModuleEditor } from './trainer/ModuleEditor';
import { QuizBuilder } from './trainer/QuizBuilder';
import { ResourceManager } from './trainer/ResourceManager';
import { ContentLibrary } from './trainer/ContentLibrary';
import { PublishingWorkflow } from './trainer/PublishingWorkflow';
import { AnalyticsReports } from './trainer/AnalyticsReports';
import { StudentProgress } from './trainer/StudentProgress';

interface TrainerDashboardProps {
  user: any;
}

export function TrainerDashboard({ user }: TrainerDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <TrainerSidebar 
        user={user} 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      <div className="flex-1 overflow-auto">
        {/* Mobile Header Space for mobile menu button */}
        <div className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-16">
          <h1 className="text-lg font-medium text-gray-900">MAXPULSE Trainer Portal</h1>
        </div>
        
        <div className="p-4 lg:p-6">
          <Routes>
            <Route index element={<TrainerOverview user={user} />} />
            <Route path="overview" element={<TrainerOverview user={user} />} />
            <Route path="content/create" element={<ContentCreator />} />
            <Route path="content/courses" element={<CourseBuilder />} />
            <Route path="content/modules" element={<ModuleEditor />} />
            <Route path="content/quizzes" element={<QuizBuilder />} />
            <Route path="content/resources" element={<ResourceManager />} />
            <Route path="content/library" element={<ContentLibrary />} />
            <Route path="publishing" element={<PublishingWorkflow />} />
            <Route path="analytics" element={<AnalyticsReports />} />
            <Route path="students" element={<StudentProgress />} />
            <Route path="*" element={<Navigate to="/trainer" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}