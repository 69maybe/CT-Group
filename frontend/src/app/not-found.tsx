import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl text-center space-y-4">
        <p className="text-primary-600 font-semibold">404</p>
        <h1 className="text-3xl md:text-4xl font-bold">Page not found</h1>
        <p className="text-gray-600">Trang bạn tìm kiếm không tồn tại hoặc đã được chuyển.</p>
        <Link
          href="/vi"
          className="inline-flex items-center px-5 py-3 rounded-lg bg-primary text-white hover:bg-primary-600"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
