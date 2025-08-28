import BlogPostContent from './_components/BlogPostContent';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  return <BlogPostContent slug={slug} />;
}
