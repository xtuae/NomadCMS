import BlogPostContent from './_components/BlogPostContent';

interface BlogPostPageProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  
  return (
    <div>
      <BlogPostContent slug={slug} />
    </div>
  );
}
