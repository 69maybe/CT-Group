'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, FileText, Eye, Search, ImagePlus, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

interface Article {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  excerpt?: string;
  excerptEn?: string;
  content?: string;
  contentEn?: string;
  image?: string;
  category: string;
  tags?: string[];
  author?: string;
  isFeatured: boolean;
  isPublished: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const { accessToken } = useAuthStore();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    content: '',
    contentEn: '',
    excerpt: '',
    excerptEn: '',
    image: '',
    category: 'NEWS',
    tags: [] as string[],
    isFeatured: false,
    isPublished: true,
  });
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.getAdminArticles(accessToken, { limit: 100, includeUnpublished: true });
      const data = response?.items || response || [];
      setArticles(data);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      // Fallback: try alternative endpoint
      try {
        const allResponse = await api.getArticles({ page: 1 });
        const data = allResponse?.items || [];
        setArticles(data);
      } catch (err) {
        console.error('Alternative fetch also failed:', err);
        setArticles([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      await api.deleteArticle(accessToken!, id);
      toast.success(t('deleteSuccess'));
      fetchArticles();
    } catch (error: any) {
      toast.error(error.message || tCommon('error'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const plainContent = formData.content.replace(/<[^>]*>/g, '').trim();
    if (!plainContent) {
      toast.error(locale === 'vi' ? 'Vui lòng nhập nội dung bài viết' : 'Please enter article content');
      return;
    }

    const normalizedTags = Array.from(
      new Set(
        tagsInput
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    );

    try {
      const payload = { ...formData, tags: normalizedTags };
      if (editingArticle) {
        await api.updateArticle(accessToken!, editingArticle.id, payload);
        toast.success(t('updateSuccess'));
      } else {
        await api.createArticle(accessToken!, payload);
        toast.success(t('createSuccess'));
      }
      setShowForm(false);
      setEditingArticle(null);
      resetForm();
      fetchArticles();
    } catch (error: any) {
      toast.error(error.message || tCommon('error'));
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || '',
      titleEn: article.titleEn || '',
      content: article.content || '',
      contentEn: article.contentEn || '',
      excerpt: article.excerpt || '',
      excerptEn: article.excerptEn || '',
      image: article.image || '',
      category: article.category || 'NEWS',
      tags: article.tags || [],
      isFeatured: article.isFeatured || false,
      isPublished: article.isPublished || false,
    });
    setTagsInput((article.tags || []).join(', '));
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleEn: '',
      content: '',
      contentEn: '',
      excerpt: '',
      excerptEn: '',
      image: '',
      category: 'NEWS',
      tags: [],
      isFeatured: false,
      isPublished: true,
    });
    setTagsInput('');
  };

  const filteredArticles = articles.filter(article =>
    article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.titleEn?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const suggestedTags = Array.from(
    new Set(
      articles.flatMap((article) => article.tags || []).filter(Boolean)
    )
  );

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !accessToken) return;

    if (!file.type.startsWith('image/')) {
      toast.error(locale === 'vi' ? 'Vui lòng chọn file hình ảnh hợp lệ' : 'Please choose a valid image file');
      return;
    }
    setUploadingImage(true);
    api
      .uploadAdminImage(accessToken, file)
      .then((res) => {
        setFormData((prev) => ({ ...prev, image: res.path || res.url || '' }));
        toast.success(locale === 'vi' ? 'Tải ảnh lên thành công' : 'Image uploaded successfully');
      })
      .catch((error: any) => {
        toast.error(error.message || (locale === 'vi' ? 'Tải ảnh thất bại' : 'Upload failed'));
      })
      .finally(() => setUploadingImage(false));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">{tCommon('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t('manageArticles')}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <Link
            href={`/${locale}/admin/articles/tags`}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-center"
          >
            {locale === 'vi' ? 'Tags & Thuộc tính' : 'Tags & Metadata'}
          </Link>
          <button
            onClick={() => { resetForm(); setEditingArticle(null); setShowForm(true); }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
          >
            <Plus className="w-5 h-5" />
            {t('addArticle')}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={t('searchArticles')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[920px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{locale === 'vi' ? 'Hình ảnh' : 'Image'}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{locale === 'vi' ? 'Tiêu đề' : 'Title'}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('categories')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{locale === 'vi' ? 'Lượt xem' : 'Views'}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{locale === 'vi' ? 'Thao tác' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredArticles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">{t('noArticles')}</td>
              </tr>
            ) : (
              filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {article.image ? (
                      <img loading="lazy" src={article.image} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{article.title || article.titleEn}</p>
                    <p className="text-sm text-gray-500">{article.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {article.isPublished ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded">{locale === 'vi' ? 'Đã xuất bản' : 'Published'}</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{locale === 'vi' ? 'Bản nháp' : 'Draft'}</span>
                      )}
                      {article.isFeatured && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-600 text-xs rounded">{locale === 'vi' ? 'Nổi bật' : 'Featured'}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span>{article.viewCount || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                        title={tCommon('edit')}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg"
                        title={tCommon('delete')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Article Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold">
                {editingArticle ? tCommon('edit') : tCommon('create')} {locale === 'vi' ? 'bài viết' : 'article'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'vi' ? 'Tiêu đề (VI)' : 'Title (VI)'}</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (EN)</label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'vi' ? 'Mô tả ngắn (VI)' : 'Short Description (VI)'}</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (EN)</label>
                  <textarea
                    value={formData.excerptEn}
                    onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows={2}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'vi' ? 'Nội dung (VI)' : 'Content (VI)'}</label>
                <div className="rounded-lg border border-gray-300 overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(value) =>
                      setFormData((prev) => (prev.content === value ? prev : { ...prev, content: value }))
                    }
                    modules={quillModules}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content (EN)</label>
                <div className="rounded-lg border border-gray-300 overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={formData.contentEn}
                    onChange={(value) =>
                      setFormData((prev) => (prev.contentEn === value ? prev : { ...prev, contentEn: value }))
                    }
                    modules={quillModules}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{locale === 'vi' ? 'Hình ảnh' : 'Image'}</label>
                  <label className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <ImagePlus className="w-4 h-4" />
                    <span className="text-sm">
                      {uploadingImage
                        ? (locale === 'vi' ? 'Đang tải ảnh...' : 'Uploading image...')
                        : (locale === 'vi' ? 'Chọn ảnh từ máy' : 'Choose image from device')}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileChange}
                      disabled={uploadingImage}
                    />
                  </label>
                  {formData.image && (
                    <div className="mt-3 relative w-32 h-32">
                      <img loading="lazy" src={formData.image} alt="" className="w-32 h-32 object-cover rounded-lg border" />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        title={locale === 'vi' ? 'Xóa ảnh' : 'Remove image'}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('categories')}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="NEWS">{locale === 'vi' ? 'Tin tức' : 'News'}</option>
                    <option value="BLOG">Blog</option>
                    <option value="PROMOTION">{locale === 'vi' ? 'Khuyến mãi' : 'Promotion'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'vi' ? 'Tags (phân tách bằng dấu phẩy)' : 'Tags (comma separated)'}
                </label>
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder={locale === 'vi' ? 'Ví dụ: công nghệ, AI, chuyển đổi số' : 'e.g. technology, AI, innovation'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                {suggestedTags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {suggestedTags.slice(0, 12).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          const current = tagsInput
                            .split(',')
                            .map((x) => x.trim())
                            .filter(Boolean);
                          if (current.includes(tag)) return;
                          setTagsInput([...current, tag].join(', '));
                        }}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 text-primary-500 rounded"
                  />
                  <span className="text-sm">{locale === 'vi' ? 'Xuất bản ngay' : 'Publish now'}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-primary-500 rounded"
                  />
                  <span className="text-sm">{locale === 'vi' ? 'Bài viết nổi bật' : 'Featured article'}</span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  {tCommon('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600"
                >
                  {tCommon('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}