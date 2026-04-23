import { Metadata, ResolvingMetadata } from 'next';
import { api } from '@/lib/api';

type Props = {
  params: { locale: string; slug: string };
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale, slug } = params;

  try {
    const article = await api.getArticle(slug, locale);
    
    if (!article) return {};

    const previousImages = (await parent).openGraph?.images || [];
    const title = article.seoTitle || article.title || 'SYSMAC JSC';
    const description = article.seoDesc || article.excerpt || '';
    const imageUrl = article.image ? `https://sysmac.vn${article.image}` : undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: article.publishedAt || article.createdAt,
        authors: [article.author || 'SYSMAC JSC'],
        images: imageUrl ? [imageUrl, ...previousImages] : previousImages,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch (error) {
    return {};
  }
}

export default function ArticleLayout({ children }: Props) {
  return <>{children}</>;
}
