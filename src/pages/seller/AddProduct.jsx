import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Card from '../../components/seller/Card';
import Button from '../../components/seller/Button';
import { useForm } from '../../hooks/seller/useForm';
import Layout from '../../components/seller/Layout';
import Header from '../../components/customer/Header';
import Footer from '../../components/customer/Footer';
import toast from 'react-hot-toast';
import { createProductOffering, createProductOfferingPrice, listCategories, createCategory, uploadOfferingImage } from '../../services/seller/productService';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ id: '', name: '', description: '' });
  const [creatingCategory, setCreatingCategory] = useState(false);

  const validationRules = {
    categoryId: (value) => !value ? 'Category is required' : null,
    productId: (value) => !value ? 'Product ID is required' : null,
    name: (value) => !value ? 'Product name is required' : null,
    price: (value) => value <= 0 ? 'Price must be greater than 0' : null,
    stock: (value) => value < 0 ? 'Stock cannot be negative' : null,
    sku: (value) => !value ? 'SKU is required' : null,
  };

  const { values, errors, handleChange, handleSubmit, setFieldValue } = useForm({
    categoryId: '',
    categoryName: '',
    productId: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    sku: '',
    status: 'draft',
    images: [],
  }, validationRules);

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const res = await listCategories({ limit: 100 });
      setCategories(res?.data || []);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    return () => {
      imageFiles.forEach(fileObj => URL.revokeObjectURL(fileObj.preview));
    };
  }, [imageFiles]);

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setFieldValue('categoryId', value);
    const selected = (categories || []).find(cat => cat.id === value);
    setFieldValue('categoryName', selected?.name || '');
  };

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

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const mapped = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setImageFiles(prev => [...prev, ...mapped]);
    event.target.value = null;
  };

  const handleSelectedFileRemove = (index) => {
    const file = imageFiles[index];
    if (file) {
      URL.revokeObjectURL(file.preview);
    }
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleNewCategoryChange = (event) => {
    const { name, value } = event.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCategory = async () => {
    if (!newCategory.id || !newCategory.name) {
      toast.error('Category ID and name are required');
      return;
    }
    setCreatingCategory(true);
    try {
      const created = await createCategory({
        id: newCategory.id.trim(),
        name: newCategory.name.trim(),
        description: newCategory.description?.trim() || ''
      });
      toast.success('Category created');
      setCategories(prev => [created, ...prev.filter(cat => cat.id !== created.id)]);
      setFieldValue('categoryId', created.id);
      setFieldValue('categoryName', created.name);
      setShowNewCategoryForm(false);
      setNewCategory({ id: '', name: '', description: '' });
      loadCategories();
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to create category');
    } finally {
      setCreatingCategory(false);
    }
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const lifecycleMap = {
        draft: 'InDesign',
        active: 'Active',
        inactive: 'Retired'
      };

      let categoryName = formData.categoryName;
      if (!categoryName && formData.categoryId) {
        const selected = (categories || []).find(cat => cat.id === formData.categoryId);
        categoryName = selected?.name || '';
      }

      const offering = await createProductOffering({
        id: formData.productId,
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        categoryName,
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

      if (imageFiles.length > 0) {
        try {
          await Promise.all(imageFiles.map(({ file }) => uploadOfferingImage(offering.id, file)));
          toast.success('Images uploaded successfully');
          setImageFiles([]);
        } catch (uploadError) {
          toast.error('Product saved, but some images failed to upload');
        }
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product ID *</label>
                  <input
                    type="text"
                    name="productId"
                    value={values.productId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.productId ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Enter product ID"
                  />
                  {errors.productId && <p className="text-sm text-red-600 mt-1">{errors.productId}</p>}
                </div>
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                    <button
                      type="button"
                      onClick={() => setShowNewCategoryForm(prev => !prev)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {showNewCategoryForm ? 'Hide creator' : 'Add new category'}
                    </button>
                  </div>
                  <select
                    name="categoryId"
                    value={values.categoryId}
                    onChange={handleCategoryChange}
                    disabled={categoriesLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.categoryId ? 'border-red-300' : 'border-gray-300'}`}
                  >
                    <option value="">Select category</option>
                    {(categories || []).map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-sm text-red-600 mt-1">{errors.categoryId}</p>}
                  {showNewCategoryForm && (
                    <div className="space-y-3 p-4 border border-dashed rounded-lg bg-gray-50">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Category ID *</label>
                        <input
                          type="text"
                          name="id"
                          value={newCategory.id}
                          onChange={handleNewCategoryChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g. CAT-001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Category Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={newCategory.name}
                          onChange={handleNewCategoryChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter category name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          name="description"
                          value={newCategory.description}
                          onChange={handleNewCategoryChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Optional description"
                        />
                      </div>
                      <Button type="button" loading={creatingCategory} onClick={handleCreateCategory} className="w-full">
                        Save Category
                      </Button>
                    </div>
                  )}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload from device</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
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
                {imageFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageFiles.map((file, index) => (
                      <div key={file.preview} className="relative group">
                        <img src={file.preview} alt={`New image ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                        <button type="button" onClick={() => handleSelectedFileRemove(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
