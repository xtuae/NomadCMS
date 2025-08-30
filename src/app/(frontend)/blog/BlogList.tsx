import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@/payload.config';
import Pagination from './Pagination';

interface BlogThumbnail {
  id: number;
  title: string;
  coverImage: string;
  slug: string;
}

interface BlogThumbnailsResponse {
  docs: BlogThumbnail[];
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

async function getBlogThumbnails(page: number = 1): Promise<BlogThumbnailsResponse> {
  try {
    const payload = await getPayload({ config });
    const data = await payload.find({
      collection: 'blogs',
      limit: 12,
      page,
      sort: '-publishedAt',
    });

    const docs = data.docs.map((blog) => {
      const coverImageUrl = (blog.coverImage as { url: string })?.url;
      return {
        id: blog.id,
        title: blog.title,
        coverImage: coverImageUrl || '/default-blog-image.jpg',
        slug: blog.slug,
      };
    });

    return {
      docs,
      totalPages: data.totalPages,
      hasNextPage: data.hasNextPage,
      hasPrevPage: data.hasPrevPage,
    };
  } catch (error) {
    console.error('Failed to fetch blog thumbnails:', error);
  }
  return { docs: [], totalPages: 0, hasNextPage: false, hasPrevPage: false };
}

export default async function BlogList({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page) || 1;
  const { docs: blogThumbnails, totalPages, hasNextPage, hasPrevPage } = await getBlogThumbnails(page);

  return (
    <>
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
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#de6076] transition duration-300">
                {blog.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
      <Pagination totalPages={totalPages} hasNextPage={hasNextPage} hasPrevPage={hasPrevPage} />
    </>
  );
}
