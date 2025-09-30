import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Clock,
  Users,
  TrendingUp,
  Award,
  Zap,
  Megaphone,
  Bell
} from 'lucide-react';

interface Announcement {
  id: number;
  type: 'system' | 'business' | 'achievement' | 'update' | 'training';
  title: string;
  message: string;
  author: string;
  date: string;
  priority: 'low' | 'normal' | 'high';
  status: 'draft' | 'published' | 'scheduled';
  scheduledDate?: string;
  isFeatured: boolean;
  isUrgent: boolean;
  targetAudience: 'all' | 'distributors' | 'admins';
  imageUrl?: string;
  tags: string[];
  views: number;
  engagement: number;
}

interface AnnouncementManageListProps {
  announcements: Announcement[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: number) => void;
  onCreateNew: () => void;
}

/**
 * AnnouncementManageList Component - Announcement list management interface
 * Extracted from AnnouncementEditor.tsx to follow .cursorrules
 * 
 * Handles announcement listing, filtering, and management actions
 */
export function AnnouncementManageList({
  announcements,
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  onEdit,
  onDelete,
  onCreateNew
}: AnnouncementManageListProps) {

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return <Zap className="h-4 w-4 text-orange-600" />;
      case 'business': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'achievement': return <Award className="h-4 w-4 text-yellow-600" />;
      case 'update': return <Bell className="h-4 w-4 text-purple-600" />;
      case 'training': return <Users className="h-4 w-4 text-green-600" />;
      default: return <Megaphone className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || announcement.type === filterType;
    const matchesStatus = filterStatus === 'all' || announcement.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <Card className="p-6">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search announcements by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="achievement">Achievement</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="training">Training</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={onCreateNew} className="bg-brand-primary hover:bg-brand-primary/90">
            Create New
          </Button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Megaphone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No announcements found matching your criteria.</p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeIcon(announcement.type)}
                    <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                    {announcement.isFeatured && (
                      <Badge className="bg-purple-100 text-purple-800" variant="secondary">
                        Featured
                      </Badge>
                    )}
                    {announcement.isUrgent && (
                      <Badge variant="destructive">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {announcement.message}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>By {announcement.author}</span>
                    <span>•</span>
                    <span>{announcement.date}</span>
                    <span>•</span>
                    <Badge className={getStatusColor(announcement.status)} variant="secondary">
                      {announcement.status}
                    </Badge>
                    <Badge className={getPriorityColor(announcement.priority)} variant="secondary">
                      {announcement.priority}
                    </Badge>
                    <span>•</span>
                    <span>{announcement.views} views</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{announcement.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(announcement.type)}
                          <span className="text-sm font-medium capitalize">{announcement.type}</span>
                          {announcement.isFeatured && (
                            <Badge className="bg-purple-100 text-purple-800" variant="secondary">
                              Featured
                            </Badge>
                          )}
                          {announcement.isUrgent && (
                            <Badge variant="destructive">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <div className="prose max-w-none">
                          <p className="whitespace-pre-wrap">{announcement.message}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>By {announcement.author}</span>
                          <span>•</span>
                          <span>{announcement.date}</span>
                          <span>•</span>
                          <span className="capitalize">{announcement.priority} priority</span>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(announcement)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(announcement.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
