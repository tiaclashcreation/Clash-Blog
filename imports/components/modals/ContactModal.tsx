import React, { useState } from 'react';
import { VSModal } from '../ui/vs-modal';
import { AnimatedButton } from '../marble-buttons/AnimatedButton';
import axios from 'axios';
// Import fetch for API calls
import { sendToKit } from '../../api/crm-integration';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  position: string;
  building: string;
  inquiry: string;
  company: string;
  phone: string;
  interests: string[];
  consent: boolean;
}

interface KitResponse {
  success: boolean;
  error?: string;
  details?: any;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    position: '',
    building: '',
    inquiry: '',
    company: '',
    phone: '',
    interests: [],
    consent: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [kitIntegrationStatus, setKitIntegrationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // We no longer need the sendToKit function as we're using the centralized CRM integration

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the contact form ID from environment variables
      const contactFormId = typeof import.meta !== 'undefined' && import.meta.env 
        ? import.meta.env.VITE_KIT_CONTACT_FORM_ID 
        : process.env.VITE_KIT_CONTACT_FORM_ID;

      // Always send to Kit
      const kitData = {
        email: formData.email,
        first_name: formData.name,
        fields: {
          full_name: formData.name,
          company: formData.company || '',
          position: formData.position || '',
          phone: formData.phone || '',
          interests: formData.interests.join(', '),
          inquiry: formData.inquiry || '',
          what_are_you_building: formData.building || '',
          building: formData.building || '',
          // Always set mailing list opt-in to true since we're removing consent
          mailing_list_opt_in: true,
          source: 'contact_form',
          submission_date: new Date().toISOString()
        },
        tags: [
          'contact-form-submission',
          'mailing-list-opt-in', // Always add this tag since we're removing consent
          ...formData.interests.map(interest => `interest-${interest}`)
        ]
      };

      // Send to Kit
      console.log('Sending contact form data to Kit:', kitData);
      const kitResponse = await sendToKit(kitData, contactFormId);
      console.log('Kit integration response:', kitResponse);

      // Show success state
      setSubmitSuccess(true);
      setKitIntegrationStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        position: '',
        building: '',
        inquiry: '',
        company: '',
        phone: '',
        interests: [],
        consent: false
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was an error submitting your information. Please try again.');
      setKitIntegrationStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VSModal
      isOpen={isOpen}
      onClose={onClose}
      title="Get in Touch"
      description="We'd love to hear about your project and how we can help"
      width="lg"
    >
      <div className="bg-[var(--theme-bg-primary)] -m-5 -mt-6 md:-m-6 md:-mt-6 p-5 md:p-6 rounded-b-lg">
        {submitSuccess ? (
          <div className="text-center py-4 md:flex md:items-center md:justify-center md:space-x-5 md:py-2">
            <div className="w-12 h-12 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-0 md:mx-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="md:text-left">
              <h3 className="text-lg font-semibold text-theme-primary mb-1">Thank You!</h3>
              <p className="text-theme-secondary text-sm mb-2">
                Your message has been sent successfully. We'll get back to you shortly.
                {kitIntegrationStatus === 'success' && (
                  <span className="block text-xs mt-1 text-green-600">
                    <span className="inline-block mr-1">✓</span> Added to our contact list
                  </span>
                )}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            {/* Left Column */}
            <div className="md:space-y-3">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-theme-primary font-medium mb-1 text-sm">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--theme-border-light)] bg-[var(--theme-bg-light)] text-theme-primary focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent-tertiary)] transition-colors"
                  placeholder="Your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-theme-primary font-medium mb-1 text-sm">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--theme-border-light)] bg-[var(--theme-bg-light)] text-theme-primary focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent-tertiary)] transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              
              {/* Position Field */}
              <div>
                <label htmlFor="position" className="block text-theme-primary font-medium mb-1 text-sm">
                  Your Position
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--theme-border-light)] bg-[var(--theme-bg-light)] text-theme-primary focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent-tertiary)] transition-colors"
                  placeholder="Founder, Marketing Director, etc."
                />
              </div>
              
              {/* What They're Building Field */}
              <div>
                <label htmlFor="building" className="block text-theme-primary font-medium mb-1 text-sm">
                  What Are You Building?
                </label>
                <input
                  type="text"
                  id="building"
                  name="building"
                  value={formData.building}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--theme-border-light)] bg-[var(--theme-bg-light)] text-theme-primary focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent-tertiary)] transition-colors"
                  placeholder="App, SaaS, E-commerce, etc."
                />
              </div>
            </div>

            {/* Right Column - Inquiry Field */}
            <div className="h-full">
              <label htmlFor="inquiry" className="block text-theme-primary font-medium mb-1 text-sm">
                Your Inquiry <span className="text-red-500">*</span>
              </label>
              <textarea
                id="inquiry"
                name="inquiry"
                value={formData.inquiry}
                onChange={handleChange}
                required
                rows={3}
                className="w-full h-[calc(100%-1.75rem)] px-3 py-1.5 rounded-lg border border-[var(--theme-border-light)] bg-[var(--theme-bg-light)] text-theme-primary focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent-tertiary)] transition-colors resize-none"
                placeholder="Tell us how we can help..."
              />
            </div>
            
            {/* Error Message and Submit Button - Full Width */}
            <div className="md:col-span-2 mt-2">
              {submitError && (
                <div className="p-2 mb-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {submitError}
                </div>
              )}
              
              {/* Submit Button */}
              <div className="pt-1">
                <AnimatedButton
                  type="submit"
                  text={isSubmitting ? "Sending..." : "Send Inquiry"}
                  variant="start"
                  saturation="high"
                  size="md"
                  disabled={isSubmitting}
                  className="w-full"
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </VSModal>
  );
};

export default ContactModal; 