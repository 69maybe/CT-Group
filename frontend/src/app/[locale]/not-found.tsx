import Link from 'next/link';

type Props = {
  params: { locale: string };
};

export default function LocaleNotFoundPage({ params }: Props) {
  const locale = params?.locale === 'en' ? 'en' : 'vi';
  const isVi = locale === 'vi';

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-xl text-center space-y-4">
        <p className="text-primary-600 font-semibold">404</p>
        <h1 className="text-3xl md:text-4xl font-bold">
          {isVi ? 'Không tìm thấy trang' : 'Page not found'}
        </h1>
        <p className="text-gray-600">
          {isVi
            ? 'Liên kết có thể đã thay đổi hoặc trang không còn tồn tại.'
            : 'The link may be outdated or the page no longer exists.'}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center px-5 py-3 rounded-lg bg-primary text-white hover:bg-primary-600"
        >
          {isVi ? 'Về trang chủ' : 'Back to home'}
        </Link>
      </div>
    </div>
  );
}
