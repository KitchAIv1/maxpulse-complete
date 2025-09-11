import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { 
  Play,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  Upload,
  Video,
  FileText,
  Image,
  Link,
  Settings,
  Clock,
  Users
} from 'lucide-react';

export function ModuleEditor() {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  const modules = [
    {
      id: 1,
      title: 'Introduction to MAXPULSE',
      course: 'MAXPULSE Foundations',
      type: 'video',
      duration: '15:30',
      status: 'published',
      views: 245,
      completionRate: 89
    },
    {
      id: 2,
      title: 'Health Assessment Basics',
      course: 'MAXPULSE Foundations',
      type: 'interactive',
      duration: '22:15',
      status: 'draft',
      views: 0,
      completionRate: 0
    },
    {
      id: 3,
      title: 'Sales Techniques Module 1',
      course: 'Advanced Sales Strategies',
      type: 'video',
      duration: '18:45',
      status: 'published',
      views: 156,
      completionRate: 92
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'text':
        return FileText;
      case 'interactive':
        return Play;
      default:
        return Play;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Module Editor</h1>
          <p className="text-gray-600">Create and edit individual learning modules</p>
        </div>
        <Button className="bg-brand-primary hover:bg-brand-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Module
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module List */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Your Modules</h3>
            <div className="space-y-3">
              {modules.map((module) => {
                const TypeIcon = getTypeIcon(module.type);
                
                return (
                  <div
                    key={module.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedModule === module.id
                        ? 'border-brand-primary bg-brand-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedModule(module.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="h-4 w-4 text-gray-500" />
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                          {module.title}
                        </h4>
                      </div>
                      <Badge className={getStatusColor(module.status)}>
                        {module.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{module.course}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{module.duration}</span>
                      <span>{module.views} views</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Module Editor */}
        <div className="lg:col-span-2">
          {selectedModule ? (
            <div className="space-y-6">
              {(() => {
                const module = modules.find(m => m.id === selectedModule);
                if (!module) return null;

                return (
                  <>
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">{module.title}</h2>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="bg-brand-primary hover:bg-brand-primary/90">
                            Publish
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-brand-primary">{module.views}</div>
                          <div className="text-sm text-gray-600">Views</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">{module.completionRate}%</div>
                          <div className="text-sm text-gray-600">Completion</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{module.duration}</div>
                          <div className="text-sm text-gray-600">Duration</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Module Title
                          </label>
                          <Input value={module.title} />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <Textarea placeholder="Describe what students will learn in this module..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Course
                            </label>
                            <Input value={module.course} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Duration
                            </label>
                            <Input value={module.duration} />
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-medium mb-4">Module Content</h3>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Add Content</h4>
                        <p className="text-gray-600 mb-4">Upload videos, add text, or create interactive elements</p>
                        
                        <div className="flex justify-center space-x-4">
                          <Button variant="outline">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Video
                          </Button>
                          <Button variant="outline">
                            <FileText className="h-4 w-4 mr-2" />
                            Add Text
                          </Button>
                          <Button variant="outline">
                            <Image className="h-4 w-4 mr-2" />
                            Add Image
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </>
                );
              })()}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Module</h3>
              <p className="text-gray-600 mb-6">Choose a module from the list to start editing</p>
              <Button className="bg-brand-primary hover:bg-brand-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Create New Module
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}