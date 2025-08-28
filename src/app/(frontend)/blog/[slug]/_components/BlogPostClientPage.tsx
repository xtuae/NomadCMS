"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  publishDate: string;
  contentHtml: string;
  imageUrl: string;
}

function BlogPostClientPage({ blogPost }: { blogPost: BlogPost }) {
  const router = useRouter();

  return (
    <>
      {/* Back Button */}
      <button
        onClick={() => router.push('/blog')}
        className="absolute top-4 left-4 bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition z-20 mt-20"
      >
        &larr; Back to Blogs
      </button>

      {/* Hero Section */}
      <div
        className="relative w-full min-h-[60vh] px-4 py-10 sm:py-20 flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Background Image */}
        {blogPost.imageUrl && (
          <div className="absolute inset-0">
            {blogPost.imageUrl.startsWith('http://') || blogPost.imageUrl.startsWith('https://') ? (
              <Image
                src={blogPost.imageUrl}
                alt={blogPost.title}
                fill
                className="object-cover"
                priority
                unoptimized={true}
              />
            ) : (
              <Image
                src={blogPost.imageUrl}
                alt={blogPost.title}
                fill
                className="object-cover"
                priority
                unoptimized={true}
              />
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
            
          </div>
        )}

        {/* Content */}
        <div className="max-w-xl z-10 mt-16 sm:mt-28 text-white">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">{blogPost.title}</h1>
          <p className="text-base sm:text-lg text-white leading-7 mt-4 font-semibold">{blogPost.author} on {blogPost.publishDate}</p>
        </div>
      </div>

      {/* Blog Post Content */}
      <section className="max-w-3xl mx-auto mt-8 p-4">
        <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: blogPost.contentHtml }} />
      </section>
    </>
  );
}

export default BlogPostClientPage;
