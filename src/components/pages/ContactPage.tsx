import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ContactInquiries } from '@/entities';
import { BaseCrudService } from '@/integrations';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Mail, Send, Twitter } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await BaseCrudService.create<ContactInquiries>('contactinquiries', {
        _id: crypto.randomUUID(),
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        submissionDate: new Date().toISOString()
      });
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
              Get In Touch
            </h1>
            <p className="font-paragraph text-lg text-foreground max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>
      {/* Contact Content */}
      <section className="w-full bg-background pb-20 md:pb-32">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl text-foreground mb-8">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-paragraph text-base text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-foreground/20 bg-background text-foreground font-paragraph text-base focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-paragraph text-base text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-foreground/20 bg-background text-foreground font-paragraph text-base focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block font-paragraph text-base text-foreground mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-foreground/20 bg-background text-foreground font-paragraph text-base focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block font-paragraph text-base text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-foreground/20 bg-background text-foreground font-paragraph text-base focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground font-heading font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                {submitSuccess && (
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary">
                    <p className="font-paragraph text-base text-primary text-center">
                      Thank you! Your message has been sent successfully.
                    </p>
                  </div>
                )}
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <h2 className="font-heading text-3xl text-foreground mb-8">
                Contact Information
              </h2>

              <div className="space-y-8 mb-12">
                <div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                    Email Us
                  </h3>
                  <a
                    href="mailto:hello@globaldishkits.com"
                    className="flex items-center gap-3 font-paragraph text-base text-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="w-6 h-6" />
                    hello@globaldishkits.com
                  </a>
                </div>

                <div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                    Follow Us
                  </h3>
                  <div className="flex gap-4">
                    <a
                      href="https://www.facebook.com/Globaldishkit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 hover:bg-foreground/5 rounded-lg transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-6 h-6 text-foreground hover:text-primary transition-colors" />
                    </a>
                    <a
                      href="https://www.instagram.com/glob_aldishkit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 hover:bg-foreground/5 rounded-lg transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-6 h-6 text-foreground hover:text-primary transition-colors" />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 hover:bg-foreground/5 rounded-lg transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-6 h-6 text-foreground hover:text-primary transition-colors" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-background p-8 rounded-2xl border border-foreground/10">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                  Business Hours
                </h3>
                <div className="space-y-2 font-paragraph text-base text-foreground">
                  <p>Monday - Friday: 10:00 AM - 10:00 PM</p>
                  <p>Saturday-Friday: Closed</p>

                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
