import BlogPostContent from './_components/BlogPostContent';

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  return <BlogPostContent slug={slug} />;
}
