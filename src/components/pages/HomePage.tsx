// HPI 1.7-G
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Image } from '@/components/ui/image';
import { DishKits, HowItWorksSteps } from '@/entities';
import { BaseCrudService, DEFAULT_CURRENCY, formatPrice, useCart, useCurrency } from '@/integrations';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// --- Custom Hooks for Motion ---
function useParallax(value: any, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

export default function HomePage() {
  // --- Canonical Data Sources ---
  const [featuredKits, setFeaturedKits] = useState<DishKits[]>([]);
  const [howItWorksSteps, setHowItWorksSteps] = useState<HowItWorksSteps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { addingItemId, actions } = useCart();
  const { currency } = useCurrency();

  // --- Refs for Scroll Animations ---
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollY } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useParallax(heroScrollY, 150);
  const heroOpacity = useTransform(heroScrollY, [0, 0.8], [1, 0]);

  const breatherRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: breatherScrollY } = useScroll({
    target: breatherRef,
    offset: ["start end", "end start"]
  });
  const breatherY = useParallax(breatherScrollY, 200);

  // --- Data Fetching (Preserved Logic) ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [kitsResult, stepsResult] = await Promise.all([
        BaseCrudService.getAll<DishKits>('dishkits', {}, { limit: 3 }),
        BaseCrudService.getAll<HowItWorksSteps>('howitworkssteps')
      ]);
      setFeaturedKits(kitsResult.items);
      setHowItWorksSteps(stepsResult.items.sort((a, b) => (a.stepNumber || 0) - (b.stepNumber || 0)));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-paragraph">
      <Header />

      {/*
        HERO SECTION
        Concept: Immersive, full-bleed, asymmetrical.
        Motion: Parallax background, staggered text reveal.
      */}
      <section ref={heroRef} className="relative w-full h-[90vh] min-h-[600px] overflow-clip bg-foreground">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 w-full h-[120%]"
        >
          <Image
            src="https://static.wixstatic.com/media/395327_a386a2b182b1407e8f0f82d36e3f631e~mv2.png?originWidth=1152&originHeight=576"
            alt="A beautifully plated international dish"
            className="w-full h-full object-cover opacity-60"
          />
        </motion.div>

        <div className="absolute inset-0 flex flex-col justify-end pb-24 px-6 md:px-12 lg:px-24 max-w-[120rem] mx-auto">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl text-background leading-[0.9] tracking-tighter mb-8">
                Cook the <br/>
                <span className="text-primary">World</span> at Home.
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 items-start sm:items-center"
            >
              <p className="font-paragraph text-lg md:text-xl text-background/80 max-w-md leading-relaxed">
                Pre-measured spice and seasoning kits. Just add fresh ingredients. Perfect for beginners.
              </p>
              <div className="flex gap-4 mt-4 sm:mt-0">
                <Link to="/shop">
                  <button className="bg-primary text-primary-foreground font-heading font-medium px-8 py-4 rounded-sm hover:bg-secondary transition-colors duration-300">
                    Shop Kits
                  </button>
                </Link>
                <Link to="/how-it-works">
                  <button className="bg-transparent text-background border border-background/30 font-heading font-medium px-8 py-4 rounded-sm hover:bg-background hover:text-foreground transition-colors duration-300">
                    Discover
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/*
        NARRATIVE BRIDGE
        Concept: Extreme negative space, typographic focus.
      */}
      <section className="w-full py-32 md:py-48 px-6">
        <div className="max-w-[80rem] mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-heading text-3xl md:text-5xl lg:text-6xl leading-tight tracking-tight text-foreground"
          >
            We believe authentic flavor shouldn't require a passport or a culinary degree. <span className="text-primary">Just a little curiosity.</span>
          </motion.h2>
        </div>
      </section>

      {/*
        FEATURED KITS (Data Driven)
        Concept: Sticky sidebar, scrolling unadorned product cards.
      */}
      <section className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24 pb-32">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">

          {/* Sticky Header */}
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-12 h-[2px] bg-primary mb-8" />
                <h2 className="font-heading text-4xl md:text-6xl tracking-tighter mb-6">
                  Curated <br/>Selections
                </h2>
                <p className="font-paragraph text-lg text-foreground/70 mb-8 max-w-sm">
                  Explore our most popular international and Filipino dish kits, meticulously crafted for perfect balance.
                </p>
                <Link to="/shop" className="inline-flex items-center gap-2 text-primary font-heading font-medium hover:gap-4 transition-all duration-300">
                  View Full Menu
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Scrolling Products */}
          <div className="lg:w-2/3">
            <div className={`flex flex-col gap-24 transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              {featuredKits.length > 0 ? (
                featuredKits.map((kit, index) => (
                  <ProductCard
                    key={kit._id}
                    kit={kit}
                    index={index}
                    currency={currency}
                    addingItemId={addingItemId}
                    onAdd={() => actions.addToCart({ collectionId: 'dishkits', itemId: kit._id })}
                  />
                ))
              ) : (
                <div className="py-24 text-foreground/50 font-paragraph">
                  Curating our menu...
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/*
        VISUAL BREATHER
        Concept: Full-width parallax image to separate sections.
      */}
      <section ref={breatherRef} className="w-full h-[70vh] overflow-clip relative">
        <motion.div style={{ y: breatherY }} className="absolute inset-0 w-full h-[130%]">
          <Image
            src="https://static.wixstatic.com/media/395327_deadb3e29fe040619a0bf2ab96346efb~mv2.png"
            alt="Fresh ingredients preparation"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/*
        HOW IT WORKS (Data Driven)
        Concept: Dark mode contrast, large typography, staggered list.
      */}
      <section className="w-full bg-foreground text-background py-32 md:py-48">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-24">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <h2 className="font-heading text-5xl md:text-7xl tracking-tighter text-primary">
              The Process
            </h2>
          </motion.div>

          <div className={`flex flex-col transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            {howItWorksSteps.length > 0 ? (
              howItWorksSteps.map((step, index) => (
                <motion.div
                  key={step._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  className="group border-t border-background/20 py-12 md:py-16 flex flex-col md:flex-row gap-8 md:gap-16 items-start"
                >
                  <div className="font-heading text-6xl md:text-8xl font-bold text-background/10 group-hover:text-primary transition-colors duration-500 w-32 shrink-0">
                    0{step.stepNumber}
                  </div>
                  <div className="flex-1 max-w-2xl">
                    <h3 className="font-heading text-3xl md:text-4xl mb-4">
                      {step.title}
                    </h3>
                    <p className="font-paragraph text-lg text-background/70 leading-relaxed mb-6">
                      {step.description}
                    </p>
                    {step.callToAction && (
                      <Link to="/shop" className="text-primary font-heading font-medium hover:underline underline-offset-4">
                        {step.callToAction}
                      </Link>
                    )}
                  </div>
                  {step.icon && (
                    <div className="hidden lg:block w-32 h-32 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                       <Image
                          src={step.icon}
                          alt={step.title || 'Step icon'}
                          className="w-full h-full object-contain"
                        />
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="py-12 text-background/50">Loading steps...</div>
            )}
          </div>

        </div>
      </section>

      {/*
        FINAL CTA
        Concept: Minimalist, centered, strong action.
      */}
      <section className="w-full py-32 md:py-48 px-6 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-5xl md:text-7xl tracking-tighter mb-8">
              Your Kitchen.<br/>
              <span className="text-primary">Global Flavors.</span>
            </h2>
            <Link to="/shop">
              <button className="bg-foreground text-background font-heading font-medium px-12 py-5 rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-300 text-lg">
                Start Cooking
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// --- Subcomponents ---

function ProductCard({ kit, index, currency, addingItemId, onAdd }: {
  kit: DishKits,
  index: number,
  currency: string | null | undefined,
  addingItemId: string | null,
  onAdd: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="group flex flex-col gap-6"
    >
      <Link to={`/product/${kit._id}`} className="block overflow-hidden bg-muted-brown/5 aspect-[4/3] relative">
        <Image
          src={kit.itemImage || 'https://static.wixstatic.com/media/395327_237f66a1b15449ecacd9aca54c86e036~mv2.png?originWidth=512&originHeight=384'}
          alt={kit.itemName || 'Dish Kit'}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex-1">
          <Link to={`/product/${kit._id}`}>
            <h3 className="font-heading text-3xl tracking-tight mb-2 group-hover:text-primary transition-colors">
              {kit.itemName}
            </h3>
          </Link>
          <p className="font-paragraph text-foreground/70 line-clamp-2 max-w-md">
            {kit.itemDescription}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
          <span className="font-heading text-2xl font-medium">
            {formatPrice(kit.itemPrice || 0, currency ?? DEFAULT_CURRENCY)}
          </span>
          <button
            disabled={addingItemId === kit._id}
            onClick={onAdd}
            className="bg-transparent border border-foreground text-foreground font-heading font-medium px-6 py-2 rounded-sm hover:bg-foreground hover:text-background transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingItemId === kit._id ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
