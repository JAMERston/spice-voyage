import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { AboutSections } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const [sections, setSections] = useState<AboutSections[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<AboutSections>('aboutsections');
      setSections(result.items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
    } catch (error) {
      console.error('Error loading about sections:', error);
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
              About GlobalDish Kits
            </h1>
            <p className="font-paragraph text-lg text-foreground max-w-3xl mx-auto">
              Making international cooking accessible, affordable, and fun for everyone
            </p>
          </motion.div>
        </div>
      </section>
      {/* About Sections */}
      <section className="w-full bg-background pb-20 md:pb-32">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-24">
          <div className="min-h-[400px]">
            {isLoading ? null : sections.length > 0 ? (
              <div className="space-y-24">
                {sections.map((section, index) => (
                  <motion.div
                    key={section._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                      index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      {section.sectionImage && (
                        <div className="overflow-hidden rounded-2xl">
                          <Image 
                            src={section.sectionImage}
                            alt={section.sectionTitle || 'About section'}
                            width={600}
                            className="w-full h-auto"
                          />
                        </div>
                      )}
                    </div>
                    <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                      {section.sectionTitle && (
                        <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-6">
                          {section.sectionTitle}
                        </h2>
                      )}

                      {section.content && (
                        <div className="font-paragraph text-base text-foreground leading-relaxed whitespace-pre-line">
                          {section.content}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-paragraph text-lg text-foreground">Loading about information...</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Mission Statement */}
      <section className="w-full bg-background py-20 md:py-32">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center bg-background p-12 md:p-16 rounded-2xl border border-foreground/10"
          >
            <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-6">
              Our Mission
            </h2>
            <p className="font-paragraph text-lg text-foreground max-w-3xl mx-auto leading-relaxed">
              To make cooking international dishes easy and accessible for students, busy individuals, 
              and beginner home cooks. We believe everyone should be able to explore world cuisines 
              from the comfort of their own kitchen, without the hassle of sourcing exotic ingredients 
              or complicated recipes.
            </p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
