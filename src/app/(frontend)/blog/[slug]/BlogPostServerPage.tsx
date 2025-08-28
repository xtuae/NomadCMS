import BlogPostContent from './_components/BlogPostContent';

export default async function BlogPostServerPage({ slug }: { slug: string }) {
  return <BlogPostContent slug={slug} />;
}
