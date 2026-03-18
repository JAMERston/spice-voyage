import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { Image } from '@/components/ui/image';

export default function Cart() {
  const { items, totalPrice, isOpen, isCheckingOut, actions } = useCart();
  const { currency } = useCurrency();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/50 z-50"
        onClick={actions.closeCart}
      />

      {/* Cart Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-foreground/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-foreground" />
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Your Cart
            </h2>
          </div>
          <button
            onClick={actions.closeCart}
            className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-foreground/20 mb-4" />
              <p className="font-paragraph text-lg text-foreground mb-2">
                Your cart is empty
              </p>
              <p className="font-paragraph text-base text-foreground/60">
                Add some delicious kits to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image 
                      src={item.image || 'https://static.wixstatic.com/media/395327_547b58b1dc0f495086027d72ac0712a8~mv2.png?originWidth=128&originHeight=128'}
                      alt={item.name}
                      width={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-base font-semibold text-foreground mb-2 truncate">
                      {item.name}
                    </h3>
                    <p className="font-paragraph text-lg text-primary font-bold mb-3">
                      {formatPrice(item.price, currency ?? DEFAULT_CURRENCY)}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => actions.updateQuantity(item, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-foreground/5 rounded transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4 text-foreground" />
                      </button>
                      <span className="font-paragraph text-base text-foreground font-semibold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => actions.updateQuantity(item, item.quantity + 1)}
                        className="p-1 hover:bg-foreground/5 rounded transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4 text-foreground" />
                      </button>
                      <button
                        onClick={() => actions.removeFromCart(item)}
                        className="ml-auto font-paragraph text-sm text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-foreground/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="font-heading text-xl font-semibold text-foreground">
                Total
              </span>
              <span className="font-heading text-2xl font-bold text-primary">
                {formatPrice(totalPrice, currency ?? DEFAULT_CURRENCY)}
              </span>
            </div>
            <button
              onClick={actions.checkout}
              disabled={isCheckingOut}
              className="w-full bg-primary text-primary-foreground font-heading font-semibold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isCheckingOut ? 'Processing...' : 'Checkout'}
            </button>
            <button
              onClick={actions.closeCart}
              className="w-full mt-3 bg-transparent text-primary border border-primary font-heading font-semibold py-4 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
