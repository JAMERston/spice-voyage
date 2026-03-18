import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { DishKits } from '@/entities';
import { useCart, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { ArrowLeft, Package, ChefHat, ShoppingCart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<DishKits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addingItemId, actions } = useCart();
  const { currency } = useCurrency();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await BaseCrudService.getById<DishKits>('dishkits', id);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="w-full bg-background py-12 md:py-16">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-24">
          {/* Back Button */}
          <Link 
            to="/shop"
            className="inline-flex items-center gap-2 font-paragraph text-base text-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </Link>

          <div className="min-h-[600px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-32">
                <LoadingSpinner />
              </div>
            ) : !product ? (
              <div className="text-center py-32">
                <h2 className="font-heading text-3xl text-foreground mb-4">Product Not Found</h2>
                <p className="font-paragraph text-base text-foreground mb-8">
                  The product you're looking for doesn't exist.
                </p>
                <Link to="/shop">
                  <button className="bg-primary text-primary-foreground font-heading font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity">
                    Browse All Products
                  </button>
                </Link>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Product Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
                  {/* Product Image */}
                  <div className="overflow-hidden rounded-2xl">
                    <Image 
                      src={product.itemImage || 'https://static.wixstatic.com/media/395327_b3ce1982e0bb4a5ea410947de5c95a23~mv2.png?originWidth=576&originHeight=576'}
                      alt={product.itemName || 'Dish Kit'}
                      width={600}
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col justify-center">
                    <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-6">
                      {product.itemName}
                    </h1>
                    <p className="font-paragraph text-lg text-foreground mb-8 leading-relaxed">
                      {product.itemDescription}
                    </p>
                    <div className="mb-8">
                      <span className="font-heading text-4xl text-primary font-bold">
                        {formatPrice(product.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}
                      </span>
                    </div>
                    <button
                      disabled={addingItemId === product._id}
                      onClick={() => actions.addToCart({ collectionId: 'dishkits', itemId: product._id })}
                      className="w-full md:w-auto bg-primary text-primary-foreground font-heading font-semibold px-12 py-5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {addingItemId === product._id ? 'Adding to Cart...' : 'Add to Cart'}
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                  {/* Included Ingredients */}
                  {product.includedIngredients && (
                    <div className="bg-background p-8 rounded-2xl border border-foreground/10">
                      <div className="flex items-center gap-3 mb-6">
                        <Package className="w-6 h-6 text-primary" />
                        <h2 className="font-heading text-2xl font-semibold text-foreground">
                          What's Included
                        </h2>
                      </div>
                      <div className="font-paragraph text-base text-foreground leading-relaxed whitespace-pre-line">
                        {product.includedIngredients}
                      </div>
                    </div>
                  )}

                  {/* Required Fresh Ingredients */}
                  {product.requiredFreshIngredients && (
                    <div className="bg-background p-8 rounded-2xl border border-foreground/10">
                      <div className="flex items-center gap-3 mb-6">
                        <ChefHat className="w-6 h-6 text-primary" />
                        <h2 className="font-heading text-2xl font-semibold text-foreground">
                          You'll Need
                        </h2>
                      </div>
                      <div className="font-paragraph text-base text-foreground leading-relaxed whitespace-pre-line">
                        {product.requiredFreshIngredients}
                      </div>
                    </div>
                  )}
                </div>

                {/* Cooking Instructions */}
                {product.cookingInstructions && (
                  <div className="mt-12 bg-background p-8 rounded-2xl border border-foreground/10">
                    <h2 className="font-heading text-3xl font-semibold text-foreground mb-6">
                      Cooking Instructions
                    </h2>
                    <div className="font-paragraph text-base text-foreground leading-relaxed whitespace-pre-line">
                      {product.cookingInstructions}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
