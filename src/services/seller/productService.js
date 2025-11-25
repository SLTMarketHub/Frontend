import { api, upload } from './api';

// TMF620 base paths through API Gateway
const TMF620_BASE = 'https://markethub-api-gateway.onrender.com/tmf-api/productCatalog/v5';
const OFFERING_PATH = `${TMF620_BASE}/productOffering`;
const PRICE_PATH = `${TMF620_BASE}/productOfferingPrice`;
const CATEGORY_PATH = `${TMF620_BASE}/category`;

// Utilities
const generateId = (prefix) => `${prefix}-${Date.now()}`;

export async function listProductOfferings({ offset = 0, limit = 50, name = '', categoryId = '' } = {}) {
  let url = OFFERING_PATH;
  const params = { offset, limit, fields: 'id,name,description,lifecycleStatus,createdAt,productOfferingPrice,category,attachment' };

  if (name) params.name = name;

  // Special case: when no category is selected → use /all endpoint
  if (categoryId === 'all') {
    url = `${TMF620_BASE}/productOffering/all`;
  } else if (categoryId) {
    params['category.id'] = categoryId;
  }

  const { data } = await api.get(url, { params });
  return data; // { data: [...], pagination: {...} }
}

export async function getProductOffering(id) {
  const params = { fields: 'id,name,description,lifecycleStatus,productOfferingPrice,category,attachment,createdAt' };
  const { data } = await api.get(`${OFFERING_PATH}/${id}`, { params });
  return data;
}

export async function createProductOffering({ id, name, description, categoryId, categoryName, lifecycleStatus = 'Active', isSellable = true, images = [], imageUrls = [] }) {
  if (!id) {
    throw new Error('Product ID is required when creating a product offering.');
  }
  const body = {
    id,
    name,
    description,
    lifecycleStatus,
    isSellable,
    category: categoryId || categoryName ? [{
      ...(categoryId ? { id: categoryId } : {}),
      ...(categoryName ? { name: categoryName } : {})
    }] : [],
    attachment: []
  };

  // Handle both image URLs and pre-formatted image objects
  if (images && images.length > 0) {
    // If images are already in the correct format
    body.attachment = images;
  } else if (imageUrls && imageUrls.length > 0) {
    // For backward compatibility - convert URLs to attachment objects
    body.attachment = imageUrls.map((url, index) => ({
      id: `${id}-att-${index + 1}`,
      type: 'image',
      url,
      name: `image-${index + 1}`,
      '@type': 'Attachment'
    }));
  }

  const { data } = await api.post(OFFERING_PATH, body);
  return data; // created offering
}

export async function updateProductOffering(id, updates) {
  const { data } = await api.patch(`${OFFERING_PATH}/${id}`, updates);
  return data;
}

export async function deleteProductOffering(id) {
  await api.delete(`${OFFERING_PATH}/${id}`);
}

// Category helpers
export async function listCategories({ offset = 0, limit = 100, name = '' } = {}) {
  const safeLimit = Math.max(1, Math.min(limit, 100));
  const params = { offset, limit: safeLimit };
  if (name) params.name = name;
  params.fields = 'id,name,description,lifecycleStatus';
  const { data } = await api.get(CATEGORY_PATH, { params });
  return data; // { data: [...], pagination: {...} }
}

export async function createCategory({ id, name, description = '', lifecycleStatus = 'Active', parentId, isRoot = false }) {
  if (!id || !name) {
    throw new Error('Category id and name are required.');
  }
  const body = {
    id,
    name,
    description,
    lifecycleStatus,
    parentId,
    isRoot,
    href: `${CATEGORY_PATH}/${id}`
  };
  const { data } = await api.post(CATEGORY_PATH, body);
  return data;
}

export async function uploadOfferingImage(id, file) {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await upload.post(`${OFFERING_PATH}/${id}/attachments`, formData);
  return data; // { message, attachment }
}

// Pricing helpers (TMF620 productOfferingPrice)
export async function getProductOfferingPrice(popId) {
  const { data } = await api.get(`${PRICE_PATH}/${popId}`);
  return data;
}

export async function listProductOfferingPrices({ offset = 0, limit = 100, priceType = 'discount' } = {}) {
  const params = { offset, limit };
  if (priceType) params.priceType = priceType;
  const { data } = await api.get(PRICE_PATH, { params });
  return data; // { data: [...], pagination }
}

export async function createProductOfferingPrice({ offeringId, name = 'One-time Price', currency = 'LKR', amount = 0 }) {
  const id = generateId('POP');
  const body = {
    id,
    name,
    priceType: 'oneTime',
    price: {
      dutyFreeAmount: { value: amount, unit: currency },
      taxIncludedAmount: { value: amount, unit: currency },
      taxRate: 0
    },
    lifecycleStatus: 'Active'
  };
  const { data } = await api.post(PRICE_PATH, body);

  // Link price to offering
  await updateProductOffering(offeringId, {
    productOfferingPrice: [{ id: data.id, href: `${PRICE_PATH}/${data.id}`, name: data.name, '@referredType': 'ProductOfferingPrice' }]
  });

  return data;
}

export async function updateProductOfferingPrice(id, updates) {
  const { data } = await api.patch(`${PRICE_PATH}/${id}`, updates);
  return data;
}

export async function deleteProductOfferingPrice(id) {
  await api.delete(`${PRICE_PATH}/${id}`);
}

// Promotions as TMF620 ProductOfferingPrice with priceType = 'discount'
export async function createDiscountPromotion({ name, type, value, startDate, endDate }) {
  const id = generateId('PROMO');
  const isPercentage = type === 'percentage';
  const alteration = {
    applicationOrder: 1,
    name: isPercentage ? 'Percentage Discount' : 'Fixed Discount',
    priceType: 'recurring',
    price: {
      dutyFreeAmount: { value: isPercentage ? 0 : -Math.abs(Number(value) || 0), unit: 'LKR' },
      taxIncludedAmount: { value: isPercentage ? 0 : -Math.abs(Number(value) || 0), unit: 'LKR' },
      taxRate: 0
    },
    validFor: {
      startDateTime: startDate ? new Date(startDate) : new Date(),
      endDateTime: endDate ? new Date(endDate) : undefined
    }
  };

  const body = {
    id,
    name,
    description: isPercentage ? `-${value}%` : `-LKR ${value}`,
    priceType: 'discount',
    lifecycleStatus: 'Active',
    priceAlteration: [alteration],
    validFor: {
      startDateTime: startDate ? new Date(startDate) : new Date(),
      endDateTime: endDate ? new Date(endDate) : undefined
    }
  };

  const { data } = await api.post(PRICE_PATH, body);
  return data;
}


