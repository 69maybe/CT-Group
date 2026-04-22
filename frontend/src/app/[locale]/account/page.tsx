'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { User, LogOut, Camera, Save } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function AccountPage() {
  const { user, isAuthenticated, logout, accessToken, updateUser, hasHydrated } = useAuthStore();
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const t = useTranslations('account');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    avatar: '',
  });

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
    }
  }, [hasHydrated, isAuthenticated, locale, router]);

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated || !accessToken) return;
    let cancelled = false;
    setLoadingProfile(true);
    api
      .getMe(accessToken)
      .then((me) => {
        if (cancelled || !me) return;
        updateUser({
          name: me.name,
          email: me.email,
          phone: me.phone,
          address: me.address,
          avatar: me.avatar,
          roles: me.roles || [],
          permissions: me.permissions || [],
        });
      })
      .catch(() => {
        // Keep local user data if refresh fails
      })
      .finally(() => {
        if (!cancelled) setLoadingProfile(false);
      });
    return () => {
      cancelled = true;
    };
  }, [hasHydrated, isAuthenticated, accessToken, updateUser]);

  useEffect(() => {
    if (!user) return;
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      avatar: user.avatar || '',
    });
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push(`/${locale}`);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !accessToken) return;
    if (!file.type.startsWith('image/')) {
      toast.error(locale === 'vi' ? 'Vui lòng chọn file ảnh hợp lệ' : 'Please choose a valid image file');
      return;
    }

    try {
      setUploading(true);
      const res = await api.uploadMyAvatar(accessToken, file);
      setFormData((prev) => ({ ...prev, avatar: res.path || res.url || '' }));
      toast.success(locale === 'vi' ? 'Tải ảnh đại diện thành công' : 'Avatar uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || (locale === 'vi' ? 'Tải ảnh thất bại' : 'Upload failed'));
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!accessToken || !user) return;
    if (!formData.name.trim()) {
      toast.error(locale === 'vi' ? 'Vui lòng nhập họ tên' : 'Please enter your full name');
      return;
    }

    try {
      setSaving(true);
      const updated = await api.updateMe(accessToken, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        avatar: formData.avatar.trim(),
      });
      updateUser({
        name: updated.name,
        phone: updated.phone,
        address: updated.address,
        avatar: updated.avatar,
      });
      toast.success(locale === 'vi' ? 'Đã cập nhật hồ sơ' : 'Profile updated');
    } catch (error: any) {
      toast.error(error.message || (locale === 'vi' ? 'Cập nhật thất bại' : 'Update failed'));
    } finally {
      setSaving(false);
    }
  };

  if (!hasHydrated || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                  {formData.avatar ? (
                    <img loading="lazy" src={formData.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-primary-600" />
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50">
                  <Camera className="w-4 h-4 text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={uploading}
                  />
                </label>
              </div>
              <div>
                <h1 className="font-semibold text-xl">{formData.name || user.name}</h1>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {t('logout')}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-xl mb-6">{t('profile')}</h2>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                <p className="px-4 py-3 bg-gray-50 rounded-lg">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                <input
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={locale === 'vi' ? 'Nhập số điện thoại' : 'Enter your phone number'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('address')}</label>
                <input
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={locale === 'vi' ? 'Nhập địa chỉ' : 'Enter your address'}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving || uploading || loadingProfile}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-600 disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {saving
                  ? (locale === 'vi' ? 'Đang lưu...' : 'Saving...')
                  : (locale === 'vi' ? 'Lưu hồ sơ' : 'Save profile')}
              </button>
            </div>

            <div className="pt-4">
              <h3 className="font-medium mb-2">{t('roles')}</h3>
              <div className="flex flex-wrap gap-2">
                {user.roles?.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-500 pt-4 border-t border-gray-100">
              {t('newsHint')}{' '}
              <Link href={`/${locale}/news`} className="text-primary-600 hover:underline font-medium">
                {t('viewNews')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
