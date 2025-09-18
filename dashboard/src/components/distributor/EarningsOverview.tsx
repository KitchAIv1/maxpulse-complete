/**
 * EarningsOverview - Detailed earnings breakdown component
 * Following .cursorrules: UI component <200 lines, single responsibility
 */

import React from 'react';
import { Package, Smartphone, Briefcase, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useCommissions } from '../../hooks/useCommissions';

interface EarningsOverviewProps {
  distributorId: string;
}

export const EarningsOverview: React.FC<EarningsOverviewProps> = ({ distributorId }) => {
  const { 
    commissions, 
    getRecentCommissions, 
    getCommissionsByStatus,
    getCommissionStatsByType 
  } = useCommissions(distributorId);
  

  const recentCommissions = getRecentCommissions(10);
  const paidCommissions = getCommissionsByStatus('paid');
  const pendingCommissions = getCommissionsByStatus('pending');
  const statsByType = getCommissionStatsByType();

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'product': return <Package className="w-4 h-4" />;
      case 'app': return <Smartphone className="w-4 h-4" />;
      case 'package': return <Briefcase className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Earnings by Product Type */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings by Product Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Physical Products</span>
            </div>
            <span className="font-bold text-blue-600">
              ${statsByType.product?.toFixed(2) || '0.00'}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-green-600" />
              <span className="font-medium">App Subscriptions</span>
            </div>
            <span className="font-bold text-green-600">
              ${statsByType.app?.toFixed(2) || '0.00'}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Business Packages</span>
            </div>
            <span className="font-bold text-purple-600">
              ${statsByType.package?.toFixed(2) || '0.00'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Commissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentCommissions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No commissions yet</p>
              <p className="text-sm text-gray-400">
                Commissions will appear here when clients make purchases
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCommissions.map((commission) => (
                <div key={commission.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getProductIcon(commission.productType)}
                    <div>
                      <p className="font-medium text-sm">{commission.productName}</p>
                      <p className="text-xs text-gray-600">
                        {commission.clientName} • {commission.purchaseDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      +${commission.commissionAmount.toFixed(2)}
                    </p>
                    <Badge className={getStatusColor(commission.status)} variant="secondary">
                      {commission.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commission Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Commission Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{paidCommissions.length}</p>
              <p className="text-sm text-green-700">Paid Commissions</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{pendingCommissions.length}</p>
              <p className="text-sm text-yellow-700">Pending Commissions</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{commissions.length}</p>
              <p className="text-sm text-blue-700">Total Commissions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
