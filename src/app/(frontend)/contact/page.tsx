"use client";

import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

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
    <main >
      {contactData?.backgroundImageUrl && (
        <div
          className="relative h-64 bg-cover bg-center flex items-center justify-center text-white"
          style={{ backgroundImage: `url(${contactData.backgroundImageUrl})` }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <h1 className="relative z-10 text-4xl font-bold">{contactData.headline}</h1>
        </div>
      )}
      <div className="container mx-auto mt-8">
        <h2 className="text-3xl font-bold mb-4">{contactData?.headline || "Contact"}</h2>
        <p className="text-lg mb-6">{contactData?.subheadline || "Get in touch with us here."}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p>{contactData?.contactEmail}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Phone</h3>
            <p>{contactData?.contactPhone}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Address</h3>
            <p className="whitespace-pre-line">{contactData?.contactAddress}</p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-4">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                rows={4}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700"
            >
              Send Message
            </button>
            {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
          </form>
        </div>
      </div>
    </main>
  )
}
