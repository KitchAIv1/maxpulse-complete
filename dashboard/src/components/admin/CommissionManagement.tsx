import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Users, 
  AlertCircle,
  Eye,
  Check,
  X
} from 'lucide-react';
import { useCommissionApproval } from '../../hooks/useCommissionApproval';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { CommissionApprovalModal } from './CommissionApprovalModal';

/**
 * Admin component for managing commission approvals
 * Displays pending commissions and allows bulk/individual approval
 */
export function CommissionManagement() {
  const {
    pendingCommissions,
    approvedCommissions,
    summary,
    loading,
    error,
    approveCommission,
    bulkApproveCommissions,
    refreshData
  } = useCommissionApproval();

  const [selectedCommissions, setSelectedCommissions] = useState<string[]>([]);
  const [viewCommission, setViewCommission] = useState<any>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCommissions(pendingCommissions.map(c => c.id));
    } else {
      setSelectedCommissions([]);
    }
  };

  const handleSelectCommission = (commissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedCommissions(prev => [...prev, commissionId]);
    } else {
      setSelectedCommissions(prev => prev.filter(id => id !== commissionId));
    }
  };

  const handleApproveCommission = async (commissionId: string) => {
    setProcessingId(commissionId);
    await approveCommission(commissionId);
    setProcessingId(null);
  };

  const handleBulkApprove = async () => {
    if (selectedCommissions.length === 0) return;
    
    await bulkApproveCommissions(selectedCommissions);
    setSelectedCommissions([]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && pendingCommissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading commissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Commission Management</h2>
          <p className="text-gray-600">Review and approve distributor commissions</p>
        </div>
        <Button onClick={refreshData} variant="outline">
          Refresh Data
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Commissions</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalPending}</div>
            <p className="text-xs text-gray-600">
              {formatCurrency(summary.totalPendingAmount)} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Commissions</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalApproved}</div>
            <p className="text-xs text-gray-600">
              {formatCurrency(summary.totalApprovedAmount)} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalPendingAmount + summary.totalApprovedAmount)}
            </div>
            <p className="text-xs text-gray-600">All commissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distributors</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set([...pendingCommissions, ...approvedCommissions].map(c => c.distributorId)).size}
            </div>
            <p className="text-xs text-gray-600">Active distributors</p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {pendingCommissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bulk Actions</CardTitle>
            <CardDescription>
              Select multiple commissions for batch processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedCommissions.length === pendingCommissions.length}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Select All ({pendingCommissions.length})
                </label>
              </div>
              
              {selectedCommissions.length > 0 && (
                <Button 
                  onClick={handleBulkApprove}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve Selected ({selectedCommissions.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Commissions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pending Commissions</CardTitle>
          <CardDescription>
            Commissions awaiting admin approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingCommissions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending commissions to review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Select</th>
                    <th className="text-left py-3 px-2">Distributor</th>
                    <th className="text-left py-3 px-2">Product</th>
                    <th className="text-left py-3 px-2">Client</th>
                    <th className="text-left py-3 px-2">Amount</th>
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingCommissions.map((commission) => (
                    <motion.tr
                      key={commission.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-2">
                        <Checkbox
                          checked={selectedCommissions.includes(commission.id)}
                          onCheckedChange={(checked) => 
                            handleSelectCommission(commission.id, checked as boolean)
                          }
                        />
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-medium">{commission.distributorId}</div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-medium">{commission.productName}</div>
                        <div className="text-sm text-gray-600">{commission.productType}</div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-medium">{commission.clientName}</div>
                        {commission.clientEmail && (
                          <div className="text-sm text-gray-600">{commission.clientEmail}</div>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-bold text-green-600">
                          {formatCurrency(commission.amount)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {commission.commissionRate}% rate
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-sm">{formatDate(commission.createdAt)}</div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewCommission(commission)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproveCommission(commission.id)}
                            disabled={processingId === commission.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {processingId === commission.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commission Detail Modal */}
      {viewCommission && (
        <CommissionApprovalModal
          commission={viewCommission}
          onClose={() => setViewCommission(null)}
          onApprove={handleApproveCommission}
        />
      )}
    </div>
  );
}
