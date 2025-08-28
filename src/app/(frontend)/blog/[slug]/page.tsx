import BlogPostContent from './_components/BlogPostContent';

// This component renders the blog post page based on the slug.
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return <BlogPostContent slug={slug} />;
}
