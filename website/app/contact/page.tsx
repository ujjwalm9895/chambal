'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, MenuItem } from '@/types';
import Breadcrumbs from '@/components/Breadcrumbs';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

interface SiteSettings {
  contactEmail?: string;
  contactFormTitle?: string;
  contactFormSubtitle?: string;
}

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    agreeToTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_URL}/site-settings`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
        });
        if (response.ok) {
          setSettings(await response.json());
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms & Conditions');
      return;
    }

    setSubmitting(true);
    try {
      // Contact form submission logic - can be integrated with email service later
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '', agreeToTerms: false });
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} />

      {/* Contact Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            {settings.contactFormTitle || 'Contact Us'}
          </h1>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-8">
            {settings.contactFormSubtitle || 'Send a Message'}
          </h2>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <p className="text-green-800 font-semibold">
                Thank you! Your message has been sent successfully. We'll get back to you soon.
              </p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Message"
                    rows={8}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="mt-1 mr-2"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                    I have read and agree to the Terms & Conditions
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <a
                    href={`mailto:${settings.contactEmail || 'contact@chambalsandesh.com'}`}
                    className="text-blue-600 font-semibold hover:underline text-lg"
                  >
                    {settings.contactEmail || 'contact@chambalsandesh.com'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
