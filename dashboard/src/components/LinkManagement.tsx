import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Plus, 
  Copy, 
  Share2, 
  QrCode, 
  BarChart3, 
  Edit, 
  Trash2,
  ExternalLink,
  Eye,
  Calendar
} from 'lucide-react';

export function LinkManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLinkName, setNewLinkName] = useState('');

  const links = [
    {
      id: 1,
      name: 'Social Media Campaign',
      url: 'maxpulse.com/assess/SJ2024-001',
      shortUrl: 'max.link/sm001',
      created: '2024-08-15',
      clicks: 347,
      assessments: 156,
      conversions: 19,
      conversionRate: 12.2,
      status: 'active',
      source: 'Facebook, Instagram'
    },
    {
      id: 2,
      name: 'Email Signature',
      url: 'maxpulse.com/assess/SJ2024-002',
      shortUrl: 'max.link/em002',
      created: '2024-08-10',
      clicks: 89,
      assessments: 67,
      conversions: 8,
      conversionRate: 11.9,
      status: 'active',
      source: 'Email'
    },
    {
      id: 3,
      name: 'Networking Events',
      url: 'maxpulse.com/assess/SJ2024-003',
      shortUrl: 'max.link/nw003',
      created: '2024-08-05',
      clicks: 234,
      assessments: 198,
      conversions: 31,
      conversionRate: 15.7,
      status: 'active',
      source: 'QR Code'
    },
    {
      id: 4,
      name: 'Website Banner',
      url: 'maxpulse.com/assess/SJ2024-004',
      shortUrl: 'max.link/wb004',
      created: '2024-07-28',
      clicks: 156,
      assessments: 98,
      conversions: 12,
      conversionRate: 12.2,
      status: 'paused',
      source: 'Website'
    }
  ];

  const handleCreateLink = () => {
    // In real implementation, this would make an API call
    console.log('Creating new link:', newLinkName);
    setNewLinkName('');
    setShowCreateForm(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In real implementation, show a toast notification
  };

  const totalStats = {
    totalClicks: links.reduce((sum, link) => sum + link.clicks, 0),
    totalAssessments: links.reduce((sum, link) => sum + link.assessments, 0),
    totalConversions: links.reduce((sum, link) => sum + link.conversions, 0),
    avgConversionRate: links.reduce((sum, link) => sum + link.conversionRate, 0) / links.length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-gray-900">Link Management</h1>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Link
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clicks</p>
              <p className="text-2xl">{totalStats.totalClicks.toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Assessments</p>
              <p className="text-2xl">{totalStats.totalAssessments.toLocaleString()}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversions</p>
              <p className="text-2xl">{totalStats.totalConversions}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Conversion</p>
              <p className="text-2xl">{totalStats.avgConversionRate.toFixed(1)}%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Create New Link Form */}
      {showCreateForm && (
        <Card className="p-6">
          <h3 className="text-lg mb-4">Create New Assessment Link</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="linkName">Campaign Name</Label>
              <Input
                id="linkName"
                placeholder="e.g., LinkedIn Campaign"
                value={newLinkName}
                onChange={(e) => setNewLinkName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="linkSource">Traffic Source</Label>
              <Input
                id="linkSource"
                placeholder="e.g., LinkedIn, Twitter, Email"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleCreateLink} disabled={!newLinkName}>
              Create Link
            </Button>
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Links Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg">Your Assessment Links</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Link & QR</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Conversion</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <div>
                      <div className="text-sm">{link.name}</div>
                      <div className="text-xs text-gray-600">Created: {link.created}</div>
                      <div className="text-xs text-gray-500">Source: {link.source}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {link.shortUrl}
                        </code>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(link.shortUrl)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <QrCode className="h-4 w-4 mr-1" />
                          QR
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="text-gray-600">Clicks:</span> {link.clicks}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Assessments:</span> {link.assessments}
                      </div>
                      <div className="text-xs text-gray-500">
                        CTR: {((link.assessments / link.clicks) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="text-lg text-green-600">{link.conversions}</div>
                      <div className="text-sm text-gray-600">{link.conversionRate}%</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        link.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {link.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}