import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { DishKits } from '@/entities';
import { useCart, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ShopPage() {
  const [products, setProducts] = useState<DishKits[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addingItemId, actions } = useCart();
  const { currency } = useCurrency();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const productsResult = await BaseCrudService.getAll<DishKits>('dishkits');
      setProducts(productsResult.items);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="w-full bg-background py-16 md:py-24">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-heading text-5xl md:text-6xl text-foreground mb-6">
              Our Dish Kits
            </h1>
            <p className="font-paragraph text-lg text-foreground max-w-2xl mx-auto">
              Explore our collection of authentic international and Filipino dish kits
            </p>
          </motion.div>

          {/* Products Grid */}
          <div className="min-h-[600px]">
            {isLoading ? null : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-background group"
                  >
                    <Link to={`/product/${product._id}`}>
                      <div className="overflow-hidden rounded-2xl mb-6">
                        <Image 
                          src={product.itemImage || 'https://static.wixstatic.com/media/395327_9fa0463923e544bca55ec03fa379bccd~mv2.png?originWidth=384&originHeight=384'}
                          alt={product.itemName || 'Dish Kit'}
                          width={400}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>
                    <div className="px-2">
                      <Link to={`/product/${product._id}`}>
                        <h3 className="font-heading text-2xl text-foreground mb-3 hover:text-primary transition-colors">
                          {product.itemName}
                        </h3>
                      </Link>
                      <p className="font-paragraph text-base text-foreground mb-4 line-clamp-2">
                        {product.itemDescription}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-2xl text-primary font-bold">
                          ₱{(product.itemPrice || 0).toFixed(2)}
                        </span>
                        <button
                          disabled={addingItemId === product._id}
                          onClick={() => actions.addToCart({ collectionId: 'dishkits', itemId: product._id })}
                          className="bg-primary text-primary-foreground font-heading font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {addingItemId === product._id ? 'Adding...' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-paragraph text-lg text-foreground">
                  No products available at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
