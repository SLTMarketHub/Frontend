import React, { useState } from 'react';
import { Book, HelpCircle, MessageCircle, FileText, ExternalLink, Search, ChevronRight } from 'lucide-react';
import Card from '../../components/seller/Card';
import Button from '../../components/seller/Button';

const mockFAQs = [
  { id: '1', question: 'How do I add a new product to my store?', answer: 'To add a new product, navigate to the Products section and click the "Add Product" button. Fill in the required information including name, description, price, and upload product images.', category: 'Products' },
  { id: '2', question: 'How can I track my order fulfillment?', answer: 'Go to the Orders section to view all your orders. You can update order status, track fulfillment, and manage shipping information from the order details page.', category: 'Orders' },
  { id: '3', question: 'How do payouts work?', answer: 'Payouts are processed automatically based on your payout schedule. You can view pending and completed payouts in the Payouts section and request manual payouts when available.', category: 'Payouts' },
  { id: '4', question: 'Can I set up promotional codes?', answer: 'Yes! Use the Promotions section to create discount codes, percentage discounts, or free shipping offers. You can set usage limits and validity periods for each promotion.', category: 'Promotions' },
  { id: '5', question: 'How do I manage my inventory levels?', answer: 'The Inventory section allows you to monitor stock levels, set minimum stock alerts, and restock products. Low stock items will be highlighted for your attention.', category: 'Inventory' },
];

const mockResources = [
  { id: '1', title: 'Getting Started Guide', description: 'Complete guide to setting up your MarketHub store', type: 'guide', url: '#', category: 'Setup' },
  { id: '2', title: 'Product Management Best Practices', description: 'Learn how to optimize your product listings', type: 'document', url: '#', category: 'Products' },
  { id: '3', title: 'Order Fulfillment Walkthrough', description: 'Video guide on processing and shipping orders', type: 'video', url: '#', category: 'Orders' },
  { id: '4', title: 'Analytics Deep Dive', description: 'Understanding your store analytics and metrics', type: 'guide', url: '#', category: 'Analytics' },
];

const Support = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const categories = ['All', 'Products', 'Orders', 'Inventory', 'Promotions', 'Payouts', 'Analytics'];

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getResourceIcon = (type) => {
    switch (type) {
      case 'guide':
        return <Book className="w-5 h-5 text-blue-600" />;
      case 'video':
        return <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center text-white text-xs">▶</div>;
      case 'document':
        return <FileText className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Support Center</h1>
          <p className="text-gray-600">Find answers and get help with your MarketHub store</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Contact Support</h3>
              <p className="text-sm text-gray-500">Get help from our team</p>
            </div>
          </div>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <Book className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Documentation</h3>
              <p className="text-sm text-gray-500">Browse our guides</p>
            </div>
          </div>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <HelpCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Video Tutorials</h3>
              <p className="text-sm text-gray-500">Watch and learn</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {['All', 'Products', 'Orders', 'Inventory', 'Promotions', 'Payouts', 'Analytics'].map((category) => (
              <option key={category} value={category === 'All' ? '' : category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${expandedFAQ === faq.id ? 'rotate-90' : ''}`} />
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-4 pb-3 text-gray-600 border-t border-gray-100">
                    <p className="pt-3">{faq.answer}</p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">{faq.category}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Helpful Resources</h3>
          <div className="space-y-3">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{resource.title}</h4>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">{resource.category}</span>
                      <span className="text-xs text-gray-500 capitalize">{resource.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-4">Can't find what you're looking for? Our support team is here to help.</p>
          <div className="flex items-center justify-center space-x-4">
            <Button>
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline">
              <Book className="w-4 h-4 mr-2" />
              Browse Docs
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Support;

