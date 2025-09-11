import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  Mail,
  Phone,
  MoreHorizontal,
  UserPlus,
  Download,
  TrendingUp,
  Star,
  Award,
  Calendar as CalendarIcon,
  X
} from 'lucide-react';

interface AdminDistributorsProps {
  user: any;
}

export function AdminDistributors({ user }: AdminDistributorsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  });
  const [dateFilterType, setDateFilterType] = useState('joinDate'); // joinDate, lastLogin

  const topDistributors = [
    { 
      id: 1, 
      name: 'Sarah Johnson', 
      email: 'sarah.j@email.com',
      level: 'Platinum', 
      revenue: 8900, 
      assessments: 234, 
      conversionRate: 15.2,
      joinDate: '2024-01-15',
      status: 'active',
      clients: 45,
      lastLogin: '2024-12-18'
    },
    { 
      id: 2, 
      name: 'Michael Chen', 
      email: 'michael.c@email.com',
      level: 'Gold', 
      revenue: 6700, 
      assessments: 189, 
      conversionRate: 13.8,
      joinDate: '2024-02-20',
      status: 'active',
      clients: 32,
      lastLogin: '2024-12-17'
    },
    { 
      id: 3, 
      name: 'Lisa Rodriguez', 
      email: 'lisa.r@email.com',
      level: 'Gold', 
      revenue: 5400, 
      assessments: 156, 
      conversionRate: 12.9,
      joinDate: '2024-03-10',
      status: 'active',
      clients: 28,
      lastLogin: '2024-12-18'
    },
    { 
      id: 4, 
      name: 'David Park', 
      email: 'david.p@email.com',
      level: 'Silver', 
      revenue: 4200, 
      assessments: 134, 
      conversionRate: 11.7,
      joinDate: '2024-03-25',
      status: 'active',
      clients: 19,
      lastLogin: '2024-12-16'
    },
    { 
      id: 5, 
      name: 'Emma Wilson', 
      email: 'emma.w@email.com',
      level: 'Silver', 
      revenue: 3800, 
      assessments: 128, 
      conversionRate: 10.9,
      joinDate: '2024-04-12',
      status: 'inactive',
      clients: 15,
      lastLogin: '2024-12-10'
    },
    { 
      id: 6, 
      name: 'James Thompson', 
      email: 'james.t@email.com',
      level: 'Bronze', 
      revenue: 2400, 
      assessments: 89, 
      conversionRate: 9.2,
      joinDate: '2024-05-08',
      status: 'active',
      clients: 12,
      lastLogin: '2024-12-18'
    },
    { 
      id: 7, 
      name: 'Maria Garcia', 
      email: 'maria.g@email.com',
      level: 'Bronze', 
      revenue: 1900, 
      assessments: 67, 
      conversionRate: 8.5,
      joinDate: '2024-06-14',
      status: 'pending',
      clients: 8,
      lastLogin: '2024-12-15'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Platinum': return 'bg-purple-100 text-purple-800';
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      case 'Bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get date based on filter type
  const getFilterDate = (distributor: any) => {
    return dateFilterType === 'joinDate' ? new Date(distributor.joinDate) : new Date(distributor.lastLogin);
  };

  // Helper function to check if date is within range
  const isDateInRange = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateFilter) {
      case 'today':
        return date >= today;
      case '7days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return date >= sevenDaysAgo;
      case '30days':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return date >= thirtyDaysAgo;
      case '90days':
        const ninetyDaysAgo = new Date(today);
        ninetyDaysAgo.setDate(today.getDate() - 90);
        return date >= ninetyDaysAgo;
      case '1year':
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        return date >= oneYearAgo;
      case 'custom':
        if (!customDateRange.from && !customDateRange.to) return true;
        if (customDateRange.from && customDateRange.to) {
          return date >= customDateRange.from && date <= customDateRange.to;
        }
        if (customDateRange.from) {
          return date >= customDateRange.from;
        }
        if (customDateRange.to) {
          return date <= customDateRange.to;
        }
        return true;
      default:
        return true;
    }
  };

  const filteredDistributors = topDistributors.filter(distributor => {
    const matchesSearch = distributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         distributor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || distributor.level.toLowerCase() === filterLevel;
    const matchesStatus = filterStatus === 'all' || distributor.status === filterStatus;
    const matchesDate = dateFilter === 'all' || isDateInRange(getFilterDate(distributor));
    
    return matchesSearch && matchesLevel && matchesStatus && matchesDate;
  });

  const levelCounts = {
    all: topDistributors.length,
    platinum: topDistributors.filter(d => d.level === 'Platinum').length,
    gold: topDistributors.filter(d => d.level === 'Gold').length,
    silver: topDistributors.filter(d => d.level === 'Silver').length,
    bronze: topDistributors.filter(d => d.level === 'Bronze').length
  };

  const statusCounts = {
    all: topDistributors.length,
    active: topDistributors.filter(d => d.status === 'active').length,
    inactive: topDistributors.filter(d => d.status === 'inactive').length,
    pending: topDistributors.filter(d => d.status === 'pending').length
  };

  const clearDateFilter = () => {
    setDateFilter('all');
    setCustomDateRange({ from: undefined, to: undefined });
  };

  const formatDateRange = () => {
    if (dateFilter === 'custom' && (customDateRange.from || customDateRange.to)) {
      const fromStr = customDateRange.from ? customDateRange.from.toLocaleDateString() : 'Start';
      const toStr = customDateRange.to ? customDateRange.to.toLocaleDateString() : 'End';
      return `${fromStr} - ${toStr}`;
    }
    return null;
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl text-gray-900">Distributor Management</h1>
          <p className="text-sm lg:text-base text-gray-600">Manage and monitor distributor performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm" className="bg-brand-primary hover:bg-brand-primary/90">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Distributor
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Total Distributors</p>
              <p className="text-2xl text-gray-900">{filteredDistributors.length}</p>
              {filteredDistributors.length !== topDistributors.length && (
                <p className="text-xs text-gray-500">of {topDistributors.length} total</p>
              )}
            </div>
            <Users className="h-8 w-8 text-brand-primary" />
          </div>
        </Card>

        <Card className="p-4 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Active</p>
              <p className="text-2xl text-gray-900">
                {filteredDistributors.filter(d => d.status === 'active').length}
              </p>
              {filteredDistributors.length !== topDistributors.length && (
                <p className="text-xs text-gray-500">of {statusCounts.active} total</p>
              )}
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Top Performers</p>
              <p className="text-2xl text-gray-900">
                {filteredDistributors.filter(d => d.level === 'Platinum' || d.level === 'Gold').length}
              </p>
              {filteredDistributors.length !== topDistributors.length && (
                <p className="text-xs text-gray-500">of {levelCounts.platinum + levelCounts.gold} total</p>
              )}
            </div>
            <Star className="h-8 w-8 text-brand-secondary" />
          </div>
        </Card>

        <Card className="p-4 glass-card-brand glass-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Pending Approval</p>
              <p className="text-2xl text-gray-900">
                {filteredDistributors.filter(d => d.status === 'pending').length}
              </p>
              {filteredDistributors.length !== topDistributors.length && (
                <p className="text-xs text-gray-500">of {statusCounts.pending} total</p>
              )}
            </div>
            <Award className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search distributors by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels ({levelCounts.all})</SelectItem>
                <SelectItem value="platinum">Platinum ({levelCounts.platinum})</SelectItem>
                <SelectItem value="gold">Gold ({levelCounts.gold})</SelectItem>
                <SelectItem value="silver">Silver ({levelCounts.silver})</SelectItem>
                <SelectItem value="bronze">Bronze ({levelCounts.bronze})</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
                <SelectItem value="active">Active ({statusCounts.active})</SelectItem>
                <SelectItem value="inactive">Inactive ({statusCounts.inactive})</SelectItem>
                <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Filtering Section */}
        <div className="border-t pt-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by Date:</span>
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <Select value={dateFilterType} onValueChange={setDateFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joinDate">Join Date</SelectItem>
                  <SelectItem value="lastLogin">Last Login</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              {dateFilter === 'custom' && (
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {formatDateRange() || 'Select dates'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">From Date</label>
                          <Calendar
                            mode="single"
                            selected={customDateRange.from}
                            onSelect={(date) => setCustomDateRange(prev => ({ ...prev, from: date }))}
                            disabled={(date) => date > new Date() || (customDateRange.to ? date > customDateRange.to : false)}
                            initialFocus
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">To Date</label>
                          <Calendar
                            mode="single"
                            selected={customDateRange.to}
                            onSelect={(date) => setCustomDateRange(prev => ({ ...prev, to: date }))}
                            disabled={(date) => date > new Date() || (customDateRange.from ? date < customDateRange.from : false)}
                          />
                        </div>
                        <div className="flex justify-between pt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setCustomDateRange({ from: undefined, to: undefined })}
                          >
                            Clear
                          </Button>
                          <Button size="sm" onClick={() => setDateFilter('custom')}>
                            Apply
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {(dateFilter !== 'all' || (customDateRange.from || customDateRange.to)) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearDateFilter}
                  className="h-9"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active filters display */}
          {(dateFilter !== 'all' || (customDateRange.from || customDateRange.to)) && (
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Active date filter:</span>
                <Badge variant="secondary" className="text-xs">
                  {dateFilterType === 'joinDate' ? 'Join Date' : 'Last Login'}: {
                    dateFilter === 'custom' 
                      ? formatDateRange() || 'Custom range'
                      : dateFilter === 'today' ? 'Today'
                      : dateFilter === '7days' ? 'Last 7 days'
                      : dateFilter === '30days' ? 'Last 30 days'
                      : dateFilter === '90days' ? 'Last 90 days'
                      : dateFilter === '1year' ? 'Last year'
                      : dateFilter
                  }
                </Badge>
              </div>
              {filteredDistributors.length !== topDistributors.length && (
                <span className="text-xs text-brand-primary">
                  {filteredDistributors.length} of {topDistributors.length} distributors match
                </span>
              )}
            </div>
          )}
        </div>

        {/* No results message */}
        {filteredDistributors.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">No distributors found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or date filters.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setFilterLevel('all');
                setFilterStatus('all');
                clearDateFilter();
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4">
          {filteredDistributors.map((distributor) => (
            <Card key={distributor.id} className="p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-sm">{distributor.name}</h4>
                  <p className="text-xs text-gray-600">{distributor.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={getLevelColor(distributor.level)} variant="secondary">
                    {distributor.level}
                  </Badge>
                  <Badge className={getStatusColor(distributor.status)} variant="secondary">
                    {distributor.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <span className="text-gray-600">Revenue:</span>
                  <span className="ml-1 font-medium">${distributor.revenue.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Assessments:</span>
                  <span className="ml-1 font-medium">{distributor.assessments}</span>
                </div>
                <div>
                  <span className="text-gray-600">Clients:</span>
                  <span className="ml-1 font-medium">{distributor.clients}</span>
                </div>
                <div>
                  <span className="text-gray-600">Conv. Rate:</span>
                  <span className="ml-1 font-medium">{distributor.conversionRate}%</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-2 space-y-1">
                <div>Joined: {new Date(distributor.joinDate).toLocaleDateString()}</div>
                <div>Last login: {new Date(distributor.lastLogin).toLocaleDateString()}</div>
              </div>
              <div className="flex justify-end items-center">
                <div className="flex space-x-1">
                  <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredDistributors.length} of {topDistributors.length} distributors
          {dateFilter !== 'all' && (
            <span className="ml-2 text-brand-primary">
              (filtered by {dateFilterType === 'joinDate' ? 'join date' : 'last login'})
            </span>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Distributor</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Monthly Revenue</TableHead>
                <TableHead>Assessments</TableHead>
                <TableHead>Clients</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDistributors.map((distributor) => (
                <TableRow key={distributor.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{distributor.name}</div>
                      <div className="text-xs text-gray-600">{distributor.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getLevelColor(distributor.level)} variant="secondary">
                      {distributor.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(distributor.status)} variant="secondary">
                      {distributor.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">${distributor.revenue.toLocaleString()}</TableCell>
                  <TableCell>{distributor.assessments}</TableCell>
                  <TableCell>{distributor.clients}</TableCell>
                  <TableCell>{distributor.conversionRate}%</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(distributor.joinDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(distributor.lastLogin).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="h-4 w-4" />
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