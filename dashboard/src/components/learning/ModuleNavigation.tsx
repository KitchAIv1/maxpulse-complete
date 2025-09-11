import React from 'react';
import { Card } from '../ui/card';
import { CheckCircle, Play, FileText } from 'lucide-react';

interface ModuleNavigationProps {
  modules: Array<{
    id: number;
    title: string;
    duration: string;
    type: 'video' | 'quiz';
    completed: boolean;
  }>;
  currentModule: number;
  onModuleSelect: (moduleId: number) => void;
}

export function ModuleNavigation({ modules, currentModule, onModuleSelect }: ModuleNavigationProps) {
  return (
    <Card className="p-4 sticky top-4">
      <h3 className="font-medium mb-4">Course Modules</h3>
      <div className="space-y-2">
        {modules.map((module, index) => (
          <div
            key={module.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              currentModule === module.id
                ? 'bg-brand-primary text-white'
                : module.completed
                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => onModuleSelect(module.id)}
          >
            <div className="flex items-center space-x-2">
              {module.completed ? (
                <CheckCircle className="h-4 w-4" />
              ) : module.type === 'quiz' ? (
                <FileText className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{module.title}</div>
                <div className="text-xs opacity-75">{module.duration}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}