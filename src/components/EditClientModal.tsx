import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building2, Tag, Save, AlertCircle } from 'lucide-react';
import { clientService, UpdateClientData } from '../services/clientService';
import { Client } from '../lib/supabase';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientUpdated: () => void;
  client: Client | null;
}

const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, onClose, onClientUpdated, client }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead' as 'lead' | 'active' | 'inactive' | 'lost',
    tags: '',
    customFields: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  // Populate form when client changes
  useEffect(() => {
    if (client) {
      // Convert custom object back to user-friendly string
      let customFieldsText = '';
      if (client.custom && typeof client.custom === 'object') {
        const entries = Object.entries(client.custom);
        customFieldsText = entries
          .filter(([key, value]) => key !== 'notes' && key !== 'created_by' && key !== 'created_at' && key !== 'updated_by' && key !== 'updated_at')
          .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
          .join(', ');
      }
      
      setFormData({
        full_name: client.full_name || '',
        email: client.email || '',
        phone: client.phone || '',
        company: client.company || '',
        status: client.status,
        tags: client.tags.join(', '),
        customFields: customFieldsText
      });
    }
  }, [client]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    
    setLoading(true);
    setErrors([]);

    try {
      // Validate required fields
      if (!formData.full_name.trim()) {
        setErrors(['Full name is required']);
        setLoading(false);
        return;
      }

      // Parse tags
      const tags = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      // Parse custom fields
      let custom = {};
      if (formData.customFields.trim()) {
        try {
          // Parse key-value pairs from text input
          const pairs = formData.customFields.split(',').map(pair => pair.trim());
          pairs.forEach(pair => {
            const [key, value] = pair.split(':').map(item => item.trim());
            if (key && value) {
              // Try to parse numbers
              const numValue = Number(value);
              custom[key.toLowerCase().replace(/\s+/g, '_')] = isNaN(numValue) ? value : numValue;
            }
          });
        } catch (error) {
          console.error('Error parsing custom fields:', error);
          // If parsing fails, store as simple text
          custom = { notes: formData.customFields.trim() };
        }
      }

      const updateData: UpdateClientData = {
        id: client.id,
        full_name: formData.full_name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        company: formData.company.trim() || undefined,
        status: formData.status,
        tags,
        custom
      };

      await clientService.updateClient(updateData);
      
      setSuccess(true);
      setTimeout(() => {
        onClientUpdated();
        onClose();
        resetForm();
      }, 1500);
    } catch (error: any) {
      console.error('Failed to update client:', error);
      if (error.message?.includes('duplicate key')) {
        if (error.message.includes('email')) {
          setErrors(['Email address already exists']);
        } else if (error.message.includes('phone')) {
          setErrors(['Phone number already exists']);
        } else {
          setErrors(['Client with this information already exists']);
        }
      } else {
        setErrors(['Failed to update client. Please try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      company: '',
      status: 'lead',
      tags: '',
      customFields: ''
    });
    setErrors([]);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">EDIT ELITE CLIENT</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-xl">
            <p className="text-green-400 font-semibold">✅ Elite client updated successfully!</p>
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white placeholder-gray-500"
                placeholder="Enter full name..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white placeholder-gray-500"
                placeholder="Enter email address..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white placeholder-gray-500"
                placeholder="Enter phone number..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Building2 className="w-4 h-4 inline mr-2" />
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white placeholder-gray-500"
                placeholder="Enter company name..."
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white"
            >
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white placeholder-gray-500"
              placeholder="Enter tags separated by commas..."
            />
            <p className="text-xs text-gray-400 mt-1">Separate multiple tags with commas</p>
          </div>

          {/* Custom Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Custom Fields</label>
            <input
              type="text"
              name="customFields"
              value={formData.customFields}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-red-500/30 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-black/30 text-white placeholder-gray-500"
              placeholder="Industry: Technology, Budget: 50000, Source: Website"
            />
            <p className="text-xs text-gray-400 mt-1">Format: Key: Value, Key: Value (e.g., Industry: Tech, Budget: 50000)</p>
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
                  UPDATING...
                </>
              ) : (
                <>
                  <Save size={16} />
                  UPDATE CLIENT
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientModal;