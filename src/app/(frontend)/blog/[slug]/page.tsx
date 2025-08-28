import BlogPostContent from './_components/BlogPostContent';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return <BlogPostContent slug={slug} />;
}
