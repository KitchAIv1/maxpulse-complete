import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MessageCircle, 
  Star,
  Clock,
  CheckCircle,
  TrendingUp,
  Eye,
  Edit
} from 'lucide-react';

export function ClientManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Client data now comes from real assessment tracking and commission data
  // This component should integrate with ClientHub data or be deprecated
  const clients: any[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-yellow-100 text-yellow-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Star className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || client.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: clients.length,
    lead: clients.filter(c => c.status === 'lead').length,
    prospect: clients.filter(c => c.status === 'prospect').length,
    customer: clients.filter(c => c.status === 'customer').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-gray-900">Client Management</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Add New Client
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Total Leads</p>
              <p className="text-2xl text-gray-900">{statusCounts.lead}</p>
            </div>
            <Star className="h-8 w-8 text-brand-secondary" />
          </div>
        </Card>

        <Card className="p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Active Prospects</p>
              <p className="text-2xl text-gray-900">{statusCounts.prospect}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-brand-primary" />
          </div>
        </Card>

        <Card className="p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Paying Customers</p>
              <p className="text-2xl text-gray-900">{statusCounts.customer}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Monthly Revenue</p>
              <p className="text-2xl text-gray-900">$342</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search clients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
              <TabsList>
                <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
                <TabsTrigger value="lead">Leads ({statusCounts.lead})</TabsTrigger>
                <TabsTrigger value="prospect">Prospects ({statusCounts.prospect})</TabsTrigger>
                <TabsTrigger value="customer">Customers ({statusCounts.customer})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Client List */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assessment Scores</TableHead>
                <TableHead>Interests</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        {getPriorityIcon(client.priority)}
                      </div>
                      <div>
                        <div className="text-sm">{client.name}</div>
                        <div className="text-xs text-gray-600">{client.email}</div>
                        <div className="text-xs text-gray-500">{client.phone}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                    {client.subscription && (
                      <div className="text-xs text-gray-600 mt-1">{client.subscription}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-600 w-16">Health:</span>
                        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {client.assessmentScore.health}%
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-600 w-16">Business:</span>
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {client.assessmentScore.business}%
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {client.interests.map((interest, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {new Date(client.lastContact).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">via {client.source}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      ${client.value}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
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