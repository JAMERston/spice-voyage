import { useEffect, useState } from 'react';
import { BaseCrudService, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { <SpiceVoyageOrders></SpiceVoyageOrders> } from '@/entities';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CheckCircle, Clock, AlertCircle, RefreshCw, Edit2, Trash2, Eye, X, LogOut } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { GlobalDishKitsOrders } from '../../entities';

const ADMIN_USERNAME = 'jameskase76';
const ADMIN_PASSWORD = '09263324271';

export default function OrdersNotificationsPage() {
  const { currency } = useCurrency();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [orders, setOrders] = useState<GlobalDishKitsOrders[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    totalRevenue: 0,
  });
  const [editingOrder, setEditingOrder] = useState<GlobalDishKitsOrders | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewingPaymentProof, setViewingPaymentProof] = useState<GlobalDishKitsOrders | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
      // Auto-refresh every 30 seconds
      const interval = setInterval(loadOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

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

  const openEditDialog = (order: SpiceVoyageOrders) => {
    setEditingOrder(order);
    setNewStatus(order.orderStatus || 'Pending');
  };

  const closeEditDialog = () => {
    setEditingOrder(null);
    setNewStatus('');
  };

  const updateOrderStatus = async () => {
    if (!editingOrder || !newStatus) return;

    try {
      setIsUpdating(true);
      await BaseCrudService.update<SpiceVoyageOrders>('orders', {
        _id: editingOrder._id,
        orderStatus: newStatus,
      });

      // Update local state optimistically
      setOrders(orders.map(o =>
        o._id === editingOrder._id
          ? { ...o, orderStatus: newStatus }
          : o
      ));

      closeEditDialog();
      // Reload to ensure sync with server
      await loadOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      setIsDeleting(true);
      await BaseCrudService.delete('orders', orderId);

      // Update local state optimistically
      setOrders(orders.filter(o => o._id !== orderId));

      setDeletingOrderId(null);
      // Reload to ensure sync with server
      await loadOrders();
    } catch (error) {
      console.error('Failed to delete order:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Login page
  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-full max-w-md px-6">
            <div className="bg-white border border-foreground/10 rounded-lg p-8 shadow-lg">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2 text-center">
                Admin Access
              </h1>
              <p className="font-paragraph text-center text-foreground/60 mb-8">
                Sign in to view orders
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-paragraph text-sm font-semibold text-foreground">
                    Username
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-paragraph text-sm font-semibold text-foreground">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                  />
                </div>

                {loginError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="font-paragraph text-sm text-red-700">{loginError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full font-heading font-semibold bg-primary text-primary-foreground hover:opacity-90 py-3"
                >
                  Sign In
                </Button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-24 py-12">
          {/* Page Title */}
          <div className="mb-12 flex justify-between items-start">
            <div>
              <h1 className="font-heading text-5xl font-bold text-foreground mb-2">
                Order Notifications
              </h1>
              <p className="font-paragraph text-lg text-foreground/60">
                Real-time view of all incoming orders
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-heading font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
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
                {formatPrice(stats.totalRevenue, currency ?? DEFAULT_CURRENCY)}
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
                          {formatPrice(order.totalAmount || 0, currency ?? DEFAULT_CURRENCY)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                              {getStatusIcon(order.orderStatus)}
                              {order.orderStatus}
                            </span>
                            {order.paymentProofFileName && (
                              <button
                                onClick={() => setViewingPaymentProof(order)}
                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View payment proof"
                              >
                                <Eye className="w-4 h-4 text-blue-600 hover:text-blue-700" />
                              </button>
                            )}
                            <button
                              onClick={() => openEditDialog(order)}
                              className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                              title="Edit order status"
                            >
                              <Edit2 className="w-4 h-4 text-foreground/60 hover:text-foreground" />
                            </button>
                            <button
                              onClick={() => setDeletingOrderId(order._id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete order"
                            >
                              <Trash2 className="w-4 h-4 text-red-600 hover:text-red-700" />
                            </button>
                          </div>
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

      {/* View Payment Proof Dialog */}
      <Dialog open={!!viewingPaymentProof} onOpenChange={(open) => !open && setViewingPaymentProof(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="font-heading text-2xl">Payment Proof</DialogTitle>
            <button
              onClick={() => setViewingPaymentProof(null)}
              className="p-1 hover:bg-foreground/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>
          {viewingPaymentProof && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="font-paragraph text-sm text-foreground/60">Order ID</p>
                <p className="font-heading font-semibold text-foreground">{viewingPaymentProof._id?.slice(0, 12)}...</p>
              </div>
              <div className="space-y-2">
                <p className="font-paragraph text-sm text-foreground/60">Customer</p>
                <p className="font-heading font-semibold text-foreground">{viewingPaymentProof.customerName}</p>
              </div>
              <div className="space-y-2">
                <p className="font-paragraph text-sm text-foreground/60">Payment Proof File</p>
                <p className="font-paragraph text-base text-foreground">{viewingPaymentProof.paymentProofFileName}</p>
              </div>
              <div className="space-y-2">
                <p className="font-paragraph text-sm text-foreground/60 mb-3">Preview</p>
                <div className="bg-foreground/5 rounded-lg p-4 flex items-center justify-center min-h-[300px]">
                  {/* Check if we have a valid image URL from paymentProofImage field */}
                  {viewingPaymentProof.paymentProofImage && viewingPaymentProof.paymentProofImage.trim() ? (
                    <>
                      {console.log('Displaying payment proof image:', {
                        imageUrl: viewingPaymentProof.paymentProofImage,
                        fileName: viewingPaymentProof.paymentProofFileName
                      })}
                      <Image
                        src={viewingPaymentProof.paymentProofImage}
                        alt="Payment proof"
                        width={500}
                        height={300}
                        className="max-w-full h-auto rounded-lg"
                      />
                    </>
                  ) : (
                    <div className="text-center">
                      {console.log('No valid image URL for payment proof:', {
                        imageUrl: viewingPaymentProof.paymentProofImage,
                        fileName: viewingPaymentProof.paymentProofFileName
                      })}
                      <p className="font-paragraph text-foreground/60 mb-2">No preview available</p>
                      <p className="font-paragraph text-sm text-foreground/40">{viewingPaymentProof.paymentProofFileName || 'No file uploaded'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setViewingPaymentProof(null)}
              className="font-heading font-semibold bg-primary text-primary-foreground hover:opacity-90"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Status Dialog */}
      <Dialog open={!!editingOrder} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Update Order Status</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <p className="font-paragraph text-sm text-foreground/60">Order ID</p>
                <p className="font-heading font-semibold text-foreground">{editingOrder._id?.slice(0, 12)}...</p>
              </div>
              <div className="space-y-2">
                <p className="font-paragraph text-sm text-foreground/60">Customer</p>
                <p className="font-heading font-semibold text-foreground">{editingOrder.customerName}</p>
              </div>
              <div className="space-y-2">
                <label className="font-paragraph text-sm font-semibold text-foreground">New Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={closeEditDialog}
              disabled={isUpdating}
              className="font-heading font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={updateOrderStatus}
              disabled={isUpdating || !newStatus}
              className="font-heading font-semibold bg-primary text-primary-foreground hover:opacity-90"
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Order Confirmation Dialog */}
      <Dialog open={!!deletingOrderId} onOpenChange={(open) => !open && setDeletingOrderId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Delete Order</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="font-paragraph text-foreground/80">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeletingOrderId(null)}
              disabled={isDeleting}
              className="font-heading font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deletingOrderId && deleteOrder(deletingOrderId)}
              disabled={isDeleting}
              className="font-heading font-semibold bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
