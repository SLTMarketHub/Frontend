import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Card from '../../components/seller/Card';
import Button from '../../components/seller/Button';
import { useForm } from '../../hooks/seller/useForm';
import Layout from '../../components/seller/Layout';
import Header from '../../components/customer/Header';
import Footer from '../../components/customer/Footer';
import toast from 'react-hot-toast';
import { createProductOffering, createProductOfferingPrice } from '../../services/seller/productService';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  const validationRules = {
    name: (value) => !value ? 'Product name is required' : null,
    category: (value) => !value ? 'Category is required' : null,
    price: (value) => value <= 0 ? 'Price must be greater than 0' : null,
    stock: (value) => value < 0 ? 'Stock cannot be negative' : null,
    sku: (value) => !value ? 'SKU is required' : null,
  };

  const { values, errors, handleChange, handleSubmit, setFieldValue } = useForm({
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    sku: '',
    status: 'draft',
    images: [],
  }, validationRules);

  const categories = ['Electronics', 'Clothing', 'Accessories', 'Home & Garden', 'Sports & Outdoors', 'Books & Media', 'Health & Beauty'];

  const handleImageAdd = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      const newImages = [...imageUrls, url.trim()];
      setImageUrls(newImages);
      setFieldValue('images', newImages);
    }
  };

  const handleImageRemove = (index) => {
    const newImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImages);
    setFieldValue('images', newImages);
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const lifecycleMap = {
        draft: 'InDesign',
        active: 'Active',
        inactive: 'Retired'
      };

      const offering = await createProductOffering({
        name: formData.name,
        description: formData.description,
        categoryName: formData.category,
        lifecycleStatus: lifecycleMap[formData.status] || 'Active',
        isSellable: formData.status !== 'inactive',
        imageUrls
      });

      if (formData.price > 0) {
        await createProductOfferingPrice({
          offeringId: offering.id,
          amount: Number(formData.price),
          currency: 'LKR'
        });
      }

      toast.success('Product created successfully');
      navigate('/products');
    } catch (error) {
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header />
    <Layout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/products" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Add Product</h1>
            <p className="text-gray-600">Create a new product in your catalog</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input type="text" name="name" value={values.name} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-300'}`} placeholder="Enter product name" />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={values.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter product description" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select name="category" value={values.category} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.category ? 'border-red-300' : 'border-gray-300'}`}>
                      <option value="">Select category</option>
                      {categories.map((category) => (<option key={category} value={category}>{category}</option>))}
                    </select>
                    {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                    <input type="text" name="sku" value={values.sku} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.sku ? 'border-red-300' : 'border-gray-300'}`} placeholder="Enter SKU" />
                    {errors.sku && <p className="text-sm text-red-600 mt-1">{errors.sku}</p>}
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
              <div className="space-y-4">
                <Button type="button" variant="outline" onClick={handleImageAdd}><Upload className="w-4 h-4 mr-2" />Add Image URL</Button>
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Product ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                        <button type="button" onClick={() => handleImageRemove(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing & Inventory</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rs</span>
                    <input type="number" name="price" value={values.price} onChange={handleChange} step="0.01" min="0" className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.price ? 'border-red-300' : 'border-gray-300'}`} placeholder="0.00" />
                  </div>
                  {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input type="number" name="stock" value={values.stock} onChange={handleChange} min="0" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.stock ? 'border-red-300' : 'border-gray-300'}`} placeholder="0" />
                  {errors.stock && <p className="text-sm text-red-600 mt-1">{errors.stock}</p>}
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
              <select name="status" value={values.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </Card>

            <div className="space-y-3">
              <Button type="submit" loading={loading} className="w-full">Create Product</Button>
              <Link to="/products" className="block"><Button type="button" variant="outline" className="w-full">Cancel</Button></Link>
            </div>
          </div>
        </div>
      </form>
    </div>
     </Layout>
    <Footer />
    </>
  );
};

export default AddProduct;
