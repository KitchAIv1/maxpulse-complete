import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
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
  imageUrl?: string;
  tags: string[];
  views: number;
  engagement: number;
}

interface AnnouncementCreateFormProps {
  formData: Partial<Announcement>;
  setFormData: (data: Partial<Announcement> | ((prev: Partial<Announcement>) => Partial<Announcement>)) => void;
  selectedAnnouncement: Announcement | null;
  onSave: () => void;
  onCancel: () => void;
  previewMode: boolean;
  setPreviewMode: (preview: boolean) => void;
}

/**
 * AnnouncementCreateForm Component - Form for creating/editing announcements
 * Extracted from AnnouncementEditor.tsx to follow .cursorrules
 * 
 * Handles announcement creation, editing, and preview functionality
 */
export function AnnouncementCreateForm({
  formData,
  setFormData,
  selectedAnnouncement,
  onSave,
  onCancel,
  previewMode,
  setPreviewMode
}: AnnouncementCreateFormProps) {

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

  if (previewMode) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Preview Announcement</h3>
          <Button
            variant="outline"
            onClick={() => setPreviewMode(false)}
          >
            <X className="h-4 w-4 mr-2" />
            Close Preview
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {getTypeIcon(formData.type || 'business')}
            <span className="text-sm font-medium capitalize">{formData.type}</span>
            {formData.isFeatured && <Star className="h-4 w-4 text-yellow-500" />}
            {formData.isUrgent && <AlertTriangle className="h-4 w-4 text-red-500" />}
          </div>

          <h2 className="text-xl font-bold">{formData.title}</h2>
          
          {formData.imageUrl && (
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={formData.imageUrl}
                alt={formData.title || 'Announcement image'}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{formData.message}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>By {formData.author}</span>
            <span>•</span>
            <span>{formData.date}</span>
            <span>•</span>
            <span className="capitalize">{formData.priority} priority</span>
          </div>

          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">
          {selectedAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(true)}
            disabled={!formData.title || !formData.message}
          >
            Preview
          </Button>
          <Button onClick={onSave} disabled={!formData.title || !formData.message}>
            <Save className="h-4 w-4 mr-2" />
            {selectedAnnouncement ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter announcement title..."
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Enter announcement message..."
              rows={6}
            />
          </div>

          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Author name..."
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="imageUrl"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type || 'business'}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="achievement">Achievement</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="training">Training</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority || 'normal'}
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status || 'draft'}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Select
              value={formData.targetAudience || 'all'}
              onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="distributors">Distributors Only</SelectItem>
                <SelectItem value="admins">Admins Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.status === 'scheduled' && (
            <div>
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={formData.scheduledDate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.isFeatured || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
            />
            <Label htmlFor="featured">Featured Announcement</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="urgent"
              checked={formData.isUrgent || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isUrgent: checked }))}
            />
            <Label htmlFor="urgent">Urgent</Label>
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {formData.imageUrl && (
        <Card className="p-4 bg-gray-50">
          <Label className="text-sm font-medium mb-2 block">Image Preview</Label>
          <div className="w-full h-32 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={formData.imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={!formData.title || !formData.message}>
          <Save className="h-4 w-4 mr-2" />
          {selectedAnnouncement ? 'Update' : 'Create'} Announcement
        </Button>
      </div>
    </Card>
  );
}
