import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AnnouncementCreateForm } from './AnnouncementCreateForm';
import { AnnouncementManageList } from './AnnouncementManageList';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Save, 
  Calendar, 
  Bell,
  Megaphone,
  Image as ImageIcon,
  Star,
  AlertTriangle,
  CheckCircle,
  Upload,
  X,
  Search,
  Filter,
  Send,
  Clock,
  Users,
  TrendingUp,
  Award,
  Zap
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
  image?: string;
  tags: string[];
}

interface HeroBanner {
  id: number;
  title: string;
  description: string;
  image: string;
  badge: string;
  badgeColor: string;
  date: string;
  urgent: boolean;
  isActive: boolean;
  order: number;
}

export function AnnouncementEditor() {
  const [activeTab, setActiveTab] = useState('manage');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form state for new/edit announcement
  const [formData, setFormData] = useState<Partial<Announcement>>({
    type: 'business',
    title: '',
    message: '',
    author: 'Management Team',
    priority: 'normal',
    status: 'draft',
    isFeatured: false,
    isUrgent: false,
    targetAudience: 'all',
    tags: []
  });

  // Mock data for existing announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      type: 'system',
      title: 'Platform Maintenance Scheduled',
      message: 'MAXPULSE will undergo scheduled maintenance on December 20th from 2:00 AM - 4:00 AM EST. All services will be temporarily unavailable during this time.',
      author: 'System Admin',
      date: '2024-12-18',
      priority: 'high',
      status: 'published',
      isFeatured: true,
      isUrgent: true,
      targetAudience: 'all',
      tags: ['maintenance', 'system', 'downtime']
    },
    {
      id: 2,
      type: 'business',
      title: 'New Partnership with HealthTech Solutions',
      message: 'We\'re excited to announce our strategic partnership with HealthTech Solutions, expanding our assessment capabilities and market reach.',
      author: 'CEO Office',
      date: '2024-12-17',
      priority: 'normal',
      status: 'published',
      isFeatured: false,
      isUrgent: false,
      targetAudience: 'distributors',
      tags: ['partnership', 'growth', 'business']
    },
    {
      id: 3,
      type: 'achievement',
      title: '1 Million Assessments Milestone',
      message: 'MAXPULSE has officially processed over 1 million health assessments! Thank you to all our distributors for making this possible.',
      author: 'Management Team',
      date: '2024-12-15',
      priority: 'high',
      status: 'published',
      isFeatured: true,
      isUrgent: false,
      targetAudience: 'all',
      tags: ['milestone', 'achievement', 'success']
    }
  ]);

  // Mock data for hero banners
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([
    {
      id: 1,
      title: 'Q4 Performance Awards',
      description: 'Congratulations to our top-performing distributors! Join us for the virtual awards ceremony this Friday.',
      image: 'https://images.unsplash.com/photo-1677640724372-adb865d29aa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBhY2hpZXZlbWVudCUyMGF3YXJkc3xlbnwxfHx8fDE3NTY0ODYwNzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      badge: 'Awards',
      badgeColor: 'bg-yellow-100 text-yellow-800',
      date: '2024-12-15',
      urgent: true,
      isActive: true,
      order: 1
    },
    {
      id: 2,
      title: 'New AI Features Launch',
      description: 'Experience the future of health assessments with our latest AI-powered tools. Enhanced accuracy and faster results.',
      image: 'https://images.unsplash.com/photo-1663579973124-61c113e1521c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwdXBkYXRlJTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NTY0ODYwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      badge: 'Innovation',
      badgeColor: 'bg-blue-100 text-blue-800',
      date: '2024-12-12',
      urgent: false,
      isActive: true,
      order: 2
    },
    {
      id: 3,
      title: 'Company Updates & News',
      description: 'Stay informed about the latest developments and strategic initiatives across MAXPULSE platform.',
      image: 'https://images.unsplash.com/photo-1661704450248-87df8749d823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFubm91bmNlbWVudCUyMG9mZmljZXxlbnwxfHx8fDE3NTY0ODYwNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      badge: 'Business',
      badgeColor: 'bg-brand-primary/10 text-brand-primary',
      date: '2024-12-10',
      urgent: false,
      isActive: false,
      order: 3
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return <Zap className="h-4 w-4 text-orange-600" />;
      case 'business': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'achievement': return <Award className="h-4 w-4 text-yellow-600" />;
      case 'update': return <Zap className="h-4 w-4 text-green-600" />;
      case 'training': return <TrendingUp className="h-4 w-4 text-purple-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
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
      case 'normal': return 'bg-gray-100 text-gray-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateNew = () => {
    setFormData({
      type: 'business',
      title: '',
      message: '',
      author: 'Management Team',
      priority: 'normal',
      status: 'draft',
      isFeatured: false,
      isUrgent: false,
      targetAudience: 'all',
      tags: []
    });
    setSelectedAnnouncement(null);
    setIsEditing(true);
    setActiveTab('create');
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData(announcement);
    setSelectedAnnouncement(announcement);
    setIsEditing(true);
    setActiveTab('create');
  };

  const handleSave = () => {
    if (selectedAnnouncement) {
      // Update existing announcement
      setAnnouncements(prev => prev.map(a => 
        a.id === selectedAnnouncement.id ? { ...formData, id: selectedAnnouncement.id } as Announcement : a
      ));
    } else {
      // Create new announcement
      const newAnnouncement: Announcement = {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0]
      } as Announcement;
      setAnnouncements(prev => [newAnnouncement, ...prev]);
    }
    setIsEditing(false);
    setActiveTab('manage');
  };

  const handleDelete = (id: number) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || announcement.type === filterType;
    const matchesStatus = filterStatus === 'all' || announcement.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl text-gray-900">Announcement Editor</h1>
          <p className="text-gray-600 text-sm lg:text-base">Create and manage company announcements</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-brand-primary/10 text-brand-primary">
            {announcements.filter(a => a.status === 'published').length} Published
          </Badge>
          <Button onClick={handleCreateNew} className="bg-brand-primary hover:bg-brand-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Total Announcements</p>
              <p className="text-2xl text-gray-900">{announcements.length}</p>
            </div>
            <Megaphone className="h-8 w-8 text-brand-primary" />
          </div>
        </Card>

        <Card className="p-4 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Published</p>
              <p className="text-2xl text-gray-900">{announcements.filter(a => a.status === 'published').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">High Priority</p>
              <p className="text-2xl text-gray-900">{announcements.filter(a => a.priority === 'high').length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-brand-secondary" />
          </div>
        </Card>

        <Card className="p-4 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Featured</p>
              <p className="text-2xl text-gray-900">{announcements.filter(a => a.isFeatured).length}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manage">Manage Announcements</TabsTrigger>
          <TabsTrigger value="create">Create/Edit</TabsTrigger>
          <TabsTrigger value="banners">Hero Banners</TabsTrigger>
        </TabsList>
        <TabsContent value="manage">
          <AnnouncementManageList
            announcements={filteredAnnouncements}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreateNew={handleCreateNew}
            />
          </TabsContent>

        <TabsContent value="create">
          <AnnouncementCreateForm
            formData={formData}
            setFormData={setFormData}
            selectedAnnouncement={selectedAnnouncement}
            onSave={handleSave}
            onCancel={() => {
              setIsEditing(false);
              setSelectedAnnouncement(null);
              setFormData({
                type: "business",
                title: "",
                message: "",
                author: "",
                date: new Date().toISOString().split("T")[0],
                priority: "normal",
                status: "draft",
                isFeatured: false,
                isUrgent: false,
                targetAudience: "all",
                tags: [],
                views: 0,
                engagement: 0
              });
            }}
            previewMode={previewMode}
            setPreviewMode={setPreviewMode}
            />
          </TabsContent>

        <TabsContent value="banners">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Hero Banner Management</h3>
              <Button className="bg-brand-primary hover:bg-brand-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Banner
              </Button>
            </div>

            <div className="space-y-4">
              {heroBanners.map((banner) => (
                <div 
                  key={banner.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <ImageWithFallback
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-medium truncate">{banner.title}</h4>
                        <Badge className={banner.badgeColor} variant="secondary">
                          {banner.badge}
                        </Badge>
                        {banner.urgent && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                        <Badge className={banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{banner.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Order: {banner.order}</span>
                        <span>{new Date(banner.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}