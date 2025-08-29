import React from 'react';
import { convertToHtml } from '@/utils/lexicalToHtml';
import BlogPostClientPage from './BlogPostClientPage';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  publishDate: string;
  contentHtml: string;
  imageUrl: string;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL?.endsWith('/')
      ? process.env.NEXT_PUBLIC_PAYLOAD_URL.slice(0, -1)
      : process.env.NEXT_PUBLIC_PAYLOAD_URL;
    const url = `${baseUrl}/blogs?where[slug][equals]=${slug}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.docs && data.docs.length > 0) {
      const blog = data.docs[0];
      const imageUrl = blog.coverImage?.url?.startsWith('/api/media')
        ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL?.replace(/\/api$/, '')}${blog.coverImage.url}`
        : blog.seo?.metaImage?.url?.startsWith('/api/media')
        ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL?.replace(/\/api$/, '')}${blog.seo.metaImage.url}`
        : '/blog-detail-placeholder.jpg';

      const contentHtml = blog.content ? convertToHtml(blog.content) : '';

      return {
        id: blog.id,
        title: blog.title,
        author: blog.author?.email || 'NomadNetwork Team',
        publishDate: new Date(blog.updatedAt).toLocaleDateString(),
        contentHtml: contentHtml,
        imageUrl: imageUrl,
      };
    }
  } catch (error) {
    console.error(`Failed to fetch blog post with slug ${slug}:`, error);
  }
  return null;
}

export default async function BlogPostContent({ slug }: { slug: string }) {
  const blogPost = await getBlogPost(slug);

  if (!blogPost) {
    return <div>Blog post not found.</div>;
  }

  return <BlogPostClientPage blogPost={blogPost} />;
}
