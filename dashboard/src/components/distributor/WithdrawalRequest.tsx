/**
 * WithdrawalRequest - Withdrawal request form component
 * Following .cursorrules: UI component <200 lines, single responsibility
 */

import React, { useState } from 'react';
import { X, CreditCard, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useWithdrawals } from '../../hooks/useWithdrawals';
import { CheckPaymentDetails, PayPalPaymentDetails } from '../../services/WithdrawalManager';

interface WithdrawalRequestProps {
  distributorId: string;
  availableBalance: number;
  onClose: () => void;
}

export const WithdrawalRequest: React.FC<WithdrawalRequestProps> = ({
  distributorId,
  availableBalance,
  onClose
}) => {
  const { createWithdrawalRequest, calculateTransactionFee, validateWithdrawalRequest } = useWithdrawals(distributorId);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  const [amount, setAmount] = useState<number>(availableBalance);
  const [method, setMethod] = useState<'check' | 'paypal'>('paypal');
  
  // PayPal details
  const [paypalEmail, setPaypalEmail] = useState('');
  
  // Check details
  const [checkDetails, setCheckDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const transactionFee = calculateTransactionFee(amount);
  const netAmount = amount - transactionFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    const paymentDetails = method === 'paypal' 
      ? { type: 'paypal' as const, email: paypalEmail }
      : { type: 'check' as const, ...checkDetails };

    // Validate request
    const validationErrors = validateWithdrawalRequest(amount, availableBalance, paymentDetails);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const result = await createWithdrawalRequest({
        amount,
        method,
        paymentDetails
      });

      if (result.success) {
        onClose();
      } else {
        setErrors([result.error || 'Failed to create withdrawal request']);
      }
    } catch (error) {
      setErrors(['Failed to create withdrawal request. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Request Withdrawal</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Display */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              {errors.map((error, index) => (
                <p key={index} className="text-red-800 text-sm">{error}</p>
              ))}
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Withdrawal Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max={availableBalance}
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              required
            />
            <p className="text-sm text-gray-600">
              Available balance: ${availableBalance.toFixed(2)}
            </p>
          </div>

          {/* Fee Breakdown */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Withdrawal amount:</span>
              <span>${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Transaction fee (3%):</span>
              <span>-${transactionFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>You will receive:</span>
              <span>${netAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <Label>Payment Method</Label>
            <RadioGroup value={method} onValueChange={(value) => setMethod(value as 'check' | 'paypal')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center space-x-2 cursor-pointer">
                  <Mail className="w-4 h-4" />
                  <span>PayPal</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="check" id="check" />
                <Label htmlFor="check" className="flex items-center space-x-2 cursor-pointer">
                  <CreditCard className="w-4 h-4" />
                  <span>Check (Mail)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* PayPal Details */}
          {method === 'paypal' && (
            <div className="space-y-2">
              <Label htmlFor="paypal-email">PayPal Email</Label>
              <Input
                id="paypal-email"
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                placeholder="your-email@example.com"
                required
              />
            </div>
          )}

          {/* Check Details */}
          {method === 'check' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  value={checkDetails.fullName}
                  onChange={(e) => setCheckDetails(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={checkDetails.address}
                  onChange={(e) => setCheckDetails(prev => ({ ...prev, address: e.target.value }))}
                  rows={2}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={checkDetails.city}
                    onChange={(e) => setCheckDetails(prev => ({ ...prev, city: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={checkDetails.state}
                    onChange={(e) => setCheckDetails(prev => ({ ...prev, state: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={checkDetails.zipCode}
                  onChange={(e) => setCheckDetails(prev => ({ ...prev, zipCode: e.target.value }))}
                  required
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || amount <= 0}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
