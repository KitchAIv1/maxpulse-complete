/**
 * PurchaseConfirmation - Purchase confirmation modal component
 * Following .cursorrules: UI component <200 lines, single responsibility
 */

import React, { useState } from 'react';
import { X, ShoppingCart, Check } from 'lucide-react';
import { PurchaseManager } from '../services/PurchaseManager';

interface Product {
  id: string;
  name: string;
  type: 'product' | 'app' | 'package';
  price: number;
  commissionRate: number;
  description: string;
}

interface PurchaseConfirmationProps {
  product: Product;
  distributorInfo: any;
  clientName: string;
  assessmentSessionId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const PurchaseConfirmation: React.FC<PurchaseConfirmationProps> = ({
  product,
  distributorInfo,
  clientName,
  assessmentSessionId,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchaseManager = new PurchaseManager();

  const handleConfirmPurchase = async () => {
    setLoading(true);
    setError(null);

    try {
      // Ensure consistent distributor ID
      const distributorId = distributorInfo?.distributorId || 'demo-distributor';
      
      const result = purchaseManager.processPurchase({
        productId: product.id,
        productName: product.name,
        productType: product.type,
        price: product.price,
        commissionRate: product.commissionRate,
        distributorId,
        clientName,
        clientEmail: distributorInfo?.customerEmail,
        assessmentSessionId
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(result.error || 'Purchase failed');
      }
    } catch (err) {
      setError('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Successful!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. You will receive confirmation details shortly.
          </p>
          <p className="text-sm text-gray-500">
            Your distributor has been credited with the commission.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Confirm Purchase</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Product Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <ShoppingCart className="w-5 h-5 text-gray-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-2xl font-bold text-green-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">${product.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Tax:</span>
              <span className="font-semibold">$0.00</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-green-600">${product.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Commission Info */}
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your distributor will receive a{' '}
              <strong>{product.commissionRate}%</strong> commission (${((product.price * product.commissionRate) / 100).toFixed(2)}) 
              from this purchase.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-gray-500">
            <p>
              This is a demo purchase. In production, this would integrate with a real payment processor.
              The commission will be tracked in your distributor's dashboard.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmPurchase}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
};
