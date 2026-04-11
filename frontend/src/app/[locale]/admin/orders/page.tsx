'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { formatPrice, ORDER_STATUS_COLORS, ORDER_STATUS_VI } from '@/lib/utils';
import { formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';
import { Package, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  subtotal: string;
  shippingFee: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: any[];
}

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { accessToken } = useAuthStore();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('admin');
  const tCart = useTranslations('cart');
  const tCheckout = useTranslations('checkout');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!accessToken) return;
    
    try {
      const data = await api.getOrders(accessToken);
      const ordersArray = data?.items || data || [];
      setOrders(Array.isArray(ordersArray) ? ordersArray : []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    if (!accessToken) return;
    
    try {
      await api.updateOrderStatus(accessToken, orderId, status);
      toast.success(t('updateOrderStatusSuccess'));
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error: any) {
      toast.error(error.message || tCart('error'));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('manageOrders')}</h1>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('orderId')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('customer')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{locale === 'vi' ? 'Tổng tiền' : 'Total'}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{locale === 'vi' ? 'Ngày đặt' : 'Order Date'}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{locale === 'vi' ? 'Thao tác' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <p>{order.customerName}</p>
                    <p className="text-sm text-gray-500">{order.customerPhone}</p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-primary-600">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${ORDER_STATUS_COLORS[order.status]}`}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>{ORDER_STATUS_VI[status]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDateTime(order.createdAt)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{locale === 'vi' ? 'Chi tiết đơn hàng' : 'Order Details'} #{selectedOrder.orderNumber}</h2>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t('customer')}</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerPhone}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('status')}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${ORDER_STATUS_COLORS[selectedOrder.status]}`}>
                    {ORDER_STATUS_VI[selectedOrder.status]}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">{locale === 'vi' ? 'Sản phẩm' : 'Products'}</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 rounded">
                        {item.product?.image && (
                          <img src={item.product.image} alt="" className="w-full h-full object-cover rounded" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-sm text-gray-500">x{item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatPrice(item.total)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{tCart('subtotal')}</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('shippingFee')}</span>
                  <span>{formatPrice(selectedOrder.shippingFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>{tCart('total')}</span>
                  <span className="text-primary-600">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
