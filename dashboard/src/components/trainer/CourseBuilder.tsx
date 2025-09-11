import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { 
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Move,
  Eye,
  Users,
  Clock,
  Star,
  Play,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  Settings,
  Copy,
  Archive
} from 'lucide-react';

export function CourseBuilder() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

  const courses = [
    {
      id: 1,
      title: 'MAXPULSE Foundations',
      description: 'Comprehensive introduction to MAXPULSE principles and practices',
      status: 'published',
      modules: [
        {
          id: 1,
          title: 'Introduction to MAXPULSE',
          type: 'video',
          duration: '15:30',
          completed: true,
          description: 'Overview of MAXPULSE mission, vision, and core values'
        },
        {
          id: 2,
          title: 'Understanding Health Assessments',
          type: 'video',
          duration: '22:15',
          completed: true,
          description: 'Learn how to conduct effective health assessments'
        },
        {
          id: 3,
          title: 'Module 1-2 Knowledge Check',
          type: 'quiz',
          duration: '10:00',
          completed: false,
          description: 'Test your understanding of the first two modules'
        },
        {
          id: 4,
          title: 'Building Client Relationships',
          type: 'video',
          duration: '18:45',
          completed: false,
          description: 'Strategies for building lasting client relationships'
        }
      ],
      totalDuration: '66:30',
      enrolledStudents: 156,
      completionRate: 78,
      rating: 4.8,
      lastUpdated: '2024-08-25'
    },
    {
      id: 2,
      title: 'Advanced Sales Strategies',
      description: 'Advanced techniques for experienced distributors',
      status: 'draft',
      modules: [
        {
          id: 5,
          title: 'Psychology of Sales',
          type: 'video',
          duration: '25:00',
          completed: false,
          description: 'Understanding buyer psychology and motivation'
        },
        {
          id: 6,
          title: 'Handling Objections',
          type: 'video',
          duration: '20:30',
          completed: false,
          description: 'Professional techniques for overcoming objections'
        }
      ],
      totalDuration: '45:30',
      enrolledStudents: 0,
      completionRate: 0,
      rating: 0,
      lastUpdated: '2024-08-28'
    }
  ];

  const toggleModuleExpansion = (moduleId: number) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

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

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Play;
      case 'quiz':
        return FileQuestion;
      default:
        return Play;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Course Builder</h1>
          <p className="text-gray-600">Create and manage your training courses</p>
        </div>
        <Button className="bg-brand-primary hover:bg-brand-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Course
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course List */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Your Courses</h3>
            <div className="space-y-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCourse === course.id
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedCourse(course.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                      {course.title}
                    </h4>
                    <Badge className={getStatusColor(course.status)}>
                      {course.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{course.modules.length} modules</span>
                    <span>{course.totalDuration}</span>
                  </div>
                  {course.status === 'published' && (
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                      <span>{course.enrolledStudents} students</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        {course.rating}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Course Builder */}
        <div className="lg:col-span-2">
          {selectedCourse ? (
            <div className="space-y-6">
              {(() => {
                const course = courses.find(c => c.id === selectedCourse);
                if (!course) return null;

                return (
                  <>
                    {/* Course Header */}
                    <Card className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
                            <Badge className={getStatusColor(course.status)}>
                              {course.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-4">{course.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">Modules</div>
                              <div className="font-medium">{course.modules.length}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Duration</div>
                              <div className="font-medium">{course.totalDuration}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Students</div>
                              <div className="font-medium">{course.enrolledStudents}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Completion</div>
                              <div className="font-medium">{course.completionRate}%</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {course.status === 'published' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-800">Course Progress</span>
                            <span className="text-sm text-green-700">{course.completionRate}%</span>
                          </div>
                          <Progress value={course.completionRate} className="h-2" />
                        </div>
                      )}
                    </Card>

                    {/* Course Modules */}
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium">Course Modules</h3>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Module
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {course.modules.map((module, index) => {
                          const ModuleIcon = getModuleIcon(module.type);
                          const isExpanded = expandedModules.has(module.id);

                          return (
                            <div key={module.id} className="border rounded-lg">
                              <div className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium">
                                      {index + 1}
                                    </div>
                                    <ModuleIcon className="h-5 w-5 text-gray-500" />
                                    <div>
                                      <h4 className="font-medium text-gray-900">{module.title}</h4>
                                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span className="capitalize">{module.type}</span>
                                        <span>{module.duration}</span>
                                        {module.completed && (
                                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                                            Complete
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Move className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => toggleModuleExpansion(module.id)}
                                    >
                                      {isExpanded ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                {isExpanded && (
                                  <div className="mt-4 pl-11 space-y-3">
                                    <p className="text-sm text-gray-600">{module.description}</p>
                                    
                                    <div className="flex items-center space-x-4">
                                      <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4 mr-2" />
                                        Preview
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Content
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <Settings className="h-4 w-4 mr-2" />
                                        Settings
                                      </Button>
                                    </div>

                                    {module.type === 'video' && (
                                      <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-sm text-gray-600 mb-2">Video Details</div>
                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                          <div>
                                            <span className="text-gray-500">Format:</span> MP4
                                          </div>
                                          <div>
                                            <span className="text-gray-500">Size:</span> 45.2 MB
                                          </div>
                                          <div>
                                            <span className="text-gray-500">Resolution:</span> 1080p
                                          </div>
                                          <div>
                                            <span className="text-gray-500">Upload:</span> Complete
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {module.type === 'quiz' && (
                                      <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-sm text-gray-600 mb-2">Quiz Details</div>
                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                          <div>
                                            <span className="text-gray-500">Questions:</span> 8
                                          </div>
                                          <div>
                                            <span className="text-gray-500">Pass Score:</span> 80%
                                          </div>
                                          <div>
                                            <span className="text-gray-500">Time Limit:</span> 10 min
                                          </div>
                                          <div>
                                            <span className="text-gray-500">Attempts:</span> 3
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-6 flex justify-center">
                        <Button variant="outline" className="border-dashed">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Another Module
                        </Button>
                      </div>
                    </Card>

                    {/* Course Actions */}
                    <Card className="p-6">
                      <h3 className="text-lg font-medium mb-4">Course Actions</h3>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview Course
                        </Button>
                        <Button variant="outline">
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate Course
                        </Button>
                        <Button variant="outline">
                          <Archive className="h-4 w-4 mr-2" />
                          Archive Course
                        </Button>
                        <Button variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Course
                        </Button>
                        
                        <div className="ml-auto">
                          {course.status === 'draft' ? (
                            <Button className="bg-brand-primary hover:bg-brand-primary/90">
                              Publish Course
                            </Button>
                          ) : (
                            <Button variant="outline">
                              Unpublish Course
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </>
                );
              })()}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
              <p className="text-gray-600 mb-6">Choose a course from the list to start building and editing</p>
              <Button className="bg-brand-primary hover:bg-brand-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Create New Course
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}