'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// Icons
import { Mail, MapPin } from 'lucide-react';

// === Types ===
interface MainBanner {
  heading: string;
  subheading: string;
  backgroundImage?: {
    url: string;
    alt?: string;
  };
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface ContactItem {
  id: string;
  title: string;
  email: string;
}

interface AddressInfo {
  company: string;
  street: string;
  city: string;
  phone: string;
}

interface SupportPageData {
  id: number;
  main_banner: MainBanner;
  faq: FaqItem[];
  contacts: ContactItem[];
  address: AddressInfo;
}

export default function SupportPage() {
  const [pageData, setPageData] = useState<SupportPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null); // State to manage open FAQ item

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        // Assuming page ID 3 for support page, adjust as needed for your CMS
        const url = `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/pages/3`; 
        console.log('Fetching Support Page:', url);

        const res = await fetch(url);
        const data: SupportPageData = await res.json();

        console.log('Fetched Support Data:', data);

        if (data) {
          setPageData(data);
        }
      } catch (error) {
        console.error('Failed to fetch /support page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!pageData) {
    return <div className="flex items-center justify-center min-h-screen">Failed to load data.</div>;
  }

  const {
    main_banner,
    faq,
    contacts,
    address,
  } = pageData;

  // Ensure all top-level data objects exist before rendering
  if (!main_banner || !faq || !contacts || !address) {
    return <div className="flex items-center justify-center min-h-screen">Support page data is incomplete. Please check CMS configuration.</div>;
  }
  
  // Build proper image URL for main_banner
  const imageUrl = main_banner?.backgroundImage?.url?.startsWith('/api/media')
    ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL?.replace(/\/api$/, '')}${main_banner.backgroundImage.url}`
    : main_banner?.backgroundImage?.url;

  return (
    <>
      {/* Main Banner Section */}
      <div
        className="relative w-full min-h-[60vh] px-4 py-10 sm:py-20 flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Background Image */}
        {imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={imageUrl || "/fallback.webp"}
              alt={main_banner?.backgroundImage?.alt || "Support Main Banner background"}
              fill
              className="object-cover"
              priority
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-xl z-10 mt-16 sm:mt-28 text-white">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            {main_banner.heading}
          </h1>
          <p className="text-lg sm:text-xl mb-8">{main_banner.subheading}</p>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="bg-white text-gray-800 py-16 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faq.map((item, index) => (
              <div key={item.id || index} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer" onClick={() => toggleFaq(item.id)}>
                <h3 className="text-xl font-semibold mb-2 flex items-center justify-between">
                  <span className="flex items-center">
                    {/* <HelpCircle className="w-5 h-5 text-blue-600 mr-2" /> */}
                    {item.question}
                  </span>
                  {/* Optional: Add an icon to indicate expand/collapse state */}
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                      openFaqId === item.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </h3>
                {openFaqId === item.id && (
                  <p className="text-gray-700 ml-7 mt-4 animate-fade-in">{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts and Address Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 bg-gray-100 text-gray-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contacts Section (Left) */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10">Get in Touch</h2>
            <div className="space-y-6"> {/* Changed to space-y-6 for vertical stacking */}
              {contacts.map((contact, index) => (
                <div key={contact.id || index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <Mail className="w-8 h-8 text-green-600 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold mb-2">{contact.title}</h4>
                  <p className="text-gray-700">
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                      {contact.email}
                    </a>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Address Section (Right) */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10">Our Office</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <p className="text-lg font-semibold">{address.company}</p>
              <p className="text-gray-700">{address.street}</p>
              <p className="text-gray-700">{address.city}</p>
              <p className="text-gray-700 mb-6">Phone: <a href={`tel:${address.phone}`} className="text-blue-600 hover:underline">{address.phone}</a></p>
              
              {/* Google Maps Live Location */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Find Us on the Map</h3>
                <div className="aspect-w-16 aspect-h-9 w-full h-64 rounded-lg overflow-hidden shadow-md">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(`${address.street}, ${address.city}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
