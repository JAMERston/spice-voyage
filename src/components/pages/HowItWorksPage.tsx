import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { HowItWorksSteps } from '@/entities';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HowItWorksPage() {
  const [steps, setSteps] = useState<HowItWorksSteps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<HowItWorksSteps>('howitworkssteps');
      setSteps(result.items.sort((a, b) => (a.stepNumber || 0) - (b.stepNumber || 0)));
    } catch (error) {
      console.error('Error loading steps:', error);
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
            className="text-center mb-16"
          >
            <h1 className="font-heading text-5xl md:text-6xl text-foreground mb-6">
              How It Works
            </h1>
            <p className="font-paragraph text-lg text-foreground max-w-3xl mx-auto">
              Three simple steps to cook authentic international dishes at home
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="w-full bg-background pb-20 md:pb-32">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-24">
          <div className="min-h-[600px]">
            {isLoading ? null : steps.length > 0 ? (
              <div className="space-y-24">
                {steps.map((step, index) => (
                  <motion.div
                    key={step._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                      index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      <div className="flex items-center justify-center">
                        <div className="w-48 h-48 rounded-full bg-primary flex items-center justify-center">
                          {step.icon ? (
                            <Image 
                              src={step.icon}
                              alt={step.title || 'Step icon'}
                              width={96}
                              className="w-24 h-24"
                            />
                          ) : (
                            <span className="font-heading text-7xl text-primary-foreground font-bold">
                              {step.stepNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                      <div className="mb-4">
                        <span className="font-heading text-lg text-primary font-semibold">
                          Step {step.stepNumber}
                        </span>
                      </div>
                      <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-6">
                        {step.title}
                      </h2>
                      <p className="font-paragraph text-lg text-foreground leading-relaxed mb-6">
                        {step.description}
                      </p>
                      {step.callToAction && (
                        <Link to="/shop">
                          <button className="bg-primary text-primary-foreground font-heading font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity">
                            {step.callToAction}
                          </button>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-paragraph text-lg text-foreground">Loading steps...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-background py-20 md:py-32">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="font-paragraph text-lg text-foreground max-w-2xl mx-auto mb-12">
              Browse our collection and start your culinary adventure today
            </p>
            <Link to="/shop">
              <button className="bg-primary text-primary-foreground font-heading font-semibold px-12 py-5 rounded-lg hover:opacity-90 transition-opacity text-lg">
                Shop Now
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
