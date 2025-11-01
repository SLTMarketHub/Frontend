import React, { useState, useEffect } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

const BannerFormModal = ({ isOpen, onClose, onSave, editingBanner }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    status: 'active',
    position: 'home-hero',
    startDate: '',
    endDate: '',
    priority: 1,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingBanner) {
      setFormData(editingBanner);
    } else {
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        status: 'active',
        position: 'home-hero',
        startDate: '',
        endDate: '',
        priority: 1,
      });
    }
    setErrors({});
  }, [editingBanner, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    }
    
    if (!formData.linkUrl.trim()) {
      newErrors.linkUrl = 'Link URL is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingBanner ? 'Edit Banner' : 'Create New Banner'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`input ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Summer Sale 2025"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`input ${errors.description ? 'border-red-500' : ''}`}
            rows="3"
            placeholder="Up to 50% off on selected items"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL *
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className={`input ${errors.imageUrl ? 'border-red-500' : ''}`}
            placeholder="https://example.com/banner.jpg"
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>
          )}
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="mt-2 w-full h-32 object-cover rounded"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link URL *
          </label>
          <input
            type="url"
            name="linkUrl"
            value={formData.linkUrl}
            onChange={handleChange}
            className={`input ${errors.linkUrl ? 'border-red-500' : ''}`}
            placeholder="/shop/summer-sale"
          />
          {errors.linkUrl && (
            <p className="text-red-500 text-xs mt-1">{errors.linkUrl}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="input"
            >
              <option value="home-hero">Home - Hero</option>
              <option value="home-secondary">Home - Secondary</option>
              <option value="category-electronics">Category - Electronics</option>
              <option value="category-fashion">Category - Fashion</option>
              <option value="sidebar">Sidebar</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`input ${errors.startDate ? 'border-red-500' : ''}`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={`input ${errors.endDate ? 'border-red-500' : ''}`}
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority (1 = highest)
          </label>
          <input
            type="number"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="input max-w-xs"
            min="1"
            max="10"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit">
            {editingBanner ? 'Update Banner' : 'Create Banner'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BannerFormModal;