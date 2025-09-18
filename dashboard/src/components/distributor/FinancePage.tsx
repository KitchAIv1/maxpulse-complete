/**
 * FinancePage - Distributor finance dashboard with earnings and withdrawals
 * Following .cursorrules: UI component <200 lines, single responsibility
 */

import React, { useState } from 'react';
import { DollarSign, TrendingUp, Clock, CheckCircle, Plus, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useCommissions } from '../../hooks/useCommissions';
import { useWithdrawals } from '../../hooks/useWithdrawals';
import { EarningsOverview } from './EarningsOverview';
import { WithdrawalRequest } from './WithdrawalRequest';

interface FinancePageProps {
  distributorId: string;
}

export const FinancePage: React.FC<FinancePageProps> = ({ distributorId }) => {
  const { summary: commissionSummary, loading: commissionsLoading } = useCommissions(distributorId);
  const { withdrawals, summary: withdrawalSummary, loading: withdrawalsLoading } = useWithdrawals(distributorId);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);

  const loading = commissionsLoading || withdrawalsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const availableBalance = commissionSummary?.availableBalance || 0;
  const canWithdraw = availableBalance > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
          <p className="text-gray-600">Track your earnings and manage withdrawals</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={() => setShowWithdrawalForm(true)}
            disabled={!canWithdraw}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Request Withdrawal
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${availableBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${commissionSummary?.totalEarned.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              All-time earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${commissionSummary?.totalPending.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${withdrawalSummary?.totalPaid.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully withdrawn
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Overview */}
      <EarningsOverview distributorId={distributorId} />

      {/* Recent Withdrawals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No withdrawal requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawals.slice(0, 5).map((withdrawal) => (
                <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">${withdrawal.amount.toFixed(2)}</span>
                      <Badge 
                        variant={
                          withdrawal.status === 'paid' ? 'default' :
                          withdrawal.status === 'approved' ? 'secondary' :
                          withdrawal.status === 'rejected' ? 'destructive' : 'outline'
                        }
                      >
                        {withdrawal.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {withdrawal.method === 'check' ? 'Check' : 'PayPal'} • 
                      {withdrawal.requestDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${withdrawal.netAmount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      Fee: ${withdrawal.transactionFee.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal Request Modal */}
      {showWithdrawalForm && (
        <WithdrawalRequest
          distributorId={distributorId}
          availableBalance={availableBalance}
          onClose={() => setShowWithdrawalForm(false)}
        />
      )}
    </div>
  );
};
