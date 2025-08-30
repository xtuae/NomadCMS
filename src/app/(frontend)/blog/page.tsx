import React, { Suspense } from 'react';
import PageHeader from '../components/PageHeader';
import { getPayload } from 'payload';
import config from '@/payload.config';
import BlogList from './BlogList';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface HeaderBanner {
  title: string;
  subtitle: string;
  backgroundImageUrl: string;
}

async function getHeaderBanner(): Promise<HeaderBanner | null> {
  try {
    const payload = await getPayload({ config });
    const data = await payload.find({
      collection: 'pages',
      where: {
        title: {
          equals: 'Blog',
        },
      },
    });

    if (data?.docs?.[0]?.privacyHeader) {
      const header = data.docs[0].privacyHeader;
      const imageUrl = (header.backgroundImage as { url: string })?.url;

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

export default async function BlogPage({ searchParams }: { searchParams: { page?: string } }) {
  const headerBanner = await getHeaderBanner();

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
          <BlogList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
