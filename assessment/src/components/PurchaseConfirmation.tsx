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
        // Track purchase completion for ClientHub display
        if (window.parent && window.parent.postMessage) {
          window.parent.postMessage({
            type: 'PURCHASE_COMPLETED',
            data: {
              sessionId: assessmentSessionId,
              distributorId,
              clientName,
              productName: product.name,
              productType: product.type,
              purchaseAmount: product.price,
              timestamp: new Date().toISOString()
            }
          }, '*');
        }
        
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
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-8 text-center" style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '32px', textAlign: 'center' }}>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4" style={{ width: '64px', height: '64px', backgroundColor: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <Check className="w-8 h-8 text-green-600" style={{ width: '32px', height: '32px', color: '#059669' }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ color: '#111827', fontSize: '24px', fontWeight: 'bold', lineHeight: '1.5', marginBottom: '8px' }}>
            Purchase Successful!
          </h2>
          <p className="text-gray-600 mb-4" style={{ color: '#4B5563', fontSize: '16px', lineHeight: '1.5', marginBottom: '16px' }}>
            Thank you for your purchase. You will receive confirmation details shortly.
          </p>
          <p className="text-sm text-gray-500" style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.4' }}>
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
        <div className="flex items-center justify-between p-6 border-b" style={{ borderBottom: '1px solid #E5E7EB' }}>
          <h2 className="text-xl font-semibold text-gray-900" style={{ color: '#111827', fontSize: '20px', fontWeight: '600', lineHeight: '1.5' }}>
            Confirm Purchase
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            style={{ color: '#9CA3AF' }}
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
                <h3 className="font-semibold text-gray-900" style={{ color: '#111827', fontSize: '18px', lineHeight: '1.5', marginBottom: '4px' }}>
                  {product?.name || 'MaxPulse Health Supplements'}
                </h3>
                <p className="text-sm text-gray-600 mt-1" style={{ color: '#4B5563', fontSize: '14px', lineHeight: '1.4' }}>
                  {product?.description || 'Premium health supplements for daily wellness'}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-2xl font-bold text-green-600" style={{ color: '#059669', fontSize: '24px', fontWeight: 'bold' }}>
                    ${product?.price?.toFixed(2) || '89.99'}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', fontSize: '12px', padding: '4px 8px', borderRadius: '4px' }}>
                    {product?.type ? product.type.charAt(0).toUpperCase() + product.type.slice(1) : 'Product'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Summary */}
          <div className="border-t pt-4" style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700" style={{ color: '#374151', fontSize: '14px' }}>Subtotal:</span>
              <span className="font-semibold text-gray-900" style={{ color: '#111827', fontWeight: '600', fontSize: '14px' }}>
                ${product?.price?.toFixed(2) || '89.99'}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700" style={{ color: '#374151', fontSize: '14px' }}>Tax:</span>
              <span className="font-semibold text-gray-900" style={{ color: '#111827', fontWeight: '600', fontSize: '14px' }}>$0.00</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2" style={{ borderTop: '1px solid #E5E7EB', paddingTop: '8px', fontSize: '18px', fontWeight: 'bold' }}>
              <span className="text-gray-900" style={{ color: '#111827' }}>Total:</span>
              <span className="text-green-600" style={{ color: '#059669' }}>${product?.price?.toFixed(2) || '89.99'}</span>
            </div>
          </div>


          {/* Disclaimer */}
          <div className="text-xs text-gray-600">
            <p>
              This is a demo purchase. In production, this would integrate with a real payment processor.
              The commission will be tracked in your distributor's dashboard.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{display: 'flex', gap: '12px', padding: '24px', borderTop: '1px solid #e5e7eb'}}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              color: '#374151',
              borderRadius: '8px',
              backgroundColor: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmPurchase}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: loading ? '#9ca3af' : '#16a34a',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Processing...' : 'Confirm Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
};
