import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Image } from '@/components/ui/image';
import { GlobalDishKitsOrders } from '@/entities';
import { BaseCrudService } from '@/integrations';
import { motion } from 'framer-motion';
import { Search, AlertCircle, CheckCircle, Truck, Package } from 'lucide-react';
import { useState } from 'react';

interface OrderResult {
  order: GlobalDishKitsOrders;
  items: Array<{
    itemName: string;
    quantity: number;
    price: number;
  }>;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: Package,
    description: 'Your order is being verified'
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: CheckCircle,
    description: 'Your order has been confirmed'
  },
  'out-for-delivery': {
    label: 'Out for Delivery',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    icon: Truck,
    description: 'Your order is on its way'
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: CheckCircle,
    description: 'Your order has been delivered'
  },
  'pending_verification': {
    label: 'Pending Verification',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: Package,
    description: 'Your payment is being verified'
  }
};

export default function TrackOrderPage() {
  const [orderCode, setOrderCode] = useState('');
  const [result, setResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderCode.trim()) {
      setError('Please enter an order code');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);
    setSearched(true);

    try {
      // Fetch all orders and search for matching order code
      const { items } = await BaseCrudService.getAll<GlobalDishKitsOrders>('orders', {}, { limit: 1000 });
      
      const foundOrder = items.find(
        order => order.orderCode?.toLowerCase() === orderCode.toLowerCase()
      );

      if (foundOrder) {
        // Parse order items
        let parsedItems = [];
        try {
          parsedItems = JSON.parse(foundOrder.orderItems || '[]');
        } catch {
          parsedItems = [];
        }

        setResult({
          order: foundOrder,
          items: parsedItems
        });
      } else {
        setError('Order not found. Please check your order code and try again.');
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('An error occurred while searching for your order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status?: string) => {
    const key = status?.toLowerCase() || 'pending';
    return statusConfig[key as keyof typeof statusConfig] || statusConfig.pending;
  };

  const StatusIcon = getStatusConfig(result?.order.orderStatus).icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-24 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
            Track Your Order
          </h1>
          <p className="font-paragraph text-lg text-foreground/70">
            Enter your order code to check your order status
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <form onSubmit={handleTrackOrder} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                placeholder="Enter your order code (e.g., #12345)"
                className="w-full px-6 py-4 border border-foreground/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground font-heading font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
        </motion.div>

        {/* Results Section */}
        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            {error ? (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-8 text-center">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <p className="font-heading text-xl text-foreground mb-2">
                  Order Not Found
                </p>
                <p className="font-paragraph text-base text-foreground/70">
                  {error}
                </p>
              </div>
            ) : result ? (
              <div className="space-y-8">
                {/* Status Card */}
                <div className={`border-2 rounded-lg p-8 ${getStatusConfig(result.order.orderStatus).color}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <StatusIcon className="w-8 h-8" />
                    <div>
                      <p className="font-paragraph text-sm opacity-75">Order Status</p>
                      <p className="font-heading text-2xl font-bold">
                        {getStatusConfig(result.order.orderStatus).label}
                      </p>
                    </div>
                  </div>
                  <p className="font-paragraph text-base opacity-90">
                    {getStatusConfig(result.order.orderStatus).description}
                  </p>
                </div>

                {/* Order Details */}
                <div className="bg-foreground/5 rounded-lg p-8">
                  <h2 className="font-heading text-2xl text-foreground mb-6">Order Details</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <p className="font-paragraph text-sm text-foreground/60 mb-2">Order Code</p>
                      <p className="font-heading text-lg text-foreground font-bold">
                        {result.order.orderCode}
                      </p>
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-foreground/60 mb-2">Customer Name</p>
                      <p className="font-heading text-lg text-foreground font-bold">
                        {result.order.customerName}
                      </p>
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-foreground/60 mb-2">Payment Method</p>
                      <p className="font-heading text-lg text-foreground font-bold">
                        {result.order.paymentMethod || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-foreground/60 mb-2">Order Date</p>
                      <p className="font-heading text-lg text-foreground font-bold">
                        {result.order.submissionDate ? new Date(result.order.submissionDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {result.order.estimatedDelivery && (
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-8">
                      <p className="font-paragraph text-sm text-foreground/60 mb-2">Estimated Delivery</p>
                      <p className="font-heading text-lg text-foreground font-bold">
                        {result.order.estimatedDelivery}
                      </p>
                    </div>
                  )}
                </div>

                {/* Items Ordered */}
                <div className="bg-foreground/5 rounded-lg p-8">
                  <h2 className="font-heading text-2xl text-foreground mb-6">Items Ordered</h2>
                  
                  {result.items.length > 0 ? (
                    <div className="space-y-4">
                      {result.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center pb-4 border-b border-foreground/10 last:border-b-0">
                          <div>
                            <p className="font-heading text-lg text-foreground">{item.itemName}</p>
                            <p className="font-paragraph text-sm text-foreground/60">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-heading text-lg text-primary font-bold">
                            ₱{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-paragraph text-base text-foreground/60">No items found</p>
                  )}
                </div>

                {/* Total Amount */}
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-8">
                  <div className="flex justify-between items-center">
                    <span className="font-heading text-2xl text-foreground">Total Amount:</span>
                    <span className="font-heading text-3xl text-primary font-bold">
                      ₱{result.order.totalAmount?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-foreground/5 rounded-lg p-8">
                  <h2 className="font-heading text-2xl text-foreground mb-4">Delivery Address</h2>
                  <p className="font-paragraph text-base text-foreground">
                    {result.order.deliveryAddress}
                  </p>
                </div>

                {/* Contact Number */}
                <div className="bg-foreground/5 rounded-lg p-8">
                  <h2 className="font-heading text-2xl text-foreground mb-4">Contact Number</h2>
                  <p className="font-paragraph text-base text-foreground">
                    {result.order.contactNumber}
                  </p>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}

        {/* Info Section */}
        {!searched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto bg-secondary/10 border border-secondary/30 rounded-lg p-8 text-center"
          >
            <p className="font-paragraph text-base text-foreground">
              Enter your order code (received in your confirmation email) to track your order status in real-time.
            </p>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
