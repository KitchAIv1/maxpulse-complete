import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Check, 
  DollarSign, 
  User, 
  Package, 
  Calendar,
  Mail,
  Hash
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface Commission {
  id: string;
  distributorId: string;
  productName: string;
  productType: string;
  amount: number;
  commissionRate: number;
  clientName: string;
  clientEmail?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  createdAt: string;
  purchaseId: string;
  assessmentSessionId: string;
}

interface CommissionApprovalModalProps {
  commission: Commission;
  onClose: () => void;
  onApprove: (commissionId: string) => Promise<void>;
}

/**
 * Modal for detailed commission review and approval
 * Single-responsibility: Display commission details and handle approval
 */
export function CommissionApprovalModal({ 
  commission, 
  onClose, 
  onApprove 
}: CommissionApprovalModalProps) {
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await onApprove(commission.id);
      onClose();
    } catch (error) {
      console.error('Error approving commission:', error);
    } finally {
      setIsApproving(false);
    }
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Commission Review</h2>
            <p className="text-sm text-gray-600">Review commission details before approval</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className="bg-orange-50 text-orange-700 border-orange-200"
            >
              {commission.status.toUpperCase()}
            </Badge>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(commission.amount)}
              </div>
              <div className="text-sm text-gray-600">
                Commission Amount
              </div>
            </div>
          </div>

          {/* Commission Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Distributor Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Distributor Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-600">Distributor ID</label>
                  <div className="font-medium">{commission.distributorId}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Commission Rate</label>
                  <div className="font-medium">{commission.commissionRate}%</div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Product Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-600">Product Name</label>
                  <div className="font-medium">{commission.productName}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Product Type</label>
                  <div className="font-medium capitalize">{commission.productType}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Client Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Client Name</label>
                  <div className="font-medium">{commission.clientName}</div>
                </div>
                {commission.clientEmail && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Client Email</label>
                    <div className="font-medium">{commission.clientEmail}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Hash className="w-4 h-4 mr-2" />
              Transaction Details
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Purchase ID</label>
                  <div className="font-mono text-sm">{commission.purchaseId}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Assessment Session</label>
                  <div className="font-mono text-sm">{commission.assessmentSessionId}</div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Purchase Date
                </label>
                <div className="font-medium">{formatDate(commission.createdAt)}</div>
              </div>
            </div>
          </div>

          {/* Commission Calculation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Commission Calculation
            </h3>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Commission Rate:</span>
                <span className="font-medium">{commission.commissionRate}%</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-green-200">
                <span className="font-semibold text-gray-900">Total Commission:</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(commission.amount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isApproving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isApproving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isApproving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Approving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Approve Commission
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
