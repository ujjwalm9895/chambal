'use client';

import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '@/lib/actions/settings';
import toast from 'react-hot-toast';
import { FiSave, FiUpload, FiX } from 'react-icons/fi';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    site_name: '',
    site_tagline: '',
    site_logo: null,
    site_favicon: null,
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    facebook_url: '',
    twitter_url: '',
    instagram_url: '',
    youtube_url: '',
    linkedin_url: '',
    default_seo_title: '',
    default_seo_description: '',
    default_seo_keywords: '',
    posts_per_page: 20,
    enable_comments: false,
    enable_registration: false,
    maintenance_mode: false,
    maintenance_message: '',
    google_analytics_id: '',
    facebook_pixel_id: '',
  });
  const [siteLogoUrl, setSiteLogoUrl] = useState(null);
  const [siteFaviconUrl, setSiteFaviconUrl] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const settings = await getSettings();
      
      setFormData({
        site_name: settings.siteName || '',
        site_tagline: settings.siteTagline || '',
        contact_email: settings.contactEmail || '',
        contact_phone: settings.contactPhone || '',
        contact_address: settings.contactAddress || '',
        facebook_url: settings.facebookUrl || '',
        twitter_url: settings.twitterUrl || '',
        instagram_url: settings.instagramUrl || '',
        youtube_url: settings.youtubeUrl || '',
        linkedin_url: settings.linkedinUrl || '',
        default_seo_title: settings.defaultSeoTitle || '',
        default_seo_description: settings.defaultSeoDescription || '',
        default_seo_keywords: settings.defaultSeoKeywords || '',
        posts_per_page: settings.postsPerPage || 20,
        enable_comments: settings.enableComments || false,
        enable_registration: settings.enableRegistration || false,
        maintenance_mode: settings.maintenanceMode || false,
        maintenance_message: settings.maintenanceMessage || '',
        google_analytics_id: settings.googleAnalyticsId || '',
        facebook_pixel_id: settings.facebookPixelId || '',
      });
      
      setSiteLogoUrl(settings.siteLogo || null);
      setSiteFaviconUrl(settings.siteFavicon || null);
    } catch (error) {
      console.error('Settings fetch error:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setSiteLogoUrl(URL.createObjectURL(file));
    }
  };

  const handleFaviconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaviconFile(file);
      setSiteFaviconUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // Prepare form data for multipart/form-data (for file uploads)
      const submitData = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'site_logo' && key !== 'site_favicon') {
          if (formData[key] !== null && formData[key] !== undefined) {
            submitData.append(key, formData[key]);
          }
        }
      });
      
      // Add files if selected
      if (logoFile) {
        submitData.append('site_logo', logoFile);
      }
      if (faviconFile) {
        submitData.append('site_favicon', faviconFile);
      }
      
      const result = await updateSettings(submitData);
      
      toast.success(result.message || 'Settings saved successfully');
      fetchSettings(); // Reload to get updated URLs
    } catch (error) {
      console.error('Settings save error:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Site Settings</h1>
            <p className="text-gray-600 mt-1">Manage your website settings and configuration</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Site Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Site Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name *
                  </label>
                  <input
                    type="text"
                    name="site_name"
                    value={formData.site_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Tagline
                  </label>
                  <input
                    type="text"
                    name="site_tagline"
                    value={formData.site_tagline}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site Logo
                    </label>
                    {siteLogoUrl && (
                      <div className="mb-2">
                        <img src={siteLogoUrl} alt="Logo" className="h-20 object-contain" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site Favicon
                    </label>
                    {siteFaviconUrl && (
                      <div className="mb-2">
                        <img src={siteFaviconUrl} alt="Favicon" className="h-16 w-16 object-contain" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFaviconChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Address
                  </label>
                  <textarea
                    name="contact_address"
                    value={formData.contact_address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* Social Media */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Social Media Links</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebook_url"
                    value={formData.facebook_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitter_url"
                    value={formData.twitter_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    name="instagram_url"
                    value={formData.instagram_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    name="youtube_url"
                    value={formData.youtube_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* SEO Defaults */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">SEO Defaults</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default SEO Title (max 70 characters)
                  </label>
                  <input
                    type="text"
                    name="default_seo_title"
                    value={formData.default_seo_title}
                    onChange={handleChange}
                    maxLength={70}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.default_seo_title?.length || 0}/70 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default SEO Description (max 160 characters)
                  </label>
                  <textarea
                    name="default_seo_description"
                    value={formData.default_seo_description}
                    onChange={handleChange}
                    maxLength={160}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.default_seo_description?.length || 0}/160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default SEO Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="default_seo_keywords"
                    value={formData.default_seo_keywords}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            </section>

            {/* General Settings */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Posts Per Page
                  </label>
                  <input
                    type="number"
                    name="posts_per_page"
                    value={formData.posts_per_page}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enable_comments"
                    name="enable_comments"
                    checked={formData.enable_comments}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="enable_comments" className="text-sm font-medium text-gray-700">
                    Enable Comments
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enable_registration"
                    name="enable_registration"
                    checked={formData.enable_registration}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="enable_registration" className="text-sm font-medium text-gray-700">
                    Allow User Registration
                  </label>
                </div>
              </div>
            </section>

            {/* Maintenance Mode */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Maintenance Mode</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="maintenance_mode"
                    name="maintenance_mode"
                    checked={formData.maintenance_mode}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="maintenance_mode" className="text-sm font-medium text-gray-700">
                    Enable Maintenance Mode
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maintenance Message
                  </label>
                  <textarea
                    name="maintenance_message"
                    value={formData.maintenance_message}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Message to display during maintenance..."
                  />
                </div>
              </div>
            </section>

            {/* Analytics */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Analytics</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Analytics Tracking ID
                  </label>
                  <input
                    type="text"
                    name="google_analytics_id"
                    value={formData.google_analytics_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook Pixel ID
                  </label>
                  <input
                    type="text"
                    name="facebook_pixel_id"
                    value={formData.facebook_pixel_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="123456789012345"
                  />
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="w-5 h-5" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
