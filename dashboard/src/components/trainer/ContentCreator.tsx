import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { 
  BookOpen,
  Play,
  FileQuestion,
  Upload,
  Plus,
  Trash2,
  Eye,
  Save,
  Wand2,
  Image,
  Video,
  FileText,
  Link,
  Settings,
  Target,
  Clock,
  Users
} from 'lucide-react';

export function ContentCreator() {
  const [contentType, setContentType] = useState<'course' | 'module' | 'quiz'>('course');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    duration: '',
    targetAudience: '',
    objectives: [''],
    prerequisites: [''],
    tags: []
  });

  const contentTemplates = [
    {
      type: 'course',
      title: 'Complete Training Course',
      description: 'Multi-module comprehensive training program',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      type: 'module',
      title: 'Single Learning Module',
      description: 'Individual video or text-based lesson',
      icon: Play,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      type: 'quiz',
      title: 'Knowledge Assessment',
      description: 'Quiz or test to evaluate learning',
      icon: FileQuestion,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const categories = [
    'MAXPULSE Foundations',
    'Sales Training',
    'Health & Wellness',
    'Digital Marketing',
    'Leadership Development',
    'Product Knowledge',
    'Communication Skills',
    'Technical Training'
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const targetAudiences = [
    'New Distributors',
    'Experienced Distributors',
    'Team Leaders',
    'Regional Managers',
    'All Distributors',
    'Health Professionals',
    'Marketing Specialists'
  ];

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const addPrerequisite = () => {
    setFormData(prev => ({
      ...prev,
      prerequisites: [...prev.prerequisites, '']
    }));
  };

  const removePrerequisite = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  const updatePrerequisite = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.map((prereq, i) => i === index ? value : prereq)
    }));
  };

  const aiSuggestions = {
    titles: [
      "Mastering MAXPULSE: Your Complete Guide to Success",
      "Advanced Distributor Training: Building Your Empire",
      "Health Assessment Mastery: Connect and Convert",
      "Digital Marketing for MAXPULSE Distributors"
    ],
    objectives: [
      "Understand the core principles of health and wellness assessment",
      "Develop effective communication skills for client interactions",
      "Master the art of follow-up and relationship building",
      "Learn proven sales techniques for product recommendations",
      "Build confidence in presenting MAXPULSE solutions"
    ]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Create New Content</h1>
          <p className="text-gray-600">Build engaging training materials for MAXPULSE distributors</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button className="bg-brand-primary hover:bg-brand-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Content Type Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Choose Content Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contentTemplates.map((template) => (
            <div
              key={template.type}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                contentType === template.type
                  ? 'border-brand-primary bg-brand-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setContentType(template.type as 'course' | 'module' | 'quiz')}
            >
              <div className={`p-3 rounded-lg ${template.bgColor} mb-3 w-fit`}>
                <template.icon className={`h-6 w-6 ${template.color}`} />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">{template.title}</h4>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Content Creation Form */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="publish">Publish</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter content title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <div className="mt-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Wand2 className="h-3 w-3 mr-1" />
                      AI Suggestions
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty Level *</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 2 hours, 30 minutes"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetAudiences.map((audience) => (
                        <SelectItem key={audience} value={audience}>
                          {audience}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the content"
                    className="min-h-20"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Learning Objectives */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Learning Objectives</Label>
                <Button type="button" variant="outline" size="sm" onClick={addObjective}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Objective
                </Button>
              </div>
              <div className="space-y-2">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder={`Learning objective ${index + 1}`}
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                    />
                    {formData.objectives.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeObjective(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Prerequisites</Label>
                <Button type="button" variant="outline" size="sm" onClick={addPrerequisite}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Prerequisite
                </Button>
              </div>
              <div className="space-y-2">
                {formData.prerequisites.map((prerequisite, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder={`Prerequisite ${index + 1}`}
                      value={prerequisite}
                      onChange={(e) => updatePrerequisite(index, e.target.value)}
                    />
                    {formData.prerequisites.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePrerequisite(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Content Builder</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                  <Button variant="outline" size="sm">
                    <Link className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                </div>
              </div>

              {/* Content Type Specific Builder */}
              {contentType === 'course' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Build Your Course</h4>
                    <p className="text-gray-600 mb-4">Start by adding modules to your course</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Module
                    </Button>
                  </div>
                </div>
              )}

              {contentType === 'module' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                      <Video className="h-6 w-6" />
                      <span className="text-sm">Video</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                      <FileText className="h-6 w-6" />
                      <span className="text-sm">Text</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                      <Image className="h-6 w-6" />
                      <span className="text-sm">Image</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                      <FileQuestion className="h-6 w-6" />
                      <span className="text-sm">Quiz</span>
                    </Button>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Add Content</h4>
                    <p className="text-gray-600 mb-4">Choose content type and start building your module</p>
                  </div>
                </div>
              )}

              {contentType === 'quiz' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileQuestion className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Create Quiz</h4>
                    <p className="text-gray-600 mb-4">Add questions to test knowledge</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Question
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-medium">Content Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Comments</Label>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Allow Downloads</Label>
                  <input type="checkbox" className="toggle" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Track Progress</Label>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Require Completion</Label>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Pass Score (%)</Label>
                  <Input type="number" placeholder="80" min="0" max="100" />
                </div>
                
                <div>
                  <Label>Max Attempts</Label>
                  <Input type="number" placeholder="3" min="1" />
                </div>
                
                <div>
                  <Label>Time Limit (minutes)</Label>
                  <Input type="number" placeholder="No limit" min="0" />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="publish">
          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-medium">Publish Content</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Visibility</Label>
                  <Select defaultValue="private">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private (Draft)</SelectItem>
                      <SelectItem value="internal">Internal Review</SelectItem>
                      <SelectItem value="public">Public (Published)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Publish Date</Label>
                  <Input type="datetime-local" />
                </div>
                
                <div>
                  <Label>Expiry Date (Optional)</Label>
                  <Input type="datetime-local" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Publishing Checklist</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Title and description added</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span>Content added</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span>Learning objectives defined</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span>Settings configured</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span>Preview tested</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline">Save as Draft</Button>
              <Button variant="outline">Submit for Review</Button>
              <Button className="bg-brand-primary hover:bg-brand-primary/90">
                Publish Now
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}