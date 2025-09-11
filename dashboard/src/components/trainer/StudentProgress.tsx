import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { 
  Users,
  Search,
  Filter,
  MessageSquare,
  Award,
  Clock,
  TrendingUp,
  TrendingDown,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Play,
  FileQuestion,
  Calendar,
  Download,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  UserX,
  UserCheck
} from 'lucide-react';

export function StudentProgress() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortField, setSortField] = useState<string>('lastActivity');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  // Generate more sample data for realistic table view
  const generateStudents = () => {
    const names = [
      'Sarah Johnson', 'Mike Chen', 'Lisa Wang', 'David Smith', 'Emma Rodriguez',
      'James Wilson', 'Maria Garcia', 'Robert Brown', 'Jennifer Davis', 'Christopher Miller',
      'Amanda Wilson', 'Daniel Anderson', 'Jessica Taylor', 'Matthew Thomas', 'Ashley Jackson',
      'Andrew White', 'Melissa Harris', 'Joshua Martin', 'Sarah Thompson', 'Kevin Garcia',
      'Nicole Rodriguez', 'Brian Lewis', 'Stephanie Lee', 'Ryan Walker', 'Rachel Hall',
      'Brandon Allen', 'Laura Young', 'Jonathan King', 'Kimberly Wright', 'Tyler Lopez',
      'Michelle Hill', 'Aaron Scott', 'Crystal Green', 'Jacob Adams', 'Samantha Baker',
      'Nicholas Gonzalez', 'Heather Nelson', 'Anthony Carter', 'Elizabeth Mitchell',
      'William Perez', 'Christine Roberts', 'Alexander Turner', 'Deborah Phillips',
      'Benjamin Campbell', 'Dorothy Parker', 'Gregory Evans', 'Lisa Edwards', 'Kenneth Collins',
      'Sharon Stewart', 'Steven Sanchez', 'Karen Morris', 'Edward Rogers', 'Betty Reed'
    ];
    
    const levels = ['New Distributor', 'Bronze Distributor', 'Silver Distributor', 'Gold Distributor', 'Platinum Distributor', 'Diamond Distributor'];
    const statuses = ['active', 'inactive', 'new'];
    const courses = [
      'MAXPULSE Foundations',
      'Advanced Sales Strategies', 
      'Digital Marketing Mastery',
      'Health Assessment Training',
      'Team Leadership',
      'Customer Relationship Management',
      'Product Knowledge Mastery'
    ];

    return names.map((name, index) => ({
      id: index + 1,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8B1538&color=fff`,
      enrolledCourses: Math.floor(Math.random() * 6) + 1,
      completedCourses: Math.floor(Math.random() * 4),
      totalProgress: Math.floor(Math.random() * 100),
      studyTime: `${Math.floor(Math.random() * 50) + 1}h ${Math.floor(Math.random() * 60)}m`,
      lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      level: levels[Math.floor(Math.random() * levels.length)],
      achievements: Math.floor(Math.random() * 20),
      currentCourse: courses[Math.floor(Math.random() * courses.length)],
      enrollmentDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lastLoginDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
  };

  const students = generateStudents();

  const filters = [
    { value: 'all', label: 'All Students', count: students.length },
    { value: 'active', label: 'Active', count: students.filter(s => s.status === 'active').length },
    { value: 'inactive', label: 'Inactive', count: students.filter(s => s.status === 'inactive').length },
    { value: 'new', label: 'New', count: students.filter(s => s.status === 'new').length },
    { value: 'completed', label: 'Completed', count: students.filter(s => s.completedCourses > 0).length }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'new':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedStudents = () => {
    const filtered = students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.currentCourse.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || 
                           (selectedFilter === 'completed' ? student.completedCourses > 0 : student.status === selectedFilter);
      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortField as keyof typeof a];
      let bValue = b[sortField as keyof typeof b];

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortField === 'lastActivity' || sortField === 'enrollmentDate' || sortField === 'lastLoginDate') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredStudents = getSortedStudents();
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(paginatedStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: number, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    }
  };

  const overallStats = [
    {
      title: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Learners',
      value: students.filter(s => s.status === 'active').length,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Avg. Progress',
      value: Math.round(students.reduce((acc, s) => acc + s.totalProgress, 0) / students.length) + '%',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Study Time',
      value: '124h',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Student Progress</h1>
          <p className="text-gray-600">Monitor learner progress and engagement</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overallStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students by name, email, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
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
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Per page:</span>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {selectedStudents.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4 mr-1" />
                  Send Email
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Message
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Students Table */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              Students ({filteredStudents.length} total, showing {paginatedStudents.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedStudents.length === paginatedStudents.length && paginatedStudents.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-12"></TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('name')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Student
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('status')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Status
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('totalProgress')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Progress
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">Courses</TableHead>
                <TableHead className="hidden xl:table-cell">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('studyTime')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Study Time
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort('lastActivity')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Last Activity
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map((student) => {
                const daysSinceActivity = Math.floor((Date.now() - new Date(student.lastActivity).getTime()) / (1000 * 60 * 60 * 24));
                const isInactive = daysSinceActivity > 5;
                const isLowProgress = student.totalProgress < 30 && student.status !== 'new';
                const isHighProgress = student.totalProgress > 80;
                
                return (
                  <TableRow 
                    key={student.id} 
                    className={`hover:bg-gray-50 ${isInactive ? 'bg-yellow-50/50' : ''} ${isLowProgress ? 'bg-red-50/50' : ''} ${isHighProgress ? 'bg-green-50/50' : ''}`}
                  >
                    <TableCell>
                      <Checkbox 
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={(checked) => handleSelectStudent(student.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="text-xs">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">{student.name}</div>
                        <div className="text-sm text-gray-500 truncate">{student.email}</div>
                        <div className="text-xs text-gray-400 mt-1">{student.level}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge className={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                      {isInactive && (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 text-yellow-600 mr-1" />
                          <span className="text-xs text-yellow-600">Inactive</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="w-full max-w-[100px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{student.totalProgress}%</span>
                        </div>
                        <Progress value={student.totalProgress} className="h-2" />
                        {isLowProgress && (
                          <div className="flex items-center mt-1">
                            <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                            <span className="text-xs text-red-600">Low</span>
                          </div>
                        )}
                        {isHighProgress && (
                          <div className="flex items-center mt-1">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                            <span className="text-xs text-green-600">Excellent</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 font-medium">{student.enrolledCourses}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-green-600 font-medium">{student.completedCourses}</span>
                        </div>
                        <div className="text-xs text-gray-500">enrolled / completed</div>
                        <div className="text-xs text-gray-600 mt-1 truncate max-w-[120px]">{student.currentCourse}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="text-sm">
                        <div className="font-medium">{student.studyTime}</div>
                        <div className="text-xs text-gray-500">
                          <Award className="h-3 w-3 inline mr-1" />
                          {student.achievements} achievements
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{student.lastActivity}</div>
                        <div className="text-xs text-gray-500">
                          {daysSinceActivity === 0 ? 'Today' : 
                           daysSinceActivity === 1 ? 'Yesterday' : 
                           `${daysSinceActivity} days ago`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          {student.status === 'inactive' ? (
                            <DropdownMenuItem>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Mark as Active
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <UserX className="h-4 w-4 mr-2" />
                              Mark as Inactive
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'No students match the selected filters'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} students
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = currentPage <= 3 ? i + 1 : 
                                totalPages - currentPage <= 2 ? totalPages - 4 + i :
                                currentPage - 2 + i;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="text-gray-400">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-8 h-8 p-0"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}