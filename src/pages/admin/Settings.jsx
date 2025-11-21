import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Truck,
  Receipt,
  Image,
  Mail,
  Save,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { ConfirmModal } from '../../components/common/Modal';
import { LoadingState } from '../../components/common/LoadingSpinner';
import BannerFormModal from '../../components/admin/settings/BannerFormModal';
import TemplateEditorModal from '../../components/admin/settings/TemplateEditorModal';
import useToast from '../../hooks/useToast';
import settingsService from '../../services/settingsService';

// Mock data for fallback and initial state
const mockCommissionRates = {
  defaultRate: 5.0,
  categoryRates: [
    { category: 'Electronics', rate: 3.0 },
    { category: 'Clothing', rate: 8.0 },
    { category: 'Books', rate: 10.0 },
    { category: 'Home & Garden', rate: 6.0 },
  ],
  minimumCommission: 50,
  paymentCycle: 'monthly',
};

const mockShippingRules = {
  freeShippingThreshold: 5000,
  standardShippingFee: 300,
  expressShippingFee: 600,
  zones: [
    { name: 'Colombo District', fee: 200, expressAvailable: true },
    { name: 'Western Province', fee: 350, expressAvailable: true },
    { name: 'Other Provinces', fee: 500, expressAvailable: false },
  ],
};

const mockTaxRules = {
  vatEnabled: true,
  vatRate: 12.0,
  includeInPrice: false,
  invoiceFooterText: 'Tax Invoice - VAT Reg No: 123456789V',
};

const mockBanners = [
  {
    id: 1,
    title: 'Summer Sale',
    description: 'Get up to 50% off on summer collection',
    imageUrl: '/api/placeholder/400/200',
    position: 'homepage-hero',
    priority: 1,
    status: 'active',
  },
];

