import React, { useState, useEffect } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import { Eye, EyeOff } from 'lucide-react';

const TemplateEditorModal = ({ isOpen, onClose, onSave, editingTemplate }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    type: '',
    body: '',
    isActive: true,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTemplate) {
      setFormData(editingTemplate);
    } else {
      setFormData({
        name: '',
        subject: '',
        type: '',
        body: '',
        isActive: true,
      });
    }
    setErrors({});
  }, [editingTemplate, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.body.trim()) {
      newErrors.body = 'Email body is required';
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

  const insertVariable = (variable) => {
    const textarea = document.getElementById('template-body');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.body;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    
    setFormData({
      ...formData,
      body: before + variable + after,
    });
    
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + variable.length;
      textarea.focus();
    }, 0);
  };

  const renderPreview = () => {
    let preview = formData.body;
    
    const sampleData = {
      '{{customer_name}}': 'John Doe',
      '{{platform_name}}': 'SLT MarketHub',
      '{{order_id}}': '#ORD-2025-0001',
      '{{order_total}}': 'LKR 15,000.00',
      '{{tracking_url}}': 'https://sltmarkethub.com/track/12345',
      '{{login_url}}': 'https://sltmarkethub.com/login',
    };
    
    Object.keys(sampleData).forEach((key) => {
      preview = preview.replaceAll(key, sampleData[key]);
    });
    
    return preview;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTemplate ? 'Edit Email Template' : 'Create Email Template'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Welcome Email"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Subject *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`input ${errors.subject ? 'border-red-500' : ''}`}
            placeholder="Welcome to {{platform_name}}!"
          />
          {errors.subject && (
            <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Available Variables (click to insert):
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              '{{customer_name}}',
              '{{platform_name}}',
              '{{order_id}}',
              '{{order_total}}',
              '{{tracking_url}}',
              '{{login_url}}',
            ].map((variable) => (
              <button
                key={variable}
                type="button"
                onClick={() => insertVariable(variable)}
                className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs rounded font-mono transition-colors"
              >
                {variable}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Email Body *
            </label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm text-slt-primary hover:underline flex items-center"
            >
              {showPreview ? (
                <>
                  <EyeOff size={14} className="mr-1" /> Hide Preview
                </>
              ) : (
                <>
                  <Eye size={14} className="mr-1" /> Show Preview
                </>
              )}
            </button>
          </div>
          
          {!showPreview ? (
            <>
              <textarea
                id="template-body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                className={`input font-mono text-sm ${
                  errors.body ? 'border-red-500' : ''
                }`}
                rows="12"
                placeholder="Dear {{customer_name}},&#10;&#10;Welcome to {{platform_name}}!&#10;..."
              />
              {errors.body && (
                <p className="text-red-500 text-xs mt-1">{errors.body}</p>
              )}
            </>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4 bg-white min-h-[300px]">
              <div className="prose max-w-none">
                <p className="text-sm text-gray-500 mb-4 italic">
                  Preview with sample data:
                </p>
                <div className="whitespace-pre-wrap text-sm">
                  {renderPreview()}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-slt-primary border-gray-300 rounded focus:ring-slt-primary"
          />
          <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
            Template is active
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit">
            {editingTemplate ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TemplateEditorModal;