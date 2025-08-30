import React, { Suspense } from 'react';
import PageHeader from '../components/PageHeader';
import { getPayload } from 'payload';
import config from '@/payload.config';
import BlogList from './BlogList';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getPayloadUrl } from '@/utils/getPayloadUrl';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

interface HeaderBanner {
  title: string;
  subtitle: string;
  backgroundImageUrl: string;
}

async function getHeaderBanner(): Promise<HeaderBanner | null> {
  try {
    const payloadBaseUrl = getPayloadUrl();
    const rootUrl = payloadBaseUrl?.replace(/\/api$/, '').replace(/\/$/, '');
    const apiBaseUrl = `${rootUrl}/api`;

    const url = `${apiBaseUrl}/pages?where[title][equals]=Blog`;
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status} from URL: ${url}`);
      return null;
    }

    const data = await res.json();

    if (data?.docs?.[0]?.privacyHeader) {
      const header = data.docs[0].privacyHeader;
      let imageUrl = header.backgroundImage?.url;

      if (imageUrl && imageUrl.startsWith('/')) {
        imageUrl = `${rootUrl}${imageUrl}`;
      }

      return {
        title: header.headline || 'Our Blog',
        subtitle: header.subheadline || 'Insights and stories from the world of digital nomads.',
        backgroundImageUrl: imageUrl || '/blog-banner.jpg',
      };
    }
  } catch (error) {
    console.error('Failed to fetch blog header banner:', error);
  }
  return {
    title: 'Our Blog',
    subtitle: 'Insights and stories from the world of digital nomads.',
    backgroundImageUrl: '/blog-banner.jpg',
  };
}

export default async function BlogPage({ searchParams }: PageProps) {
  const headerBanner = await getHeaderBanner();
  const params = await searchParams;

  return (
    <div className="bg-white text-gray-800">
      {headerBanner && (
        <PageHeader
          title={headerBanner.title}
          backgroundImage={headerBanner.backgroundImageUrl}
          subheadline={headerBanner.subtitle}
        />
      )}
      {/* Blog Thumbnails Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<LoadingSpinner />}>
          <BlogList searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}
