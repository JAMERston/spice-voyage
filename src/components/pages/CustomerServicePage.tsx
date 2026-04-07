import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomerServicePage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqItems = [
    {
      question: "What is included in the meal kit?",
      answer: "Each GlobalDishKits product includes pre-measured spices, seasonings, and cooking instructions needed to prepare the dish."
    },
    {
      question: "What ingredients do I need to add?",
      answer: "Customers need to prepare fresh ingredients such as meat, vegetables, and rice depending on the selected meal kit."
    },
    {
      question: "Is it easy to cook?",
      answer: "Yes. The meal kits are designed for beginners and include simple step-by-step instructions that are easy to follow."
    },
    {
      question: "How do I order?",
      answer: "Orders can be placed through our website or by contacting us via social media platforms."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We currently accept payments through GCash via QR code."
    },
    {
      question: "When will I receive my order?",
      answer: "Orders are processed through a pre-order system and will be delivered or made available for meet-up based on the scheduled date."
    },
    {
      question: "Can I choose different dishes?",
      answer: "Yes. Customers can choose from our available meal kits such as Biryani, Japanese Curry, and Bulgogi."
    },
    {
      question: "How long can I store the meal kit?",
      answer: "Meal kits should be stored in a cool, dry place and are best used within a few days to ensure freshness."
    },
    {
      question: "Are the ingredients safe and properly handled?",
      answer: "Yes. All ingredients are carefully measured, packed, and handled in a clean environment to ensure quality and safety."
    },
    {
      question: "Do you offer discounts or promos?",
      answer: "Yes. We occasionally offer bundle deals and promotional discounts for multiple purchases."
    },
    {
      question: "Can beginners really cook this?",
      answer: "Yes. The kits are specifically designed for individuals with little to no cooking experience."
    },
    {
      question: "Why choose GlobalDishKits?",
      answer: "GlobalDishKits offers affordable, easy-to-cook meal kits that allow you to enjoy international dishes without the hassle of sourcing ingredients."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph">
      <Header />

      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 px-6 bg-foreground text-background">
        <div className="max-w-[100rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-heading text-5xl md:text-7xl tracking-tighter mb-6">
              Customer Service
            </h1>
            <p className="font-paragraph text-lg text-background/80 max-w-2xl">
              We're here to help. Find answers to common questions and learn about our shipping and service policies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shipping Info Section */}
      <section id="shipping" className="w-full py-24 md:py-32 px-6 border-b border-foreground/10">
        <div className="max-w-[100rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl tracking-tighter mb-8 text-primary">
              Shipping Information
            </h2>
            <div className="max-w-3xl">
              <p className="font-paragraph text-lg text-foreground/80 leading-relaxed mb-6">
                At GlobalDishKits, we offer flexible delivery options to ensure your meal kits arrive conveniently:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="text-primary font-bold text-xl shrink-0">•</span>
                  <span className="font-paragraph text-base text-foreground/80">
                    <strong className="text-foreground">Self-Delivery:</strong> We personally deliver your orders to your doorstep, ensuring careful handling and freshness.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="text-primary font-bold text-xl shrink-0">•</span>
                  <span className="font-paragraph text-base text-foreground/80">
                    <strong className="text-foreground">Third-Party Services:</strong> For wider coverage, we partner with trusted delivery services like Grab to bring your meal kits to you safely and on time.
                  </span>
                </li>
              </ul>
              <p className="font-paragraph text-base text-foreground/70 mt-8">
                Delivery times depend on your location and the scheduled pre-order date. You'll receive confirmation with your delivery details upon order placement.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full py-24 md:py-32 px-6">
        <div className="max-w-[100rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl tracking-tighter text-primary">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="max-w-3xl space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between gap-4 p-6 bg-foreground/5 hover:bg-foreground/10 transition-colors duration-300 rounded-lg text-left group"
                >
                  <span className="font-heading text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-background border-l-4 border-primary">
                      <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
