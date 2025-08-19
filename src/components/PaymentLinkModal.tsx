import React, { useState } from 'react';
import { X, Link, Save, AlertCircle, Package } from 'lucide-react';
import { stripeService, PaymentLink } from '../services/stripeService';

interface PaymentLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentLinkAdded: () => void;
}

const PaymentLinkModal: React.FC<PaymentLinkModalProps> = ({ isOpen, onClose, onPaymentLinkAdded }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    url: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-generate ID from name
    if (name === 'name') {
      const id = value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, id }));
    }
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('stripe.com') && urlObj.pathname.includes('/');
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      // Validate required fields
      const validationErrors: string[] = [];
      
      if (!formData.name.trim()) {
        validationErrors.push('Payment link name is required');
      }
      
      if (!formData.url.trim()) {
        validationErrors.push('Payment link URL is required');
      } else if (!validateUrl(formData.url)) {
        validationErrors.push('Please enter a valid Stripe payment link URL');
      }
      
      if (!formData.id.trim()) {
        validationErrors.push('Payment link ID is required');
      }

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      // Test the payment link by trying to fetch transactions
      try {
        await stripeService.getTransactionsByUrl(formData.url.trim());
      } catch (error) {
        setErrors(['Unable to connect to this payment link. Please verify the URL is correct.']);
        setLoading(false);
        return;
      }

      const paymentLink: PaymentLink = {
        id: formData.id.trim(),
        name: formData.name.trim(),
        url: formData.url.trim(),
        description: formData.description.trim() || undefined
      };

      stripeService.addPaymentLink(paymentLink);
      
      setSuccess(true);
      setTimeout(() => {
        onPaymentLinkAdded();
        onClose();
        resetForm();
      }, 1500);
    } catch (error: any) {
      console.error('Failed to add payment link:', error);
      setErrors(['Failed to add payment link. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      url: '',
      description: ''
    });
    setErrors([]);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">ADD PAYMENT LINK</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-xl">
            <p className="text-green-400 font-semibold">✅ Payment link added successfully!</p>
          </div>
        )}

        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-semibold">Please fix the following errors:</span>
            </div>
            <ul className="list-disc list-inside text-red-300 text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Link Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Package className="w-4 h-4 inline mr-2" />
              Payment Link Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white placeholder-gray-500"
              placeholder="e.g., Elite Transformation Program"
              required
            />
          </div>

          {/* Payment Link URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Link className="w-4 h-4 inline mr-2" />
              Stripe Payment Link URL *
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white placeholder-gray-500"
              placeholder="https://buy.stripe.com/..."
              required
            />
            <p className="text-xs text-gray-400 mt-1">Copy the payment link URL from your Stripe dashboard</p>
          </div>

          {/* Auto-generated ID */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Payment Link ID (Auto-generated)
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white placeholder-gray-500"
              placeholder="auto-generated-from-name"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Unique identifier for this payment link</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white placeholder-gray-500 resize-none"
              placeholder="Optional description for this payment link..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors text-gray-300 hover:text-white font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  TESTING...
                </>
              ) : (
                <>
                  <Save size={16} />
                  ADD PAYMENT LINK
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentLinkModal;