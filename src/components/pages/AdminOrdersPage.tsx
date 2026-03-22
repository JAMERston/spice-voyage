import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { GlobalDishKitsOrders } from '@/entities';
import { Image } from '@/components/ui/image';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Eye, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<GlobalDishKitsOrders[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<GlobalDishKitsOrders | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const result = await BaseCrudService.getAll<GlobalDishKitsOrders>('orders', [], { limit: 100 });
      setOrders(result.items || []);
      
      // Calculate stats
      const pending = result.items?.filter(o => o.orderStatus === 'Pending').length || 0;
      const completed = result.items?.filter(o => o.orderStatus === 'Completed').length || 0;
      const revenue = result.items?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0;
      
      setStats({
        total: result.items?.length || 0,
        pending,
        completed,
        totalRevenue: revenue,
      });
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await BaseCrudService.update<GlobalDishKitsOrders>('orders', {
        _id: orderId,
        orderStatus: newStatus,
      });
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      setSelectedOrder(selectedOrder && selectedOrder._id === orderId ? { ...selectedOrder, orderStatus: newStatus } : selectedOrder);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await BaseCrudService.delete('orders', orderId);
        setOrders(orders.filter(o => o._id !== orderId));
        setSelectedOrder(null);
        await loadOrders();
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-24 py-12">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="font-heading text-5xl font-bold text-foreground mb-2">
              Admin Orders Dashboard
            </h1>
            <p className="font-paragraph text-lg text-foreground/60">
              Manage and track all incoming orders
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white border border-foreground/10 rounded-lg p-6">
              <p className="font-paragraph text-sm text-foreground/60 mb-2">Total Orders</p>
              <p className="font-heading text-4xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="bg-white border border-foreground/10 rounded-lg p-6">
              <p className="font-paragraph text-sm text-foreground/60 mb-2">Pending</p>
              <p className="font-heading text-4xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white border border-foreground/10 rounded-lg p-6">
              <p className="font-paragraph text-sm text-foreground/60 mb-2">Completed</p>
              <p className="font-heading text-4xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="bg-white border border-foreground/10 rounded-lg p-6">
              <p className="font-paragraph text-sm text-foreground/60 mb-2">Total Revenue</p>
              <p className="font-heading text-4xl font-bold text-primary">
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-foreground/10 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-foreground/10">
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    Recent Orders
                  </h2>
                </div>

                {isLoading ? (
                  <div className="p-12 flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="font-paragraph text-lg text-foreground/60">
                      No orders yet
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-foreground/5 border-b border-foreground/10">
                        <tr>
                          <th className="px-6 py-4 text-left font-heading font-semibold text-foreground text-sm">
                            Order ID
                          </th>
                          <th className="px-6 py-4 text-left font-heading font-semibold text-foreground text-sm">
                            Customer
                          </th>
                          <th className="px-6 py-4 text-left font-heading font-semibold text-foreground text-sm">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-left font-heading font-semibold text-foreground text-sm">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left font-heading font-semibold text-foreground text-sm">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id} className="border-b border-foreground/10 hover:bg-foreground/2 transition-colors">
                            <td className="px-6 py-4 font-paragraph text-sm text-foreground">
                              {order._id?.slice(0, 8)}...
                            </td>
                            <td className="px-6 py-4 font-paragraph text-sm text-foreground">
                              {order.customerName}
                            </td>
                            <td className="px-6 py-4 font-heading font-semibold text-primary">
                              ${order.totalAmount?.toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                                {getStatusIcon(order.orderStatus)}
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Order Details */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-foreground/10 rounded-lg overflow-hidden sticky top-24">
                <div className="p-6 border-b border-foreground/10">
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    {selectedOrder ? 'Order Details' : 'Select an Order'}
                  </h2>
                </div>

                {selectedOrder ? (
                  <div className="p-6 space-y-6">
                    {/* Order ID */}
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 mb-1">Order ID</p>
                      <p className="font-heading font-semibold text-foreground break-all">
                        {selectedOrder._id}
                      </p>
                    </div>

                    {/* Customer Info */}
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 mb-1">Customer Name</p>
                      <p className="font-paragraph text-base text-foreground">
                        {selectedOrder.customerName}
                      </p>
                    </div>

                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 mb-1">Email</p>
                      <p className="font-paragraph text-base text-foreground">
                        {selectedOrder.email || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 mb-1">Contact Number</p>
                      <p className="font-paragraph text-base text-foreground">
                        {selectedOrder.contactNumber}
                      </p>
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 mb-1">Delivery Address</p>
                      <p className="font-paragraph text-base text-foreground">
                        {selectedOrder.deliveryAddress}
                      </p>
                    </div>

                    {/* Order Items */}
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 mb-1">Order Items</p>
                      <p className="font-paragraph text-base text-foreground">
                        {selectedOrder.orderItems}
                      </p>
                    </div>

                    {/* Total Amount */}
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 mb-1">Total Amount</p>
                      <p className="font-heading text-2xl font-bold text-primary">
                        ${selectedOrder.totalAmount?.toFixed(2)}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 mb-2">Status</p>
                      <div className="flex gap-2">
                        {['Pending', 'Completed', 'Cancelled'].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(selectedOrder._id, status)}
                            className={`flex-1 px-3 py-2 rounded text-xs font-semibold transition-all ${
                              selectedOrder.orderStatus === status
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-foreground/5 text-foreground hover:bg-foreground/10'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submission Date */}
                    <div>
                      <p className="font-paragraph text-xs text-foreground/60 mb-1">Submitted</p>
                      <p className="font-paragraph text-base text-foreground">
                        {selectedOrder.submissionDate
                          ? new Date(selectedOrder.submissionDate).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteOrder(selectedOrder._id)}
                      className="w-full flex items-center justify-center gap-2 bg-destructive text-destructive-foreground font-heading font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Order
                    </button>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="font-paragraph text-foreground/60">
                      Click on an order to view details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
