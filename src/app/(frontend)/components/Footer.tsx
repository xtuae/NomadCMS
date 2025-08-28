"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Media {
  id: number;
  alt: string;
  updatedAt: string;
  createdAt: string;
  url: string;
  thumbnailURL: string | null;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  focalX: number;
  focalY: number;
}

interface Link {
  id: string;
  label: string;
  url: string;
  icon?: Media;
}

interface ContactUs {
  address: string;
  email: string;
  phone: string;
  note: string;
}

interface FooterData {
  id: number;
  brand: {
    logo?: Media;
    title: string;
    description: string;
  };
  socialLinks?: Link[];
  quickLinks?: Link[];
  tools?: Link[];
  resources?: Link[];
  contactus: ContactUs;
  copyright: string;
  updatedAt: string;
  createdAt: string;
}

export default function Footer() {
  const [footer, setFooter] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const PAYLOAD_URL =
    process.env.NEXT_PUBLIC_PAYLOAD_URL || "https://nomadblob.vercel.app/api";

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${PAYLOAD_URL}/footer/1`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const prependUrl = (url: string) => {
          if (url.startsWith("/api/media")) {
            return `${PAYLOAD_URL}${url.replace(/^\/api/, "")}`;
          }
          return url;
        };

        // Process brand logo URL
        if (data.brand?.logo?.url) {
          data.brand.logo.url = prependUrl(data.brand.logo.url);
        }

        if (data.socialLinks) {
          data.socialLinks = data.socialLinks.map((link: Link) => {
            if (link.icon?.url) {
              const updatedIcon = { ...link.icon, url: prependUrl(link.icon.url) };
              return { ...link, icon: updatedIcon };
            }
            return link;
          });
        }
        setFooter(data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Failed to fetch footer data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, [PAYLOAD_URL]);

  if (loading) {
    return (
      <footer className="bg-gray-800 text-white py-8 px-6 md:px-14 mt-10">
        <div className="container mx-auto text-center">Loading footer...</div>
      </footer>
    );
  }

  if (error) {
    return (
      <footer className="bg-gray-800 text-white py-8 px-6 md:px-14 mt-10">
        <div className="container mx-auto text-center text-red-500">
          Error: {error}
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-800 text-white py-8 px-6 md:px-14 mt-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Brand Info */}
        <div className="col-span-1">
          {footer?.brand?.logo?.url && (
            <Image
              src={footer.brand.logo.url}
              alt={footer.brand.logo.alt || "Brand Logo"}
              width={120}
              height={80}
              unoptimized
              priority
              className="mb-4"
            />
          )}
          <p className="text-sm text-gray-400">{footer?.brand?.description}</p>
        </div>

        {/* Quick Links */}
        {footer?.quickLinks && footer.quickLinks.length > 0 && (
          <div>
            <h4 className="text-md font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {footer.quickLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    className="text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tools */}
        {footer?.tools && footer.tools.length > 0 && (
          <div>
            <h4 className="text-md font-semibold mb-3">Tools</h4>
            <ul className="space-y-2">
              {footer.tools.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    className="text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              
            </ul>
          </div>
        )}

        {/* Resources */}
        {footer?.resources && footer.resources.length > 0 && (
          <div>
            <h4 className="text-md font-semibold mb-3">Resources</h4>
            <ul className="space-y-2">
              {footer.resources.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    className="text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact Us */}
        {footer?.contactus && (
          <div>
            <h4 className="text-md font-semibold mb-3">Contact Us</h4>
            <p className="text-sm text-gray-400 mb-2 whitespace-pre-line">
              {footer.contactus.address}
            </p>
            <p className="text-sm text-gray-400 mb-2">
              Email:{" "}
              <a
                href={`mailto:${footer.contactus.email}`}
                className="hover:text-yellow-400 transition-colors"
              >
                {footer.contactus.email}
              </a>
            </p>
            <p className="text-sm text-gray-400 mb-2">
              Phone:{" "}
              <a
                href={`tel:${footer.contactus.phone}`}
                className="hover:text-yellow-400 transition-colors"
              >
                {footer.contactus.phone}
              </a>
            </p>
            <p className="text-xs text-gray-500 mt-3">
              {footer.contactus.note}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        {/* Copyright */}
        <div className="mb-4 md:mb-0">
          {footer?.copyright || "© 2025 NomadNetwork. All rights reserved."}
        </div>

        {/* Social Links */}
        {footer?.socialLinks && footer.socialLinks.length > 0 && (
          <div className="flex space-x-4">
            {footer.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75 transition-opacity"
              >
                {link.icon?.url ? (
                  <Image
                    src={link.icon.url}
                    alt={link.label}
                    width={24}
                    height={24}
                    unoptimized
                  />
                ) : (
                  <span className="text-lg">{link.label}</span>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
