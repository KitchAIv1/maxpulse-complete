import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Library,
  Search,
  Filter,
  BookOpen,
  Play,
  FileQuestion,
  Eye,
  Copy,
  Star,
  Clock,
  Users,
  TrendingUp,
  Grid,
  List
} from 'lucide-react';

export function ContentLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const contentItems = [
    {
      id: 1,
      title: 'MAXPULSE Foundations Course',
      type: 'course',
      status: 'published',
      modules: 8,
      duration: '2h 30m',
      enrollments: 156,
      rating: 4.8,
      lastUpdated: '2024-08-25',
      thumbnail: '📚',
      description: 'Complete introduction to MAXPULSE principles'
    },
    {
      id: 2,
      title: 'Health Assessment Module',
      type: 'module',
      status: 'published',
      duration: '22m',
      views: 342,
      rating: 4.9,
      lastUpdated: '2024-08-20',
      thumbnail: '🏥',
      description: 'Learn effective health assessment techniques'
    },
    {
      id: 3,
      title: 'Sales Techniques Quiz',
      type: 'quiz',
      status: 'published',
      questions: 15,
      attempts: 89,
      avgScore: 87,
      lastUpdated: '2024-08-18',
      thumbnail: '📝',
      description: 'Test knowledge of advanced sales strategies'
    },
    {
      id: 4,
      title: 'Digital Marketing Mastery',
      type: 'course',
      status: 'draft',
      modules: 12,
      duration: '3h 45m',
      enrollments: 0,
      rating: 0,
      lastUpdated: '2024-08-28',
      thumbnail: '📱',
      description: 'Complete digital marketing training program'
    },
    {
      id: 5,
      title: 'Client Communication Skills',
      type: 'module',
      status: 'published',
      duration: '18m',
      views: 234,
      rating: 4.7,
      lastUpdated: '2024-08-15',
      thumbnail: '💬',
      description: 'Improve your client communication techniques'
    },
    {
      id: 6,
      title: 'Product Knowledge Assessment',
      type: 'quiz',
      status: 'published',
      questions: 20,
      attempts: 67,
      avgScore: 92,
      lastUpdated: '2024-08-12',
      thumbnail: '🧪',
      description: 'Comprehensive product knowledge evaluation'
    }
  ];

  const filters = [
    { value: 'all', label: 'All Content', count: contentItems.length },
    { value: 'course', label: 'Courses', count: contentItems.filter(item => item.type === 'course').length },
    { value: 'module', label: 'Modules', count: contentItems.filter(item => item.type === 'module').length },
    { value: 'quiz', label: 'Quizzes', count: contentItems.filter(item => item.type === 'quiz').length }
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
      case 'course':
        return BookOpen;
      case 'module':
        return Play;
      case 'quiz':
        return FileQuestion;
      default:
        return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'text-blue-600';
      case 'module':
        return 'text-purple-600';
      case 'quiz':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Content Library</h1>
          <p className="text-gray-600">Browse and manage your training content collection</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant={selectedFilter === filter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter.value)}
              >
                {filter.label} ({filter.count})
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Content Grid/List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">
            Content Items ({filteredContent.length})
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Sort by:</span>
            <select className="border border-gray-300 rounded px-2 py-1">
              <option>Last Updated</option>
              <option>Title</option>
              <option>Type</option>
              <option>Rating</option>
              <option>Enrollments</option>
            </select>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              
              return (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{item.thumbnail}</div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <TypeIcon className={`h-4 w-4 ${getTypeColor(item.type)}`} />
                      <Badge variant="outline" className="text-xs capitalize">
                        {item.type}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {item.type === 'course' && (
                      <>
                        <div className="flex justify-between">
                          <span>Modules:</span>
                          <span>{item.modules}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>{item.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Enrollments:</span>
                          <span>{item.enrollments}</span>
                        </div>
                        {item.rating && item.rating > 0 && (
                          <div className="flex justify-between">
                            <span>Rating:</span>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              {item.rating}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {item.type === 'module' && (
                      <>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>{item.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Views:</span>
                          <span>{item.views}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rating:</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            {item.rating}
                          </div>
                        </div>
                      </>
                    )}

                    {item.type === 'quiz' && (
                      <>
                        <div className="flex justify-between">
                          <span>Questions:</span>
                          <span>{item.questions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Attempts:</span>
                          <span>{item.attempts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg. Score:</span>
                          <span>{item.avgScore}%</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Copy className="h-3 w-3 mr-1" />
                      Duplicate
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContent.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              
              return (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{item.thumbnail}</div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <TypeIcon className={`h-4 w-4 ${getTypeColor(item.type)}`} />
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      {item.type === 'course' && (
                        <>
                          <div className="text-center">
                            <div className="font-medium">{item.modules}</div>
                            <div>Modules</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{item.enrollments}</div>
                            <div>Students</div>
                          </div>
                          {item.rating && item.rating > 0 && (
                            <div className="text-center">
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                <span className="font-medium">{item.rating}</span>
                              </div>
                              <div>Rating</div>
                            </div>
                          )}
                        </>
                      )}

                      {item.type === 'module' && (
                        <>
                          <div className="text-center">
                            <div className="font-medium">{item.duration}</div>
                            <div>Duration</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{item.views}</div>
                            <div>Views</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              <span className="font-medium">{item.rating}</span>
                            </div>
                            <div>Rating</div>
                          </div>
                        </>
                      )}

                      {item.type === 'quiz' && (
                        <>
                          <div className="text-center">
                            <div className="font-medium">{item.questions}</div>
                            <div>Questions</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{item.attempts}</div>
                            <div>Attempts</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{item.avgScore}%</div>
                            <div>Avg Score</div>
                          </div>
                        </>
                      )}

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <Library className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Start creating content to build your library'}
            </p>
            <Button className="bg-brand-primary hover:bg-brand-primary/90">
              Create New Content
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}