const mockEmailTemplates = [
  {
    id: 1,
    name: 'Order Confirmation',
    subject: 'Your Order #{orderNumber} is Confirmed',
    type: 'order',
    isActive: true,
    variables: ['{customerName}', '{orderNumber}', '{orderTotal}'],
  },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('commission');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  // Initialize with mock data instead of null
  const [commissionData, setCommissionData] = useState(mockCommissionRates);
  const [shippingData, setShippingData] = useState(mockShippingRules);
  const [taxData, setTaxData] = useState(mockTaxRules);
  const [banners, setBanners] = useState(mockBanners);
  const [templates, setTemplates] = useState(mockEmailTemplates);

  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingBannerId, setDeletingBannerId] = useState(null);

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const tabs = [
    { id: 'commission', label: 'Commission Rates', icon: <DollarSign size={18} /> },
    { id: 'shipping', label: 'Shipping Rules', icon: <Truck size={18} /> },
    { id: 'tax', label: 'Tax Settings', icon: <Receipt size={18} /> },
    { id: 'banners', label: 'Banners', icon: <Image size={18} /> },
    { id: 'email', label: 'Email Templates', icon: <Mail size={18} /> },
  ];

  // Fetch all settings on mount with fallback
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const [
          commissionRes,
          shippingRes,
          taxRes,
          bannersRes,
          templatesRes,
        ] = await Promise.all([
          settingsService.getCommissionRates(),
          settingsService.getShippingRules(),
          settingsService.getTaxRules(),
          settingsService.getBanners(),
          settingsService.getEmailTemplates(),
        ]);

        // Update with backend data if available
        if (commissionRes) setCommissionData(commissionRes);
        if (shippingRes) setShippingData(shippingRes);
        if (taxRes) setTaxData(taxRes);
        if (bannersRes) setBanners(bannersRes);
        if (templatesRes) setTemplates(templatesRes);
      } catch (err) {
        console.error('Failed to load settings:', err);
        error('Failed to load settings from server. Using default data.');
        // Keep mock data as fallback (already set in useState)
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save handlers
  const handleSaveCommission = async () => {
    setSaving(true);
    try {
      await settingsService.updateCommissionRates(commissionData);
      success('Commission rates saved successfully!');
    } catch (err) {
      console.error(err);
      error('Failed to save commission rates');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveShipping = async () => {
    setSaving(true);
    try {
      await settingsService.updateShippingRules(shippingData);
      success('Shipping rules saved successfully!');
    } catch (err) {
      console.error(err);
      error('Failed to save shipping rules');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTax = async () => {
    setSaving(true);
    try {
      await settingsService.updateTaxRules(taxData);
      success('Tax settings saved successfully!');
    } catch (err) {
      console.error(err);
      error('Failed to save tax settings');
    } finally {
      setSaving(false);
    }
  };

  // Banner handlers
  const handleDeleteBanner = (id) => {
    setDeletingBannerId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteBanner = async () => {
    try {
      await settingsService.deleteBanner(deletingBannerId);
      setBanners(banners.filter(b => b.id !== deletingBannerId));
      success('Banner deleted successfully!');
    } catch (err) {
      console.error(err);
      error('Failed to delete banner');
    } finally {
      setShowDeleteConfirm(false);
      setDeletingBannerId(null);
    }
  };

  const handleSaveBanner = async (bannerData) => {
    try {
      let updatedBanner;
      if (editingBanner) {
        updatedBanner = await settingsService.updateBanner(editingBanner.id, bannerData);
        setBanners(banners.map(b => b.id === editingBanner.id ? updatedBanner : b));
        success('Banner updated successfully!');
      } else {
        updatedBanner = await settingsService.createBanner(bannerData);
        setBanners([...banners, updatedBanner]);
        success('Banner created successfully!');
      }
    } catch (err) {
      console.error(err);
      error('Failed to save banner');
    } finally {
      setShowBannerModal(false);
      setEditingBanner(null);
    }
  };

  // Email template handlers
  const handleSaveTemplate = async (templateData) => {
    try {
      const updatedTemplate = await settingsService.updateEmailTemplate(editingTemplate.id, templateData);
      setTemplates(templates.map(t => t.id === editingTemplate.id ? updatedTemplate : t));
      success('Email template updated successfully!');
    } catch (err) {
      console.error(err);
      error('Failed to save email template');
    } finally {
      setShowTemplateModal(false);
      setEditingTemplate(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-600 mt-1">Configure platform-wide settings and preferences</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-slt-primary text-slt-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <LoadingState loading={loading}>
        <div>
          {/* Commission - Remove conditional rendering */}
          {activeTab === 'commission' && (
            <Card title="Commission Rate Configuration">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    value={commissionData.defaultRate}
                    onChange={(e) =>
                      setCommissionData({ ...commissionData, defaultRate: parseFloat(e.target.value) || 0 })
                    }
                    className="input max-w-xs"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This rate applies to all products unless a category-specific rate is set
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">
                    Category-Specific Rates
                  </h3>
                  <div className="space-y-3">
                    {commissionData.categoryRates.map((cat, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={cat.category}
                            readOnly
                            className="input bg-gray-50"
                          />
                        </div>
                        <div className="w-32">
                          <div className="relative">
                            <input
                              type="number"
                              value={cat.rate}
                              onChange={(e) => {
                                const newRates = [...commissionData.categoryRates];
                                newRates[index].rate = parseFloat(e.target.value) || 0;
                                setCommissionData({ ...commissionData, categoryRates: newRates });
                              }}
                              className="input pr-8"
                              min="0"
                              max="100"
                              step="0.1"
                            />
                            <span className="absolute right-3 top-2 text-gray-500">%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Commission (LKR)
                  </label>
                  <input
                    type="number"
                    value={commissionData.minimumCommission}
                    onChange={(e) =>
                      setCommissionData({
                        ...commissionData,
                        minimumCommission: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="input max-w-xs"
                    min="0"
                    step="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Cycle
                  </label>
                  <select
                    value={commissionData.paymentCycle}
                    onChange={(e) =>
                      setCommissionData({ ...commissionData, paymentCycle: e.target.value })
                    }
                    className="input max-w-xs"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button
                    onClick={handleSaveCommission}
                    loading={saving}
                    icon={<Save size={18} />}
                  >
                    Save Commission Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Shipping - Remove conditional rendering */}
          {activeTab === 'shipping' && (
            <Card title="Shipping Configuration">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Free Shipping Threshold (LKR)
                  </label>
                  <input
                    type="number"
                    value={shippingData.freeShippingThreshold}
                    onChange={(e) =>
                      setShippingData({
                        ...shippingData,
                        freeShippingThreshold: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="input max-w-xs"
                    min="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Orders above this amount qualify for free shipping
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Standard Shipping Fee (LKR)
                    </label>
                    <input
                      type="number"
                      value={shippingData.standardShippingFee}
                      onChange={(e) =>
                        setShippingData({
                          ...shippingData,
                          standardShippingFee: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="input"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Express Shipping Fee (LKR)
                    </label>
                    <input
                      type="number"
                      value={shippingData.expressShippingFee}
                      onChange={(e) =>
                        setShippingData({
                          ...shippingData,
                          expressShippingFee: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="input"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Shipping Zones</h3>
                  <div className="space-y-3">
                    {shippingData.zones.map((zone, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{zone.name}</p>
                        </div>
                        <div className="w-32">
                          <input
                            type="number"
                            value={zone.fee}
                            onChange={(e) => {
                              const newZones = [...shippingData.zones];
                              newZones[index].fee = parseFloat(e.target.value) || 0;
                              setShippingData({ ...shippingData, zones: newZones });
                            }}
                            className="input"
                            min="0"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={zone.expressAvailable}
                            onChange={(e) => {
                              const newZones = [...shippingData.zones];
                              newZones[index].expressAvailable = e.target.checked;
                              setShippingData({ ...shippingData, zones: newZones });
                            }}
                            className="mr-2"
                          />
                          <label className="text-sm text-gray-700">Express Available</label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button onClick={handleSaveShipping} loading={saving} icon={<Save size={18} />}>
                    Save Shipping Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Tax - Remove conditional rendering */}
          {activeTab === 'tax' && (
            <Card title="Tax Configuration">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={taxData.vatEnabled}
                    onChange={(e) => setTaxData({ ...taxData, vatEnabled: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">Enable VAT</label>
                </div>

                {taxData.vatEnabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">VAT Rate (%)</label>
                      <input
                        type="number"
                        value={taxData.vatRate}
                        onChange={(e) =>
                          setTaxData({ ...taxData, vatRate: parseFloat(e.target.value) || 0 })
                        }
                        className="input max-w-xs"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={taxData.includeInPrice}
                        onChange={(e) =>
                          setTaxData({ ...taxData, includeInPrice: e.target.checked })
                        }
                        className="mr-2"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Include Tax in Displayed Prices
                      </label>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Footer Text
                  </label>
                  <textarea
                    value={taxData.invoiceFooterText}
                    onChange={(e) => setTaxData({ ...taxData, invoiceFooterText: e.target.value })}
                    className="input"
                    rows="3"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button onClick={handleSaveTax} loading={saving} icon={<Save size={18} />}>
                    Save Tax Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Banners */}
          {activeTab === 'banners' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Promotional Banners</h2>
                <Button
                  icon={<Plus size={18} />}
                  onClick={() => {
                    setEditingBanner(null);
                    setShowBannerModal(true);
                  }}
                >
                  Add Banner
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {banners.map((banner) => (
                  <Card key={banner.id} hover>
                    <div className="flex items-start space-x-4">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-32 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{banner.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{banner.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>Position: {banner.position}</span>
                              <span>Priority: {banner.priority}</span>
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  banner.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {banner.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingBanner(banner);
                                setShowBannerModal(true);
                              }}
                              className="p-2 text-slt-primary hover:bg-slt-light rounded"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteBanner(banner.id)}
                              className="p-2 text-error hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Email Templates */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              {templates.map((template) => (
                <Card key={template.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {template.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Subject: {template.subject}</p>
                      <p className="text-sm text-gray-500 mt-2">Type: {template.type}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.variables.map((variable, index) => (
                          <code key={index} className="px-2 py-1 bg-gray-100 text-xs rounded">
                            {variable}
                          </code>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Edit2 size={16} />}
                      onClick={() => {
                        setEditingTemplate(template);
                        setShowTemplateModal(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </LoadingState>

      <BannerFormModal
        isOpen={showBannerModal}
        onClose={() => {
          setShowBannerModal(false);
          setEditingBanner(null);
        }}
        onSave={handleSaveBanner}
        editingBanner={editingBanner}
      />

      <TemplateEditorModal
        isOpen={showTemplateModal}
        onClose={() => {
          setShowTemplateModal(false);
          setEditingTemplate(null);
        }}
        onSave={handleSaveTemplate}
        editingTemplate={editingTemplate}
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteBanner}
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
        variant="danger"
        confirmText="Delete"
      />
    </div>
  );
};

export default Settings;