import React from 'react';
import Image from 'next/image';

interface BlogThumbnail {
  id: string;
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
    const payloadBaseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL;
    // Ensure rootUrl ends without a slash and remove /api if present
    const rootUrl = payloadBaseUrl?.replace(/\/api$/, '').replace(/\/$/, '');
    const apiBaseUrl = `${rootUrl}/api`; // Explicitly construct apiBaseUrl

    const url = `${apiBaseUrl}/pages?title=Blog`; // Fetch page where title is "Blog"
    const res = await fetch(url);

    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status} from URL: ${url}`);
      return null;
    }

    const data = await res.json();

    if (data && data.docs && data.docs.length > 0 && data.docs[0].privacyHeader) {
      const header = data.docs[0].privacyHeader;
      let imageUrl = header.backgroundImage?.url;

      if (imageUrl && imageUrl.startsWith('/')) {
        imageUrl = `${rootUrl}${imageUrl}`;
      }

      return {
        title: header.headline,
        subtitle: header.subheadline,
        backgroundImageUrl: imageUrl || "/blog-banner.jpg",
      };
    }
  } catch (error) {
    console.error('Failed to fetch blog header banner:', error);
  }
  return null;
}

async function getBlogThumbnails(): Promise<BlogThumbnail[]> {
  try {
    const payloadBaseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL;
    // Ensure rootUrl ends without a slash and remove /api if present
    const rootUrl = payloadBaseUrl?.replace(/\/api$/, '').replace(/\/$/, '');
    const apiBaseUrl = `${rootUrl}/api`; // Explicitly construct apiBaseUrl

    const url = `${apiBaseUrl}/blogs`;
    const res = await await fetch(url);
    const data = await res.json();

    if (data && data.docs) {
      return data.docs.map((blog: { id: string; title: string; coverImage?: { url: string; }; slug: string; }) => {
        let coverImageUrl = blog.coverImage?.url;
        if (coverImageUrl && coverImageUrl.startsWith('/')) { // If it's a relative path
          coverImageUrl = `${rootUrl}${coverImageUrl}`; // Prepend with the root URL
        }
        return {
          id: blog.id,
          title: blog.title,
          coverImage: coverImageUrl || '/blog-thumb-1.jpg', // Fallback to an existing image
          slug: blog.slug,
        };
      });
    }
  } catch (error) {
    console.error('Failed to fetch blog thumbnails:', error);
  }
  return []; // Return empty array on error
}

export default async function BlogPage() {
  const privacyHeader = await getHeaderBanner();
  const blogThumbnails = await getBlogThumbnails();

  return (
    <div>
      {/* Header Banner Section */}
      {privacyHeader && (
        <div className="relative h-64 bg-cover bg-center flex items-center justify-center text-white"
 style={{ backgroundImage: `url(${privacyHeader.backgroundImageUrl})` }}>
          <h1>{privacyHeader.title}</h1>
          <p>{privacyHeader.subtitle}</p>
        </div>
      )}


      {/* Blog Thumbnails Section */}
      <div className="blog-thumbnails-container">
        {blogThumbnails.map((blog) => (
          <a href={`/blog/${blog.id}`} key={blog.id} className="blog-thumbnail-card">
            <div className="relative w-full h-[200px]">
              {blog.coverImage === '/blog-thumb-1.jpg' ? (
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized={true}
                />
              ) : (
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized={true}
                />
              )}
            </div>
            <h3>{blog.title}</h3>
          </a>
        ))}
      </div>
    </div>
  );
}
