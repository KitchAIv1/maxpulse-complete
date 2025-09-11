import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  FolderOpen,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  File,
  FileText,
  Image,
  Video,
  Archive,
  Plus
} from 'lucide-react';

export function ResourceManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const resources = [
    {
      id: 1,
      name: 'MAXPULSE Product Catalog.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadDate: '2024-08-25',
      downloads: 45,
      category: 'product-info'
    },
    {
      id: 2,
      name: 'Assessment Training Video.mp4',
      type: 'video',
      size: '125.8 MB',
      uploadDate: '2024-08-20',
      downloads: 89,
      category: 'training'
    },
    {
      id: 3,
      name: 'Sales Process Flowchart.png',
      type: 'image',
      size: '856 KB',
      uploadDate: '2024-08-18',
      downloads: 32,
      category: 'reference'
    },
    {
      id: 4,
      name: 'Health Assessment Template.docx',
      type: 'document',
      size: '1.2 MB',
      uploadDate: '2024-08-15',
      downloads: 67,
      category: 'templates'
    },
    {
      id: 5,
      name: 'Nutrition Guidelines.pdf',
      type: 'pdf',
      size: '3.1 MB',
      uploadDate: '2024-08-10',
      downloads: 78,
      category: 'reference'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Resources', count: resources.length },
    { value: 'training', label: 'Training Materials', count: resources.filter(r => r.category === 'training').length },
    { value: 'product-info', label: 'Product Information', count: resources.filter(r => r.category === 'product-info').length },
    { value: 'templates', label: 'Templates', count: resources.filter(r => r.category === 'templates').length },
    { value: 'reference', label: 'Reference Materials', count: resources.filter(r => r.category === 'reference').length }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'image':
        return Image;
      case 'pdf':
      case 'document':
        return FileText;
      default:
        return File;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-purple-100 text-purple-800';
      case 'image':
        return 'bg-green-100 text-green-800';
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'document':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Resource Manager</h1>
          <p className="text-gray-600">Upload and manage training resources and materials</p>
        </div>
        <Button className="bg-brand-primary hover:bg-brand-primary/90">
          <Upload className="h-4 w-4 mr-2" />
          Upload Resource
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-brand-primary text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{category.label}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedCategory === category.value
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {category.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Resources Grid */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">
                Resources ({filteredResources.length})
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Sort by:</span>
                <select className="border border-gray-300 rounded px-2 py-1">
                  <option>Upload Date</option>
                  <option>Name</option>
                  <option>Downloads</option>
                  <option>Size</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredResources.map((resource) => {
                const FileIcon = getFileIcon(resource.type);
                
                return (
                  <div key={resource.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FileIcon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {resource.name}
                          </h4>
                          <Badge className={getFileTypeColor(resource.type)}>
                            {resource.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span>{resource.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uploaded:</span>
                        <span>{resource.uploadDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Downloads:</span>
                        <span>{resource.downloads}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 'Try adjusting your search terms' : 'Upload your first resource to get started'}
                </p>
                <Button className="bg-brand-primary hover:bg-brand-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Resource
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}