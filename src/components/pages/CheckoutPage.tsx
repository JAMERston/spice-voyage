import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Image } from '@/components/ui/image';
import { GlobalDishKitsOrders } from '@/entities';
import { BaseCrudService, DEFAULT_CURRENCY, formatPrice, useCart, useCurrency } from '@/integrations';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Upload } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, actions } = useCart();
  const { currency } = useCurrency();

  const [currentStep, setCurrentStep] = useState<'summary' | 'payment' | 'confirmation'>('summary');
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    deliveryAddress: '',
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [paymentProofImageUrl, setPaymentProofImageUrl] = useState('');

  // GCash account details
  const GCASH_ACCOUNT_NAME = 'Jhenray Jim';
  const GCASH_QR_CODE = 'https://static.wixstatic.com/media/395327_4020d4ef14d0452c86aae4099ac0a379~mv2.jpg';

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(file);
      setUploadedFileName(file.name);

      // Create a local preview URL for the image
      const fileUrl = URL.createObjectURL(file);
      setPaymentProofImageUrl(fileUrl);
      console.log('Payment proof file selected:', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        previewUrl: fileUrl
      });
    }
  };

  const isFormValid = formData.name && formData.contactNumber && formData.deliveryAddress;

  const handleSubmitOrder = async () => {
    if (!isFormValid || !paymentProof) {
      alert('Please fill in all fields and upload payment proof');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create order record with both filename and image URL
      const orderId = crypto.randomUUID();
      const orderData = {
        _id: orderId,
        customerName: formData.name,
        contactNumber: formData.contactNumber,
        deliveryAddress: formData.deliveryAddress,
        totalAmount: totalPrice,
        orderItems: JSON.stringify(items.map(item => ({
          itemName: item.name,
          quantity: item.quantity,
          price: item.price
        }))),
        paymentProofFileName: uploadedFileName,
        paymentProofImage: paymentProofImageUrl, // Store the image URL
        orderStatus: 'pending_verification',
        submissionDate: new Date().toISOString(),
      };

      console.log('Submitting order with payment proof:', {
        fileName: uploadedFileName,
        imageUrl: paymentProofImageUrl,
        orderData
      });

      await BaseCrudService.create<GlobalDishKitsOrders>('orders', orderData);

      // Clear cart and move to confirmation
      actions.clearCart();
      setCurrentStep('confirmation');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-24 py-16">
          <div className="text-center">
            <p className="font-paragraph text-lg text-foreground mb-6">Your cart is empty</p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-primary text-primary-foreground font-heading font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-24 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/shop')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-paragraph"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Shop
        </button>

        {/* Confirmation Page */}
        {currentStep === 'confirmation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center py-16"
          >
            <div className="mb-6 flex justify-center">
              <CheckCircle className="w-20 h-20 text-primary" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
              Order Submitted!
            </h1>
            <p className="font-paragraph text-lg text-foreground mb-6">
              Your order is being verified. We will contact you once payment is confirmed.
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
              <p className="font-paragraph text-base text-foreground mb-2">
                <strong>Estimated Response Time:</strong> Within 24 hours
              </p>
              <p className="font-paragraph text-sm text-foreground/70">
                We'll send you a confirmation message via your contact number once we verify your payment.
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-primary-foreground font-heading font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Return to Home
            </button>
          </motion.div>
        )}

        {/* Checkout Steps */}
        {currentStep !== 'confirmation' && (
          <>
            {/* Step Indicator */}
            <div className="flex justify-center gap-4 mb-12">
              {['summary', 'payment'].map((step, index) => (
                <div key={step} className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold transition-all ${
                      currentStep === step
                        ? 'bg-primary text-primary-foreground'
                        : ['summary', 'payment'].indexOf(currentStep) > index
                        ? 'bg-primary/30 text-foreground'
                        : 'bg-foreground/10 text-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="font-paragraph text-base text-foreground hidden sm:inline">
                    {step === 'summary' ? 'Order Summary' : 'Payment'}
                  </span>
                  {index < 1 && <div className="w-8 h-0.5 bg-foreground/10 hidden sm:block" />}
                </div>
              ))}
            </div>

            {/* Order Summary Step */}
            {currentStep === 'summary' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto"
              >
                <h1 className="font-heading text-4xl text-foreground mb-8">Order Summary</h1>

                {/* Order Items */}
                <div className="bg-foreground/5 rounded-lg p-6 mb-8">
                  <h2 className="font-heading text-2xl text-foreground mb-6">Your Items</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center pb-4 border-b border-foreground/10 last:border-b-0">
                        <div className="flex-1">
                          <p className="font-heading text-lg text-foreground">{item.name}</p>
                          <p className="font-paragraph text-sm text-foreground/60">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-heading text-lg text-primary font-bold">
                          {formatPrice(item.price * item.quantity, currency ?? DEFAULT_CURRENCY)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-foreground/20 flex justify-between items-center">
                    <span className="font-heading text-2xl text-foreground">Total:</span>
                    <span className="font-heading text-3xl text-primary font-bold">
                      {formatPrice(totalPrice, currency ?? DEFAULT_CURRENCY)}
                    </span>
                  </div>
                </div>

                {/* Customer Details Form */}
                <div className="bg-foreground/5 rounded-lg p-6 mb-8">
                  <h2 className="font-heading text-2xl text-foreground mb-6">Delivery Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-heading text-base text-foreground mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-foreground/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block font-heading text-base text-foreground mb-2">
                        Contact Number *
                      </label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        placeholder="e.g., +63 9XX XXX XXXX"
                        className="w-full px-4 py-3 border border-foreground/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block font-heading text-base text-foreground mb-2">
                        Delivery Address *
                      </label>
                      <textarea
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleInputChange}
                        placeholder="Enter your complete delivery address"
                        rows={3}
                        className="w-full px-4 py-3 border border-foreground/20 rounded-lg font-paragraph text-base focus:outline-none focus:border-primary resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Important Note */}
                <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 mb-8">
                  <p className="font-paragraph text-sm text-foreground">
                    <strong>📌 Important:</strong> Orders will only be processed after payment verification. Please ensure all details are correct.
                  </p>
                </div>

                <button
                  onClick={() => setCurrentStep('payment')}
                  disabled={!isFormValid}
                  className="w-full bg-primary text-primary-foreground font-heading font-semibold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Payment
                </button>
              </motion.div>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto"
              >
                <h1 className="font-heading text-4xl text-foreground mb-8">Payment</h1>

                {/* GCash QR Code Section */}
                <div className="bg-foreground/5 rounded-lg p-8 mb-8 text-center">
                  <h2 className="font-heading text-2xl text-foreground mb-6">Scan to Pay with GCash</h2>

                  <div className="bg-background rounded-lg p-6 mb-6 inline-block">
                    <Image
                      src={GCASH_QR_CODE}
                      alt="GCash QR Code"
                      width={300}
                      className="w-64 h-64 object-contain"
                    />
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="bg-background rounded-lg p-4">
                      <p className="font-paragraph text-sm text-foreground/60 mb-2">Account Name</p>
                      <p className="font-heading text-xl text-foreground font-bold">{GCASH_ACCOUNT_NAME}</p>
                    </div>
                    <div className="bg-background rounded-lg p-4">
                      <p className="font-paragraph text-sm text-foreground/60 mb-2">Amount to Send</p>
                      <p className="font-heading text-3xl text-primary font-bold">
                        {formatPrice(totalPrice, currency ?? DEFAULT_CURRENCY)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <p className="font-paragraph text-base text-foreground">
                      <strong>📱 Instructions:</strong> Scan the QR code using GCash and send the exact total amount shown above.
                    </p>
                  </div>
                </div>

                {/* Payment Proof Upload */}
                <div className="bg-foreground/5 rounded-lg p-8 mb-8">
                  <h2 className="font-heading text-2xl text-foreground mb-6">Proof of Payment</h2>

                  <div className="border-2 border-dashed border-foreground/20 rounded-lg p-8 text-center mb-6">
                    <Upload className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
                    <p className="font-paragraph text-base text-foreground mb-2">
                      Upload your GCash payment screenshot
                    </p>
                    <p className="font-paragraph text-sm text-foreground/60 mb-4">
                      Choose a clear image file (PNG, JPG, JPEG) from your device
                    </p>
                    <label className="inline-block">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <span className="bg-primary text-primary-foreground font-heading font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity cursor-pointer inline-block">
                        Choose File
                      </span>
                    </label>
                  </div>

                  {uploadedFileName && (
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
                      <p className="font-paragraph text-base text-foreground">
                        ✓ File selected: <strong>{uploadedFileName}</strong>
                      </p>
                    </div>
                  )}

                  <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
                    <p className="font-paragraph text-sm text-foreground">
                      <strong>📸 Instructions:</strong> Upload a clear screenshot of your GCash payment confirmation. The image will be stored securely with your order.
                    </p>
                  </div>
                </div>

                {/* Important Note */}
                <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 mb-8">
                  <p className="font-paragraph text-sm text-foreground">
                    <strong>⏱️ Note:</strong> Orders will only be processed after payment verification. We will contact you within 24 hours.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep('summary')}
                    className="flex-1 bg-transparent text-primary border border-primary font-heading font-semibold py-4 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={!paymentProof || isSubmitting}
                    className="flex-1 bg-primary text-primary-foreground font-heading font-semibold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Order'}
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
