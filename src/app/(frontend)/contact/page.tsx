"use client";

import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import PageHeader from '../components/PageHeader';

interface ContactPageData {
  headline: string;
  subheadline: string;
  backgroundImageUrl: string | null;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

async function getContactPageData(): Promise<ContactPageData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL?.endsWith('/')
      ? process.env.NEXT_PUBLIC_PAYLOAD_URL.slice(0, -1)
      : process.env.NEXT_PUBLIC_PAYLOAD_URL;
    const url = `${baseUrl}/pages/6`; // Fetch data using the direct ID 6
    const res = await fetch(url);
    const pageData = await res.json();

    if (pageData) {
      const CMS_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL?.replace(/\/api$/, "") || "";
      const backgroundImageUrl = pageData.Contact_hero?.backgroundImage?.url
        ? `${CMS_URL}${pageData.Contact_hero.backgroundImage.url}`
        : null;

      return {
        headline: pageData.Contact_hero?.headline || "Contact",
        subheadline: pageData.Contact_hero?.subheadline || "Get in touch with us here.",
        backgroundImageUrl: backgroundImageUrl,
        contactEmail: pageData.contactEmail || "N/A",
        contactPhone: pageData.contactPhone || "N/A",
        contactAddress: pageData.contactAddress || "N/A",
      };
    }
  } catch (error) {
    console.error('Failed to fetch contact page data:', error);
  }
  return null;
}

export default function ContactPage() {
  const [contactData, setContactData] = useState<ContactPageData | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadContactData = async () => {
      const data = await getContactPageData();
      setContactData(data);
    };
    loadContactData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
    };

    try {
      // Send email using EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_CUS_TEMPLATE_ID || '', // Using the custom template ID
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
      );

      // Send data to CMS
      const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL?.endsWith('/')
        ? process.env.NEXT_PUBLIC_PAYLOAD_URL.slice(0, -1)
        : process.env.NEXT_PUBLIC_PAYLOAD_URL;
      const cmsUrl = `${baseUrl}/api/forms`; // Corrected CMS endpoint for Payload forms collection

      await fetch(cmsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message, formType: 'contact' }), // Include formType
      });

      setStatus('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      setStatus('Failed to send message.');
    }
  };

  return (
    <main className="bg-gray-50">
      <PageHeader
        title={contactData?.headline || 'Contact'}
        backgroundImage={contactData?.backgroundImageUrl || null}
        subheadline={contactData?.subheadline}
      />
      <div className="container mx-auto my-12 p-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Column: Contact Info */}
            <div className="p-8 bg-gray-800 text-white space-y-8">
              <div>
                <h3 className="text-3xl font-bold mb-3">Contact Information</h3>
                <p className="text-gray-300">
                  Have a question or want to work with us? Fill out the form, and we&#39;ll get back to you.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <span>{contactData?.contactEmail}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  <span>{contactData?.contactPhone}</span>
                </div>
                <div className="flex items-start space-x-4">
                  <svg className="w-6 h-6 text-cyan-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <p className="whitespace-pre-line">{contactData?.contactAddress}</p>
                </div>
              </div>
              <div className="flex space-x-4 mt-8">
                <a href="#" className="text-gray-400 hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29h-3.128V11.69h3.128V9.23c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.795.715-1.795 1.763v2.31h3.587l-.467 3.02h-3.12V24h5.713c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z" /></svg></a>
                <a href="#" className="text-gray-400 hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.585.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" /></svg></a>
                <a href="#" className="text-gray-400 hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085a4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg></a>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 transition"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 transition"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#de6076] text-white font-semibold rounded-md shadow-md hover:bg-[#de6076]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#de6076] transition-transform transform hover:scale-105"
              >
                Send Message
              </button>
                {status && <p className="mt-4 text-center text-sm text-gray-600">{status}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
