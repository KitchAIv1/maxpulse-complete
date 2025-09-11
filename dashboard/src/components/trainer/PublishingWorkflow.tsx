import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  ArrowRight,
  Calendar,
  User,
  FileText,
  AlertCircle,
  Zap
} from 'lucide-react';

export function PublishingWorkflow() {
  const [selectedTab, setSelectedTab] = useState('pending');

  const publishingItems = [
    {
      id: 1,
      title: 'Advanced Sales Strategies Course',
      type: 'course',
      status: 'pending_approval',
      submittedBy: 'Dr. Michael Chen',
      submittedDate: '2024-08-28',
      reviewer: 'Sarah Johnson',
      priority: 'high',
      modules: 12,
      estimatedReviewTime: '2-3 days',
      progress: 45
    },
    {
      id: 2,
      title: 'Health Assessment Module Update',
      type: 'module',
      status: 'in_review',
      submittedBy: 'Dr. Michael Chen',
      submittedDate: '2024-08-25',
      reviewer: 'Admin Team',
      priority: 'medium',
      estimatedReviewTime: '1-2 days',
      progress: 75
    },
    {
      id: 3,
      title: 'Product Knowledge Quiz',
      type: 'quiz',
      status: 'approved',
      submittedBy: 'Dr. Michael Chen',
      submittedDate: '2024-08-20',
      reviewer: 'Sarah Johnson',
      approvedDate: '2024-08-22',
      publishDate: '2024-08-23',
      priority: 'low',
      progress: 100
    },
    {
      id: 4,
      title: 'Digital Marketing Fundamentals',
      type: 'course',
      status: 'rejected',
      submittedBy: 'Dr. Michael Chen',
      submittedDate: '2024-08-18',
      reviewer: 'Admin Team',
      rejectedDate: '2024-08-20',
      rejectionReason: 'Content needs more interactive elements and updated screenshots',
      priority: 'medium',
      progress: 0
    }
  ];

  const statusConfig = {
    pending_approval: {
      label: 'Pending Approval',
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock
    },
    in_review: {
      label: 'In Review',
      color: 'bg-blue-100 text-blue-800',
      icon: Eye
    },
    approved: {
      label: 'Approved',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle
    },
    rejected: {
      label: 'Rejected',
      color: 'bg-red-100 text-red-800',
      icon: XCircle
    },
    published: {
      label: 'Published',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle
    }
  };

  const priorityConfig = {
    high: { color: 'bg-red-100 text-red-800' },
    medium: { color: 'bg-yellow-100 text-yellow-800' },
    low: { color: 'bg-green-100 text-green-800' }
  };

  const tabs = [
    {
      key: 'pending',
      label: 'Pending Review',
      count: publishingItems.filter(item => ['pending_approval', 'in_review'].includes(item.status)).length
    },
    {
      key: 'approved',
      label: 'Approved',
      count: publishingItems.filter(item => item.status === 'approved').length
    },
    {
      key: 'rejected',
      label: 'Rejected',
      count: publishingItems.filter(item => item.status === 'rejected').length
    },
    {
      key: 'all',
      label: 'All Items',
      count: publishingItems.length
    }
  ];

  const getFilteredItems = () => {
    switch (selectedTab) {
      case 'pending':
        return publishingItems.filter(item => ['pending_approval', 'in_review'].includes(item.status));
      case 'approved':
        return publishingItems.filter(item => item.status === 'approved');
      case 'rejected':
        return publishingItems.filter(item => item.status === 'rejected');
      default:
        return publishingItems;
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Publishing Workflow</h1>
          <p className="text-gray-600">Monitor content approval status and publishing pipeline</p>
        </div>
        <Button className="bg-brand-primary hover:bg-brand-primary/90">
          <Send className="h-4 w-4 mr-2" />
          Submit New Content
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-50">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl text-gray-900">
                {publishingItems.filter(item => ['pending_approval', 'in_review'].includes(item.status)).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">In Review</p>
              <p className="text-2xl text-gray-900">
                {publishingItems.filter(item => item.status === 'in_review').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl text-gray-900">
                {publishingItems.filter(item => item.status === 'approved').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-50">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl text-gray-900">
                {publishingItems.filter(item => item.status === 'rejected').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card className="p-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedTab === tab.key
                  ? 'bg-white text-brand-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const statusInfo = statusConfig[item.status as keyof typeof statusConfig];
            const StatusIcon = statusInfo.icon;

            return (
              <div key={item.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                      <Badge className={priorityConfig[item.priority as keyof typeof priorityConfig].color}>
                        {item.priority} priority
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Type:</span>
                        <span className="ml-1 capitalize">{item.type}</span>
                      </div>
                      <div>
                        <span className="font-medium">Submitted:</span>
                        <span className="ml-1">{item.submittedDate}</span>
                      </div>
                      <div>
                        <span className="font-medium">Reviewer:</span>
                        <span className="ml-1">{item.reviewer}</span>
                      </div>
                      {item.estimatedReviewTime && (
                        <div>
                          <span className="font-medium">Est. Review:</span>
                          <span className="ml-1">{item.estimatedReviewTime}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    {item.status === 'rejected' && (
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Revise
                      </Button>
                    )}
                    {item.status === 'approved' && (
                      <Button size="sm" className="bg-brand-primary hover:bg-brand-primary/90">
                        <Zap className="h-4 w-4 mr-2" />
                        Publish
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progress Bar for In-Review Items */}
                {['pending_approval', 'in_review'].includes(item.status) && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Review Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>
                )}

                {/* Rejection Reason */}
                {item.status === 'rejected' && item.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                      <div>
                        <h4 className="font-medium text-red-800 mb-1">Rejection Reason</h4>
                        <p className="text-sm text-red-700">{item.rejectionReason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Approval Details */}
                {item.status === 'approved' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <div>
                          <h4 className="font-medium text-green-800">Approved for Publishing</h4>
                          <p className="text-sm text-green-700">
                            Approved on {item.approvedDate} • Ready to publish
                          </p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Publish Now
                      </Button>
                    </div>
                  </div>
                )}

                {/* Publishing Schedule */}
                {item.publishDate && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <h4 className="font-medium text-blue-800">Scheduled for Publishing</h4>
                        <p className="text-sm text-blue-700">
                          Will be published on {item.publishDate}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Send className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-6">
              {selectedTab === 'pending' 
                ? 'No content is currently pending review'
                : `No ${selectedTab} content found`
              }
            </p>
            <Button className="bg-brand-primary hover:bg-brand-primary/90">
              <Send className="h-4 w-4 mr-2" />
              Submit New Content
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}