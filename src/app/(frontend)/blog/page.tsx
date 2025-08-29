import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@/payload.config';

interface BlogThumbnail {
  id: number;
  title: string;
  coverImage: string;
  slug: string;
}

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

    if ((data?.docs?.[0] as any)?.seo) {
      const seo = (data.docs[0] as any).seo;
      const imageUrl = (seo.metaImage as { url: string })?.url;

      return {
        title: seo.metaTitle || 'Our Blog',
        subtitle: seo.metaDescription || 'Insights and stories from the world of digital nomads.',
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

async function getBlogThumbnails(): Promise<BlogThumbnail[]> {
  try {
    const payload = await getPayload({ config });
    const data = await payload.find({
      collection: 'blogs',
      limit: 10,
      sort: '-publishedAt',
    });

    if (data?.docs) {
      return data.docs.map((blog) => {
        const coverImageUrl = (blog.coverImage as { url: string })?.url;
        return {
          id: blog.id,
          title: blog.title,
          coverImage: coverImageUrl || '/default-blog-image.jpg', // Fallback to a default image
          slug: blog.slug,
        };
      });
    }
  } catch (error) {
    console.error('Failed to fetch blog thumbnails:', error);
  }
  return [];
}

export default async function BlogPage() {
  const headerBanner = await getHeaderBanner();
  const blogThumbnails = await getBlogThumbnails();

  return (
    <div className="bg-white text-gray-800">
      {/* Header Banner Section */}
      {headerBanner && (
        <div
          className="relative bg-cover bg-center text-white py-24 px-4 sm:px-6 lg:px-8"
          style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${headerBanner.backgroundImageUrl})` }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              {headerBanner.title}
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-300">
              {headerBanner.subtitle}
            </p>
          </div>
        </div>
      )}

      {/* Blog Thumbnails Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogThumbnails.map((blog) => (
            <Link href={`/blog/${blog.slug}`} key={blog.id} className="group block bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
              <div className="relative w-full h-48">
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  style={{objectFit: 'cover'}}
                  unoptimized={true}
                />
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  style={{objectFit: 'cover'}}
                  unoptimized={true}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition duration-300">
                  {blog.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
