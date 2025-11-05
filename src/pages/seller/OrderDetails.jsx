import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Truck, MapPin, CreditCard, Mail, Phone } from 'lucide-react';
import Card from '../../components/seller/Card';
import Button from '../../components/seller/Button';
import Layout from '../../components/seller/Layout';
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import { formatCurrency, formatDate, getStatusColor } from '../../utils/seller/formatters';
import toast from 'react-hot-toast';
import { fetchOrderById, updateOrderById } from '../../services/seller/orderService';
import placeholderImg from '../../assets/images/placeholderImg.jpg';

const OrderDetails = () => {
  const { id } = useParams();
  // No mock data — initialize to null. TODO: fetch order by id from API and setOrder(response)
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      setOrderLoading(true);
      try {
        const po = await fetchOrderById(id);
        const mapped = {
          id: po.id,
          createdAt: po.orderDate || po.createdAt || new Date().toISOString(),
          status: po.state || 'pending',
          paymentStatus: 'pending',
          paymentMethod: 'N/A',
          items: (po.orderItem || []).map((oi) => ({
            id: oi.id,
            productName: oi.product?.name || 'Item',
            quantity: oi.quantity || 1,
            price: 0,
            total: 0,
            image: null
          })),
          shippingAddress: { name: '', street: '', city: '', state: '', zipCode: '', country: '' },
          billingAddress: { name: '', street: '', city: '', state: '', zipCode: '', country: '' },
          customerEmail: po.relatedParty?.find(r => r.role === 'Customer')?.email || '',
          customerPhone: po.relatedParty?.find(r => r.role === 'Customer')?.phone || ''
            || po.relatedParty?.find(r => r.role === 'Customer')?.telephone || '',
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0
        };
        setOrder(mapped);
      } catch (error) {
        toast.error('Failed to load order');
      } finally {
        setOrderLoading(false);
      }
    };

    if (id) loadOrder();
  }, [id]);

  const updateOrderStatus = async (newStatus) => {
    setLoading(true);
    try {
      await updateOrderById(id, { state: newStatus });
      setOrder((prev) => ({ ...prev, status: newStatus }));
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  if (orderLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If there's no order data, show a minimal placeholder.
  if (!order) {
    return (
      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-medium text-gray-900">Order not found</h3>
          <p className="text-gray-600">No order data available for id: {id}</p>
        </Card>
      </div>
    );
  }

  return (
    <>
    <Header />
    <Layout>
       <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/orders" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Order {order.id}</h1>
            <p className="text-gray-600">Placed on {formatDate(order.createdAt, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.paymentStatus)}`}>{order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                   <img src={item.image || placeholderImg} alt={item.productName} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.productName}</h4>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Price: {formatCurrency(item.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(item.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center"><MapPin className="w-5 h-5 mr-2" />Shipping Address</h3>
            <div className="text-gray-600">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center"><CreditCard className="w-5 h-5 mr-2" />Billing Address</h3>
            <div className="text-gray-600">
              <p className="font-medium">{order.billingAddress.name}</p>
              <p>{order.billingAddress.street}</p>
              <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</p>
              <p>{order.billingAddress.country}</p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2"><Mail className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-600">{order.customerEmail}</span></div>
              <div className="flex items-center space-x-2"><Phone className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-600">{order.customerPhone}</span></div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span>Tax</span><span>{formatCurrency(order.tax)}</span></div>
              <div className="flex justify-between text-sm"><span>Shipping</span><span>{formatCurrency(order.shipping)}</span></div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-medium"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Method: {order.paymentMethod}</p>
              <p className="text-sm text-gray-600">Status: <span className={`ml-1 px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.paymentStatus)}`}>{order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</span></p>
            </div>
          </Card>

          <div className="space-y-3">
            {order.status === 'pending' && (
              <Button onClick={() => updateOrderStatus('confirmed')} loading={loading} className="w-full"><Package className="w-4 h-4 mr-2" />Confirm Order</Button>
            )}
            {order.status === 'confirmed' && (
              <Button onClick={() => updateOrderStatus('shipped')} loading={loading} className="w-full"><Truck className="w-4 h-4 mr-2" />Mark as Shipped</Button>
            )}
            {order.status === 'shipped' && (
              <Button onClick={() => updateOrderStatus('delivered')} loading={loading} className="w-full"><Package className="w-4 h-4 mr-2" />Mark as Delivered</Button>
            )}
            <Button variant="outline" onClick={() => window.print()} className="w-full">Print Order</Button>
          </div>
        </div>
      </div>
    </div>
     </Layout>
    <Footer />
    </>
  );
};

export default OrderDetails;

