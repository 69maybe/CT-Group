import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import {
  getBusinessSectorFallback,
  resolveBusinessSectorApiSlug,
} from '@/data/business-sectors';

type Props = { params: { locale: string; slug: string } };

export default async function BusinessSectorDetailPage({ params }: Props) {
  const { locale, slug } = params;
  const vi = locale === 'vi';
  const apiSlug = resolveBusinessSectorApiSlug(slug);

  let fromApi: Awaited<ReturnType<typeof api.getBusinessSectorBySlug>> | null = null;
  try {
    fromApi = await api.getBusinessSectorBySlug(apiSlug, locale);
  } catch {
    fromApi = null;
  }

  const fallback = getBusinessSectorFallback(slug);
  if (!fromApi && !fallback) {
    notFound();
  }

  const title =
    fromApi?.title ??
    (vi ? fallback!.titles.titleVi : fallback!.titles.titleEn);
  const subtitle =
    fromApi?.subtitle ??
    (vi ? fallback!.titles.subtitleVi : fallback!.titles.subtitleEn);
  const description =
    fromApi?.description ??
    (vi ? fallback!.entry.description.vi : fallback!.entry.description.en);
  const image = fromApi?.imagePath ?? fallback!.entry.image;
  const color = fallback?.entry.color ?? '#1b86c8';
  const number = fallback?.entry.number ?? String(fromApi?.sortOrder ?? 0).padStart(2, '0');

  return (
    <div>
      <section className="relative bg-gradient-to-r from-ct-blue to-blue-700 text-white py-12">
        <div className="container mx-auto px-4">
          <Link
            href={`/${locale}/business-sector`}
            className="inline-flex items-center gap-2 text-sm opacity-90 hover:opacity-100 mb-6"
          >
            ← {vi ? 'Tất cả lĩnh vực' : 'All sectors'}
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <span
              className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
              style={{ backgroundColor: color }}
            >
              {number}
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
              {subtitle ? (
                <p className="mt-1 text-lg opacity-90">{subtitle}</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-md">
            <div className="relative aspect-[21/9] max-h-80 w-full">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
            <div className="p-8">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: color }}
              >
                {vi ? 'Liên hệ tư vấn' : 'Contact us'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
