'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';

type AdminArticle = {
  id: string;
  title?: string;
  titleEn?: string;
  slug: string;
  category?: string;
  author?: string;
  tags?: string[];
  seoTitle?: string;
  seoDesc?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
};

type MetadataForm = {
  author: string;
  tagsText: string;
  seoTitle: string;
  seoDesc: string;
  category: string;
  isFeatured: boolean;
  isPublished: boolean;
};

export default function AdminArticleTagsPage() {
  const { accessToken } = useAuthStore();
  const params = useParams();
  const locale = params.locale as string;

  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const [form, setForm] = useState<MetadataForm>({
    author: '',
    tagsText: '',
    seoTitle: '',
    seoDesc: '',
    category: 'NEWS',
    isFeatured: false,
    isPublished: true,
  });

  const fetchArticles = async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    try {
      const response = await api.getAdminArticles(accessToken, { limit: 200, includeUnpublished: true });
      const items = response?.items || response || [];
      setArticles(Array.isArray(items) ? items : []);
    } catch (error: any) {
      toast.error(error.message || (locale === 'vi' ? 'Không thể tải bài viết' : 'Failed to load articles'));
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [accessToken]);

  const selectedArticle = useMemo(
    () => articles.find((article) => article.id === selectedArticleId),
    [articles, selectedArticleId]
  );

  useEffect(() => {
    if (!selectedArticle) return;
    setForm({
      author: selectedArticle.author || '',
      tagsText: (selectedArticle.tags || []).join(', '),
      seoTitle: selectedArticle.seoTitle || '',
      seoDesc: selectedArticle.seoDesc || '',
      category: selectedArticle.category || 'NEWS',
      isFeatured: !!selectedArticle.isFeatured,
      isPublished: selectedArticle.isPublished !== false,
    });
  }, [selectedArticle]);

  const tagStats = useMemo(() => {
    const map = new Map<string, number>();
    for (const article of articles) {
      for (const rawTag of article.tags || []) {
        const tag = rawTag.trim();
        if (!tag) continue;
        map.set(tag, (map.get(tag) || 0) + 1);
      }
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [articles]);

  const parseTags = (value: string) => {
    return Array.from(
      new Set(
        value
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    );
  };

  const handleSaveMetadata = async () => {
    if (!accessToken || !selectedArticle) return;

    try {
      setSaving(true);
      await api.updateArticle(accessToken, selectedArticle.id, {
        author: form.author.trim() || null,
        tags: parseTags(form.tagsText),
        seoTitle: form.seoTitle.trim() || null,
        seoDesc: form.seoDesc.trim() || null,
        category: form.category,
        isFeatured: form.isFeatured,
        isPublished: form.isPublished,
      });
      toast.success(locale === 'vi' ? 'Đã cập nhật thuộc tính bài viết' : 'Article metadata updated');
      await fetchArticles();
    } catch (error: any) {
      toast.error(error.message || (locale === 'vi' ? 'Cập nhật thất bại' : 'Update failed'));
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveTagFromAll = async (tag: string) => {
    if (!accessToken) return;
    const confirmText =
      locale === 'vi'
        ? `Xóa tag "${tag}" khỏi tất cả bài viết?`
        : `Remove "${tag}" from all articles?`;
    if (!confirm(confirmText)) return;

    const targets = articles.filter((article) => (article.tags || []).includes(tag));
    if (!targets.length) return;

    try {
      setSaving(true);
      await Promise.all(
        targets.map((article) =>
          api.updateArticle(accessToken, article.id, {
            tags: (article.tags || []).filter((t) => t !== tag),
          })
        )
      );
      toast.success(
        locale === 'vi'
          ? `Đã xóa tag "${tag}" khỏi ${targets.length} bài viết`
          : `Removed "${tag}" from ${targets.length} articles`
      );
      await fetchArticles();
    } catch (error: any) {
      toast.error(error.message || (locale === 'vi' ? 'Không thể xóa tag' : 'Failed to remove tag'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">{locale === 'vi' ? 'Đang tải...' : 'Loading...'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'vi' ? 'Quản lý tags & thuộc tính bài viết' : 'Manage article tags & metadata'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {locale === 'vi'
              ? 'Quản lý tag toàn bộ bài viết và chỉnh nhanh các thuộc tính SEO/hiển thị.'
              : 'Manage tags across articles and quickly edit SEO/display properties.'}
          </p>
        </div>
        <Link
          href={`/${locale}/admin/articles`}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          {locale === 'vi' ? 'Quay lại bài viết' : 'Back to articles'}
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">{locale === 'vi' ? 'Danh sách tags' : 'Tag list'}</h2>
          {tagStats.length === 0 ? (
            <p className="text-sm text-gray-500">{locale === 'vi' ? 'Chưa có tags' : 'No tags yet'}</p>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
              {tagStats.map((item) => (
                <div key={item.name} className="flex items-center justify-between border rounded-lg px-3 py-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {locale === 'vi' ? `${item.count} bài viết` : `${item.count} articles`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTagFromAll(item.name)}
                    disabled={saving}
                    className="px-3 py-1 text-sm rounded bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-60"
                  >
                    {locale === 'vi' ? 'Xóa toàn bộ' : 'Remove all'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold">{locale === 'vi' ? 'Chỉnh thuộc tính bài viết' : 'Edit article metadata'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === 'vi' ? 'Chọn bài viết' : 'Select article'}
            </label>
            <select
              value={selectedArticleId}
              onChange={(e) => setSelectedArticleId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">{locale === 'vi' ? '-- Chọn bài viết --' : '-- Select article --'}</option>
              {articles.map((article) => (
                <option key={article.id} value={article.id}>
                  {(article.title || article.titleEn || article.slug).slice(0, 80)}
                </option>
              ))}
            </select>
          </div>

          {selectedArticle ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    value={form.author}
                    onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'vi' ? 'Danh mục' : 'Category'}
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="NEWS">NEWS</option>
                    <option value="BLOG">BLOG</option>
                    <option value="PROMOTION">PROMOTION</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  value={form.tagsText}
                  onChange={(e) => setForm((prev) => ({ ...prev, tagsText: e.target.value }))}
                  placeholder={locale === 'vi' ? 'VD: công nghệ, AI, innovation' : 'e.g. technology, AI, innovation'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                <input
                  value={form.seoTitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                <textarea
                  value={form.seoDesc}
                  onChange={(e) => setForm((prev) => ({ ...prev, seoDesc: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  {locale === 'vi' ? 'Nổi bật' : 'Featured'}
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  {locale === 'vi' ? 'Đã xuất bản' : 'Published'}
                </label>
              </div>

              <button
                type="button"
                onClick={handleSaveMetadata}
                disabled={saving}
                className="w-full py-3 rounded-lg bg-primary text-white hover:bg-primary-600 disabled:opacity-60"
              >
                {saving
                  ? (locale === 'vi' ? 'Đang lưu...' : 'Saving...')
                  : (locale === 'vi' ? 'Lưu thuộc tính' : 'Save metadata')}
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              {locale === 'vi' ? 'Vui lòng chọn bài viết để chỉnh thuộc tính.' : 'Select an article to edit metadata.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
