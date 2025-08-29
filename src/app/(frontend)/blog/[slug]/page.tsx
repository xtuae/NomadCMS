import BlogPostContent from './_components/BlogPostContent';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  return (
    <div>
      <BlogPostContent slug={slug} />
    </div>
  );
}
