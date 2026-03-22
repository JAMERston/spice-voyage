import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { GlobalDishKitsOrders } from '@/entities';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OrdersNotificationsPage() {
  const [orders, setOrders] = useState<GlobalDishKitsOrders[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
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
              Order Notifications
            </h1>
            <p className="font-paragraph text-lg text-foreground/60">
              Real-time view of all incoming orders
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

          {/* Refresh Button */}
          <div className="mb-8 flex justify-end">
            <button
              onClick={loadOrders}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-heading font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Orders List */}
          <div className="bg-white border border-foreground/10 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-foreground/10">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                All Orders
              </h2>
            </div>

            {isLoading ? (
              <div className="p-12 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-paragraph text-lg text-foreground/60">
                  No orders yet. Orders will appear here as they're submitted.
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
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left font-heading font-semibold text-foreground text-sm">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left font-heading font-semibold text-foreground text-sm">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left font-heading font-semibold text-foreground text-sm">
                        Date
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
                        <td className="px-6 py-4 font-paragraph text-sm text-foreground">
                          {order.contactNumber}
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
                        <td className="px-6 py-4 font-paragraph text-sm text-foreground/60">
                          {order.submissionDate
                            ? new Date(order.submissionDate).toLocaleDateString()
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-12 bg-primary/5 border border-primary/20 rounded-lg p-8">
            <h3 className="font-heading text-xl font-bold text-foreground mb-4">
              📧 Email Notifications
            </h3>
            <p className="font-paragraph text-foreground/80 mb-4">
              To receive email notifications when new orders arrive, configure your email settings in the CMS. 
              Orders are automatically tracked here and updated in real-time.
            </p>
            <p className="font-paragraph text-sm text-foreground/60">
              This page auto-refreshes every 30 seconds to show the latest orders.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
