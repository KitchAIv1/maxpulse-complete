import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LearningModule } from './LearningModule';
import { 
  Play, 
  BookOpen, 
  Award, 
  Clock, 
  CheckCircle, 
  Star,
  Download,
  Share2,
  Users,
  Target,
  TrendingUp,
  MessageCircle
} from 'lucide-react';

export function TrainingCenter() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showLearningModule, setShowLearningModule] = useState(false);
  const [selectedPathId, setSelectedPathId] = useState<number | null>(null);

  const handleContinueLearning = (pathId: number) => {
    setSelectedPathId(pathId);
    setShowLearningModule(true);
  };

  const handleBackToTrainingCenter = () => {
    setShowLearningModule(false);
    setSelectedPathId(null);
  };

  if (showLearningModule && selectedPathId) {
    return <LearningModule pathId={selectedPathId} onBack={handleBackToTrainingCenter} />;
  }

  const learningPaths = [
    {
      id: 1,
      title: 'MAXPULSE Foundations',
      description: 'Master the basics of health and wealth building',
      level: 'Beginner',
      duration: '2 hours',
      progress: 75,
      modules: 8,
      completed: 6,
      badge: 'Foundation Certified'
    },
    {
      id: 2,
      title: 'Advanced Sales Strategies',
      description: 'Learn proven techniques for higher conversions',
      level: 'Advanced',
      duration: '3 hours',
      progress: 40,
      modules: 12,
      completed: 5,
      badge: 'Sales Master'
    },
    {
      id: 3,
      title: 'Digital Marketing Mastery',
      description: 'Social media and online marketing strategies',
      level: 'Intermediate',
      duration: '4 hours',
      progress: 90,
      modules: 15,
      completed: 14,
      badge: 'Digital Expert'
    }
  ];

  const recentTraining = [
    {
      id: 1,
      title: 'Assessment Best Practices',
      type: 'video',
      duration: '15 min',
      completed: true,
      date: '2024-08-20'
    },
    {
      id: 2,
      title: 'Objection Handling Techniques',
      type: 'webinar',
      duration: '45 min',
      completed: true,
      date: '2024-08-18'
    },
    {
      id: 3,
      title: 'Social Media Content Templates',
      type: 'resource',
      duration: '5 min',
      completed: false,
      date: '2024-08-22'
    }
  ];

  const successStories = [
    {
      id: 1,
      distributor: 'Michael Chen',
      level: 'Platinum',
      achievement: 'Reached $10K monthly revenue',
      story: 'Discovered the power of consistent follow-up and personal branding...',
      video: true,
      likes: 47,
      comments: 12
    },
    {
      id: 2,
      distributor: 'Sarah Williams',
      level: 'Gold',
      achievement: 'Built team of 25 active distributors',
      story: 'Started with just social media posts and grew through authentic connections...',
      video: false,
      likes: 32,
      comments: 8
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Monthly Success Coaching Call',
      date: '2024-08-25',
      time: '2:00 PM EST',
      type: 'live',
      spots: 45,
      registered: true
    },
    {
      id: 2,
      title: 'Advanced Health Product Training',
      date: '2024-08-28',
      time: '7:00 PM EST',
      type: 'webinar',
      spots: 100,
      registered: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-gray-900">Training Center</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Award className="h-4 w-4 mr-2" />
          View Certifications
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Courses Completed</p>
              <p className="text-2xl text-gray-900">12</p>
            </div>
            <BookOpen className="h-8 w-8 text-brand-primary" />
          </div>
        </Card>

        <Card className="p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Certifications Earned</p>
              <p className="text-2xl text-gray-900">3</p>
            </div>
            <Award className="h-8 w-8 text-brand-secondary" />
          </div>
        </Card>

        <Card className="p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Learning Hours</p>
              <p className="text-2xl text-gray-900">28</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Skill Level</p>
              <p className="text-2xl text-gray-900">Advanced</p>
            </div>
            <Star className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">Learning Paths</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="success">Success Stories</TabsTrigger>
          <TabsTrigger value="events">Live Events</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Learning Paths */}
            <div className="space-y-4">
              <h3 className="text-lg">Recommended Learning Paths</h3>
              {learningPaths.map((path) => (
                <Card key={path.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg mb-2">{path.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{path.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <Badge variant="outline">{path.level}</Badge>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {path.duration}
                        </span>
                        <span>{path.completed}/{path.modules} modules</span>
                      </div>
                    </div>
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{path.progress}%</span>
                    </div>
                    <Progress value={path.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Badge: {path.badge}
                    </span>
                    <Button size="sm" onClick={() => handleContinueLearning(path.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Continue
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Recent Training */}
            <div className="space-y-4">
              <h3 className="text-lg">Recent Training</h3>
              <Card className="p-6">
                <div className="space-y-4">
                  {recentTraining.map((training) => (
                    <div key={training.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        {training.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        ) : (
                          <Play className="h-5 w-5 text-blue-600 mr-3" />
                        )}
                        <div>
                          <div className="text-sm">{training.title}</div>
                          <div className="text-xs text-gray-600">
                            {training.type} • {training.duration}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        {training.completed ? 'Review' : 'Start'}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Upcoming Events */}
              <h3 className="text-lg">Upcoming Events</h3>
              <Card className="p-6">
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm">{event.title}</h4>
                        <Badge className={event.registered ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {event.registered ? 'Registered' : 'Available'}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mb-3">
                        {event.date} • {event.time} • {event.spots} spots
                      </div>
                      <Button size="sm" disabled={event.registered}>
                        {event.registered ? 'Registered' : 'Register Now'}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Download className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg">Marketing Materials</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Download branded assets, social media templates, and presentation slides.
              </p>
              <Button variant="outline" className="w-full">
                Browse Resources
              </Button>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Share2 className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-lg">Social Media Kit</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Ready-to-post content for Facebook, Instagram, LinkedIn, and Twitter.
              </p>
              <Button variant="outline" className="w-full">
                Get Templates
              </Button>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Target className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-lg">Sales Scripts</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Proven conversation starters and follow-up message templates.
              </p>
              <Button variant="outline" className="w-full">
                View Scripts
              </Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="success">
          <div className="space-y-6">
            <h3 className="text-lg">Distributor Success Stories</h3>
            {successStories.map((story) => (
              <Card key={story.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-lg">{story.distributor}</h4>
                        <Badge className="bg-yellow-100 text-yellow-800">{story.level}</Badge>
                      </div>
                      {story.video && (
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4 mr-2" />
                          Watch Video
                        </Button>
                      )}
                    </div>
                    <h5 className="text-md mb-3 text-green-600">{story.achievement}</h5>
                    <p className="text-gray-600 mb-4">{story.story}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <button className="flex items-center hover:text-blue-600">
                        <Star className="h-4 w-4 mr-1" />
                        {story.likes} likes
                      </button>
                      <button className="flex items-center hover:text-blue-600">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {story.comments} comments
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg mb-4">Live Training Sessions</h3>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-md">{event.title}</h4>
                      <Badge variant={event.type === 'live' ? 'default' : 'secondary'}>
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {event.date} at {event.time}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {event.spots - (event.registered ? 1 : 0)} spots remaining
                      </span>
                      <Button size="sm" disabled={event.registered}>
                        {event.registered ? 'Registered' : 'Register'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg mb-4">Event Calendar</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-center text-gray-600">
                  Interactive calendar view coming soon
                </p>
                <Button className="w-full mt-4" variant="outline">
                  View Full Calendar
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}