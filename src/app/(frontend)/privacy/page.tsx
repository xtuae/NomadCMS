'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// === Types ===
interface PrivacyHeader {
  headline: string;
  subheadline: string;
  backgroundImage?: {
    id: number;
    alt?: string;
    url: string;
  };
}

import React from 'react'; // Explicitly import React for JSX namespace

// === Types ===
interface PrivacyHeader {
  headline: string;
  subheadline: string;
  backgroundImage?: {
    id: number;
    alt?: string;
    url: string;
  };
}

interface LexicalNode {
  type: string;
  format: string | number; // Updated to allow number for format
  indent?: number;
  version?: number;
  children?: LexicalNode[];
  direction?: string;
  textStyle?: string;
  textFormat?: number;
  mode?: string;
  text?: string;
  tag?: string;
  value?: number;
  start?: number;
  listType?: string;
  fields?: {
    url: string;
    newTab: boolean;
    linkType: string;
  };
  id?: string;
}

interface PrivacyPolicyPageData {
  id: number;
  title: string;
  slug: string;
  pageType: string;
  privacyHeader: PrivacyHeader;
  privacyText: {
    root: LexicalNode;
  };
}

export default function PrivacyPolicyPage() {
  const [pageData, setPageData] = useState<PrivacyPolicyPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        // Assuming page ID 4 for privacy policy page, adjust as needed for your CMS
        const url = `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/pages/4`; 
        console.log('Fetching Privacy Policy Page:', url);

        const res = await fetch(url);
        const data: PrivacyPolicyPageData = await res.json();

        console.log('Fetched Privacy Policy Data:', data);

        if (data) {
          setPageData(data);
        }
      } catch (error) {
        console.error('Failed to fetch /privacy-policy page:', error);
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

  const { privacyHeader, privacyText } = pageData;

  // Ensure all top-level data objects exist before rendering
  if (!privacyHeader || !privacyText) {
    return <div className="flex items-center justify-center min-h-screen">Privacy Policy page data is incomplete. Please check CMS configuration.</div>;
  }

  // Build proper image URL for privacyHeader
  const imageUrl = privacyHeader?.backgroundImage?.url?.startsWith('/api/media')
    ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL?.replace(/\/api$/, '')}${privacyHeader.backgroundImage.url}`
    : privacyHeader?.backgroundImage?.url;

  // Helper function to render Lexical nodes
  const renderLexicalNodes = (nodes: LexicalNode[], keyPrefix: string = ''): React.ReactNode => {
    return nodes.map((node, index) => {
      const key = `${keyPrefix}-${node.id || index}`;

      if (node.type === 'text') {
        let textContent: React.ReactNode = node.text;
        if (node.format === 1) { // Bold
          textContent = <strong key={key}>{textContent}</strong>;
        }
        return textContent;
      }

      if (node.type === 'paragraph') {
        // Check if the paragraph contains a bold text node that might represent a heading
        const firstChild = node.children?.[0];
        if (firstChild && firstChild.type === 'text' && firstChild.format === 1) {
          return (
            <h2 key={key} className="text-2xl sm:text-3xl font-bold mb-4 mt-6">
              {renderLexicalNodes(node.children || [], key)}
            </h2>
          );
        }
        return (
          <p key={key} className="text-base sm:text-lg leading-relaxed mb-4">
            {node.children && renderLexicalNodes(node.children || [], key)}
          </p>
        );
      }

      if (node.type === 'list') {
        const ListTag = node.listType === 'bullet' ? 'ul' : 'ol';
        return (
          <ListTag key={key} className={`list-${node.listType || 'disc'} pl-5 mb-4`}>
            {node.children && renderLexicalNodes(node.children || [], key)}
          </ListTag>
        );
      }

      if (node.type === 'listitem') {
        return (
          <li key={key} className="text-base sm:text-lg leading-relaxed mb-2">
            {node.children && renderLexicalNodes(node.children || [], key)}
          </li>
        );
      }

      if (node.type === 'link' && node.fields?.url) {
        return (
          <a
            key={key}
            href={node.fields.url}
            target={node.fields.newTab ? '_blank' : '_self'}
            rel={node.fields.newTab ? 'noopener noreferrer' : ''}
            className="text-blue-600 hover:underline"
          >
            {node.children && renderLexicalNodes(node.children || [], key)}
          </a>
        );
      }

      if (node.children) {
        return <React.Fragment key={key}>{renderLexicalNodes(node.children || [], key)}</React.Fragment>;
      }

      return null;
    });
  };

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
              alt={privacyHeader?.backgroundImage?.alt || "Privacy Policy Main Banner background"}
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
          <h4 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            {privacyHeader.headline}
          </h4>
          <p className="text-lg sm:text-xl mb-8">{privacyHeader.subheadline}</p>
        </div>
      </div>

      {/* Privacy Policy Content Section */}
      <section className="bg-white text-gray-800 py-16 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto">
          {privacyText.root.children && renderLexicalNodes(privacyText.root.children, 'privacy-content')}
        </div>
      </section>
    </>
  );
}
