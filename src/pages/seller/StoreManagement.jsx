import React, { useState } from 'react';
import { Save, Upload, MapPin, Clock, Phone, Mail } from 'lucide-react';
import Card from '../../components/seller/Card';
import Button from '../../components/seller/Button';
import { useForm } from '../../hooks/seller/useForm';
import toast from 'react-hot-toast';

const StoreManagement = () => {
  const [loading, setLoading] = useState(false);

  const validationRules = {
    name: (value) => !value ? 'Store name is required' : null,
    email: (value) => {
      if (!value) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';
      return null;
    },
    phone: (value) => !value ? 'Phone number is required' : null,
  };

  const { values, errors, handleChange, handleSubmit, setFieldValue } = useForm({
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    businessHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: true },
    },
    currency: 'LKR',
    taxRate: 0,
    shippingEnabled: true,
    returnPolicy: '30-day return policy. Items must be in original condition.',
  }, validationRules);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Store settings updated successfully');
    } catch (error) {
      toast.error('Failed to update store settings');
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessHours = (day, field, value) => {
    setFieldValue('businessHours', {
      ...values.businessHours,
      [day]: { ...values.businessHours[day], [field]: value },
    });
  };

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Store Management</h1>
          <p className="text-gray-600">Manage your store settings and information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name *</label>
                <input type="text" name="name" value={values.name} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="email" name="email" value={values.email} onChange={handleChange} className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'}`} />
                </div>
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="tel" name="phone" value={values.phone} onChange={handleChange} className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-300' : 'border-gray-300'}`} />
                </div>
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={values.description} onChange={handleChange} rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center"><MapPin className="w-5 h-5 mr-2" />Address</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input type="text" name="address" value={values.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" name="city" value={values.city} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" name="state" value={values.state} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input type="text" name="zipCode" value={values.zipCode} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input type="text" name="country" value={values.country} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center"><Clock className="w-5 h-5 mr-2" />Business Hours</h3>
          <div className="space-y-4">
            {days.map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-4">
                <div className="w-24"><span className="text-sm font-medium text-gray-700">{label}</span></div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={!values.businessHours[key].closed} onChange={(e) => updateBusinessHours(key, 'closed', !e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-600">Open</span>
                </div>
                {!values.businessHours[key].closed && (
                  <div className="flex items-center space-x-2">
                    <input type="time" value={values.businessHours[key].open} onChange={(e) => updateBusinessHours(key, 'open', e.target.value)} className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    <span className="text-gray-500">to</span>
                    <input type="time" value={values.businessHours[key].close} onChange={(e) => updateBusinessHours(key, 'close', e.target.value)} className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-6">Store Settings</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select name="currency" value={values.currency} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="LKR">LKR - Sri Lankan Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                <input type="number" name="taxRate" value={values.taxRate} onChange={handleChange} step="0.1" min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="flex items-center">
                <input type="checkbox" name="shippingEnabled" checked={values.shippingEnabled} onChange={handleChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label className="ml-2 text-sm text-gray-700">Enable shipping</label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Policy</label>
              <textarea name="returnPolicy" value={values.returnPolicy} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={loading}><Save className="w-4 h-4 mr-2" />Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default StoreManagement;

