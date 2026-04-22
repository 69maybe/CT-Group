'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Edit, Plus, Trash2, ImagePlus, X } from 'lucide-react';

type Sector = {
  id: string;
  slug: string;
  sortOrder: number;
  imagePath: string;
  titleVi: string;
  titleEn: string;
  subtitleVi?: string;
  subtitleEn?: string;
  descriptionVi?: string;
  descriptionEn?: string;
  detailHref: string;
  active: boolean;
};

const emptyForm = {
  slug: '',
  sortOrder: 1,
  imagePath: '',
  titleVi: '',
  titleEn: '',
  subtitleVi: '',
  subtitleEn: '',
  descriptionVi: '',
  descriptionEn: '',
  detailHref: '',
  active: true,
};

export default function AdminSectorsPage() {
  const { accessToken } = useAuthStore();
  const params = useParams();
  const locale = params.locale as string;

  const [items, setItems] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Sector | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchData = async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.getAdminBusinessSectors(accessToken);
      setItems(data);
    } catch (error: any) {
      toast.error(error.message || (locale === 'vi' ? 'Không thể tải lĩnh vực' : 'Failed to load sectors'));
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  useEffect(() => {
    const normalizedSlug = String(form.slug || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    if (!normalizedSlug) return;
    const expectedHref = `/business-sector/${normalizedSlug}`;
    if (form.slug === normalizedSlug && form.detailHref === expectedHref) return;
    setForm((prev: any) => ({
      ...prev,
      slug: normalizedSlug,
      detailHref: expectedHref,
    }));
  }, [form.slug]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item: Sector) => {
    setEditing(item);
    setForm({
      ...item,
      sortOrder: item.sortOrder ?? 1,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    if (!form.imagePath) {
      toast.error(locale === 'vi' ? 'Vui lòng chọn ảnh lĩnh vực' : 'Please choose sector image');
      return;
    }
    try {
      if (editing) {
        await api.updateBusinessSector(accessToken, editing.id, form);
        toast.success(locale === 'vi' ? 'Đã cập nhật lĩnh vực' : 'Sector updated');
      } else {
        await api.createBusinessSector(accessToken, form);
        toast.success(locale === 'vi' ? 'Đã tạo lĩnh vực' : 'Sector created');
      }
      setShowForm(false);
      await fetchData();
    } catch (error: any) {
      toast.error(error.message || (locale === 'vi' ? 'Lưu thất bại' : 'Save failed'));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !accessToken) return;
    if (!file.type.startsWith('image/')) {
      toast.error(locale === 'vi' ? 'Vui lòng chọn file ảnh hợp lệ' : 'Please choose a valid image file');
      return;
    }
    try {
      setUploadingImage(true);
      const res = await api.uploadAdminImage(accessToken, file);
      setForm((prev: any) => ({ ...prev, imagePath: res.path || res.url || '' }));
      toast.success(locale === 'vi' ? 'Tải ảnh thành công' : 'Image uploaded');
    } catch (error: any) {
      toast.error(error.message || (locale === 'vi' ? 'Tải ảnh thất bại' : 'Upload failed'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (item: Sector) => {
    if (!accessToken) return;
    if (!confirm(locale === 'vi' ? `Xóa lĩnh vực "${item.titleVi}"?` : `Delete "${item.titleEn}"?`)) return;
    try {
      await api.deleteBusinessSector(accessToken, item.id);
      toast.success(locale === 'vi' ? 'Đã xóa lĩnh vực' : 'Sector deleted');
      await fetchData();
    } catch (error: any) {
      toast.error(error.message || (locale === 'vi' ? 'Xóa thất bại' : 'Delete failed'));
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64">{locale === 'vi' ? 'Đang tải...' : 'Loading...'}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">{locale === 'vi' ? 'Quản lý lĩnh vực' : 'Manage sectors'}</h1>
        <button onClick={openCreate} className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          {locale === 'vi' ? 'Thêm lĩnh vực' : 'Add sector'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="px-4 py-8 text-sm text-gray-500 text-center">
              {locale === 'vi' ? 'Chưa có lĩnh vực nào' : 'No sectors found'}
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {item.imagePath ? (
                      <img loading="lazy" src={item.imagePath} alt={item.titleVi || item.titleEn} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{item.titleVi}</p>
                    <p className="text-xs text-gray-500 truncate">{item.titleEn}</p>
                    <p className="text-xs text-gray-400 mt-1 break-all">/{item.slug}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Sort: {item.sortOrder}</span>
                  <span className={`px-2 py-1 rounded text-xs ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {item.active ? (locale === 'vi' ? 'Hiển thị' : 'Active') : (locale === 'vi' ? 'Ẩn' : 'Inactive')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(item)} className="flex-1 py-2 px-3 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                    {locale === 'vi' ? 'Sửa' : 'Edit'}
                  </button>
                  <button onClick={() => handleDelete(item)} className="flex-1 py-2 px-3 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50">
                    {locale === 'vi' ? 'Xóa' : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Slug</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">{locale === 'vi' ? 'Tiêu đề' : 'Title'}</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Sort</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">{locale === 'vi' ? 'Trạng thái' : 'Status'}</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">{locale === 'vi' ? 'Thao tác' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-sm text-gray-500 text-center">
                    {locale === 'vi' ? 'Chưa có lĩnh vực nào' : 'No sectors found'}
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm">{item.slug}</td>
                    <td className="px-4 py-3 text-sm">
                      <p className="font-medium">{item.titleVi}</p>
                      <p className="text-gray-500">{item.titleEn}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">{item.sortOrder}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {item.active ? (locale === 'vi' ? 'Hiển thị' : 'Active') : (locale === 'vi' ? 'Ẩn' : 'Inactive')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item)} className="p-2 hover:bg-gray-100 rounded text-red-600">
                          <Trash2 className="w-4 h-4" />
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

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b">
              <h2 className="text-xl font-bold">{editing ? (locale === 'vi' ? 'Sửa lĩnh vực' : 'Edit sector') : (locale === 'vi' ? 'Thêm lĩnh vực' : 'Add sector')}</h2>
            </div>
            <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input required placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input required placeholder="sortOrder" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'vi' ? 'Ảnh lĩnh vực' : 'Sector image'}
                </label>
                <label className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <ImagePlus className="w-4 h-4" />
                  <span className="text-sm">
                    {uploadingImage
                      ? (locale === 'vi' ? 'Đang tải ảnh...' : 'Uploading image...')
                      : (locale === 'vi' ? 'Chọn ảnh từ máy' : 'Choose image from device')}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
                {form.imagePath && (
                  <div className="mt-3 relative w-32 h-24">
                    <img loading="lazy" src={form.imagePath} alt="" className="w-32 h-24 object-cover rounded-lg border" />
                    <button
                      type="button"
                      onClick={() => setForm((prev: any) => ({ ...prev, imagePath: '' }))}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      title={locale === 'vi' ? 'Xóa ảnh' : 'Remove image'}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'vi' ? 'Đường dẫn chi tiết' : 'Detail path'}
                </label>
                <input
                  value={form.detailHref}
                  readOnly
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (VI)</label>
                  <input required placeholder="titleVi" value={form.titleVi} onChange={(e) => setForm({ ...form, titleVi: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (EN)</label>
                  <input required placeholder="titleEn" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (VI)</label>
                  <input placeholder="subtitleVi" value={form.subtitleVi || ''} onChange={(e) => setForm({ ...form, subtitleVi: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (EN)</label>
                  <input placeholder="subtitleEn" value={form.subtitleEn || ''} onChange={(e) => setForm({ ...form, subtitleEn: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (VI)</label>
                  <textarea placeholder="descriptionVi" value={form.descriptionVi || ''} onChange={(e) => setForm({ ...form, descriptionVi: e.target.value })} className="w-full px-4 py-2 border rounded-lg" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
                  <textarea placeholder="descriptionEn" value={form.descriptionEn || ''} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} className="w-full px-4 py-2 border rounded-lg" rows={3} />
                </div>
              </div>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={!!form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                <span>{locale === 'vi' ? 'Hiển thị lĩnh vực' : 'Sector active'}</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 border rounded-lg">{locale === 'vi' ? 'Hủy' : 'Cancel'}</button>
                <button type="submit" disabled={uploadingImage} className="flex-1 py-3 bg-primary text-white rounded-lg disabled:opacity-60">{locale === 'vi' ? 'Lưu' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
