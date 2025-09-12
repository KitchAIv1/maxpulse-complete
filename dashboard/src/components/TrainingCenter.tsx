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
  MessageCircle,
  Search,
  Filter,
  Bookmark,
  Eye,
  ThumbsUp,
  Zap,
  Trophy,
  Flame,
  Crown
} from 'lucide-react';

export function TrainingCenter() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showLearningModule, setShowLearningModule] = useState(false);
  const [selectedPathId, setSelectedPathId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [bookmarkedCourses, setBookmarkedCourses] = useState<number[]>([]);

  const handleContinueLearning = (pathId: number) => {
    setSelectedPathId(pathId);
    setShowLearningModule(true);
  };

  const handleBackToTrainingCenter = () => {
    setShowLearningModule(false);
    setSelectedPathId(null);
  };

  const toggleBookmark = (courseId: number) => {
    setBookmarkedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  if (showLearningModule && selectedPathId) {
    return <LearningModule pathId={selectedPathId} onBack={handleBackToTrainingCenter} />;
  }

  const learningPaths = [
    {
      id: 1,
      title: 'MAXPULSE Foundations',
      description: 'Master the basics of health and wealth building with comprehensive training modules',
      level: 'Beginner',
      levelColor: 'bg-green-100 text-green-800 border-green-200',
      duration: '2 hours',
      progress: 75,
      modules: 8,
      completed: 6,
      badge: 'Foundation Certified',
      instructor: 'Dr. Sarah Johnson',
      rating: 4.9,
      students: 1247,
      isRecommended: true,
      isPopular: false,
      thumbnail: '🎯',
      skills: ['Assessment Basics', 'Client Communication', 'Product Knowledge'],
      nextModule: 'Module 7: Advanced Techniques'
    },
    {
      id: 2,
      title: 'Advanced Sales Strategies',
      description: 'Learn proven techniques for higher conversions and closing deals effectively',
      level: 'Advanced',
      levelColor: 'bg-red-100 text-red-800 border-red-200',
      duration: '3 hours',
      progress: 40,
      modules: 12,
      completed: 5,
      badge: 'Sales Master',
      instructor: 'Michael Chen',
      rating: 4.8,
      students: 892,
      isRecommended: false,
      isPopular: true,
      thumbnail: '💼',
      skills: ['Objection Handling', 'Closing Techniques', 'Follow-up Strategies'],
      nextModule: 'Module 6: Psychological Triggers'
    },
    {
      id: 3,
      title: 'Digital Marketing Mastery',
      description: 'Social media and online marketing strategies for modern distributors',
      level: 'Intermediate',
      levelColor: 'bg-blue-100 text-blue-800 border-blue-200',
      duration: '4 hours',
      progress: 90,
      modules: 15,
      completed: 14,
      badge: 'Digital Expert',
      instructor: 'Lisa Rodriguez',
      rating: 4.9,
      students: 2156,
      isRecommended: true,
      isPopular: true,
      thumbnail: '📱',
      skills: ['Social Media', 'Content Creation', 'Lead Generation'],
      nextModule: 'Module 15: Advanced Analytics'
    }
  ];

  const filteredPaths = learningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = levelFilter === 'All' || path.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl text-gray-900 truncate">Training Center</h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">Accelerate your success with expert-led training</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
          <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 text-sm">
            <Trophy className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="hidden sm:inline">Leaderboard</span>
            <span className="sm:hidden">Board</span>
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white text-sm">
            <Award className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="hidden sm:inline">View Certifications</span>
            <span className="sm:hidden">Certificates</span>
          </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses, skills, or instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Learning Paths */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg">Learning Paths</h3>
                <span className="text-sm text-gray-500">{filteredPaths.length} courses</span>
              </div>
              
              {filteredPaths.map((path) => (
                <Card key={path.id} className="p-4 sm:p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-red-500">
                  {/* Header with badges */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className="text-2xl sm:text-3xl flex-shrink-0">{path.thumbnail}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h4 className="text-base sm:text-lg font-semibold truncate pr-2">{path.title}</h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            {path.isRecommended && (
                              <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                                <Crown className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">Recommended</span>
                                <span className="sm:hidden">Rec</span>
                              </Badge>
                            )}
                            {path.isPopular && (
                              <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                                <Flame className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">Popular</span>
                                <span className="sm:hidden">Pop</span>
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{path.description}</p>
                        
                        {/* Course metadata */}
                        <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                          <Badge variant="outline" className={`${path.levelColor} text-xs`}>{path.level}</Badge>
                          <span className="flex items-center whitespace-nowrap">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                            {path.duration}
                          </span>
                          <span className="flex items-center whitespace-nowrap">
                            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                            <span className="hidden sm:inline">{path.completed}/{path.modules} modules</span>
                            <span className="sm:hidden">{path.completed}/{path.modules}</span>
                          </span>
                          <span className="hidden md:flex items-center whitespace-nowrap">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                            {path.students.toLocaleString()}
                          </span>
                          <span className="flex items-center whitespace-nowrap">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-yellow-500 flex-shrink-0" />
                            {path.rating}
                          </span>
                        </div>

                        {/* Skills tags */}
                        <div className="flex items-start gap-2 mb-3 overflow-hidden">
                          <span className="text-xs text-gray-500 flex-shrink-0 mt-1">Skills:</span>
                          <div className="flex flex-wrap gap-1 min-w-0">
                            {path.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs whitespace-nowrap">
                                {skill}
                              </Badge>
                            ))}
                            {path.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{path.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Instructor */}
                        <p className="text-xs text-gray-500 truncate">
                          Instructor: <span className="font-medium">{path.instructor}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(path.id)}
                        className={`${bookmarkedCourses.includes(path.id) ? 'text-red-600' : 'text-gray-400'} p-2`}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Award className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                    </div>
                  </div>
                  
                  {/* Progress section */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">Progress</span>
                      <span className="text-red-600 font-semibold">{path.progress}%</span>
                    </div>
                    
                    {/* Custom Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${path.progress}%` }}
                      />
                    </div>
                    
                    {path.progress > 0 && path.progress < 100 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Next: {path.nextModule}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs sm:text-sm text-gray-600 truncate">
                        🏆 {path.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                        <span className="hidden sm:inline">Preview</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleContinueLearning(path.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
                      >
                        <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                        {path.progress > 0 ? 'Continue' : 'Start'}
                      </Button>
                    </div>
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