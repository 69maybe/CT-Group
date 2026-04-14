'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import { Shield, Check, Edit, Trash2, ImagePlus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  roles: string[];
  permissions: string[];
}

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  avatar: string;
  isActive: boolean;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleUser, setRoleUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    avatar: '',
    isActive: true,
  });
  const { accessToken } = useAuthStore();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('admin');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!accessToken) {
      console.log('No access token available');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching users and roles...');
      const [usersData, rolesData] = await Promise.all([
        api.getUsers(accessToken),
        api.getRoles(accessToken),
      ]);
      
      console.log('Users response:', usersData);
      console.log('Roles response:', rolesData);
      
      // Handle users response - backend returns { items: [...], total: ... }
      const usersArray = usersData?.items || usersData || [];
      setUsers(Array.isArray(usersArray) ? usersArray : []);
      
      // Handle roles response - backend returns array directly
      const rolesArray = Array.isArray(rolesData) ? rolesData : (rolesData || []);
      setRoles(rolesArray);
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      alert('Lỗi: ' + (error.message || 'Không thể lấy dữ liệu'));
      setUsers([]);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const openRolesModal = (user: User) => {
    setRoleUser(user);
    setSelectedRoles(user.roles || []);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      phone: user.phone || '',
      address: user.address || '',
      avatar: user.avatar || '',
      isActive: user.isActive,
    });
  };

  const toggleRole = (roleName: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleName)
        ? prev.filter(r => r !== roleName)
        : [...prev, roleName]
    );
  };

  const saveRoles = async () => {
    if (!accessToken || !roleUser) return;
    
    try {
      // Find role IDs from role names
      const roleIds = roles
        .filter(r => selectedRoles.includes(r.name))
        .map(r => r.id);
      
      await api.assignUserRoles(accessToken, roleUser.id, roleIds);
      toast.success(t('updateRoleSuccess'));
      setRoleUser(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || t('error'));
    }
  };

  const saveUser = async () => {
    if (!accessToken || !editingUser) return;

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error(locale === 'vi' ? 'Vui lòng nhập tên và email' : 'Please enter name and email');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast.error(locale === 'vi' ? 'Mật khẩu tối thiểu 6 ký tự' : 'Password must be at least 6 characters');
      return;
    }

    try {
      const payload: Record<string, any> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        avatar: formData.avatar.trim(),
        isActive: formData.isActive,
      };
      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      }
      await api.updateUser(accessToken, editingUser.id, payload);
      toast.success(t('updateSuccess'));
      setEditingUser(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || t('error'));
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !accessToken) return;

    if (!file.type.startsWith('image/')) {
      toast.error(locale === 'vi' ? 'Vui lòng chọn file hình ảnh hợp lệ' : 'Please choose a valid image file');
      return;
    }

    setUploadingAvatar(true);
    api
      .uploadAdminImage(accessToken, file)
      .then((res) => {
        setFormData((prev) => ({ ...prev, avatar: res.path || res.url || '' }));
        toast.success(locale === 'vi' ? 'Tải ảnh đại diện thành công' : 'Avatar uploaded successfully');
      })
      .catch((error: any) => {
        toast.error(error.message || (locale === 'vi' ? 'Tải ảnh thất bại' : 'Upload failed'));
      })
      .finally(() => setUploadingAvatar(false));
  };

  const deleteUser = async (user: User) => {
    if (!accessToken) return;
    if (!confirm(t('confirmDeleteUser', { name: user.name }))) return;
    
    try {
      await api.deleteUser(accessToken, user.id);
      toast.success(t('deleteUserSuccess'));
      fetchData();
    } catch (error: any) {
      toast.error(error.message || t('error'));
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t('manageUsers')}</h1>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{locale === 'vi' ? 'Người dùng' : 'User'}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{locale === 'vi' ? 'Vai trò' : 'Roles'}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{locale === 'vi' ? 'Đăng nhập cuối' : 'Last Login'}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{locale === 'vi' ? 'Thao tác' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  {locale === 'vi' ? 'Chưa có người dùng nào' : 'No users yet'}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">{user.name?.charAt(0)?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.map((role, index) => (
                        <span key={`${role}-${index}`} className="px-2 py-0.5 bg-primary-50 text-primary-600 text-xs rounded-full">
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.isActive ? (locale === 'vi' ? 'Hoạt động' : 'Active') : (locale === 'vi' ? 'Vô hiệu' : 'Inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : (locale === 'vi' ? 'Chưa đăng nhập' : 'Never logged in')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                        title={locale === 'vi' ? 'Chỉnh sửa người dùng' : 'Edit user'}
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openRolesModal(user)}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                        title={locale === 'vi' ? 'Phân vai trò' : 'Assign roles'}
                      >
                        <Shield className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteUser(user)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg"
                        title={locale === 'vi' ? 'Xóa' : 'Delete'}
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

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{locale === 'vi' ? 'Chỉnh sửa người dùng' : 'Edit user'}</h2>
                  <p className="text-sm text-gray-500">{editingUser.id}</p>
                </div>
                <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'vi' ? 'Họ và tên' : 'Full name'}</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'vi' ? 'Mật khẩu mới' : 'New password'}</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={locale === 'vi' ? 'Để trống nếu không đổi' : 'Leave blank to keep unchanged'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'vi' ? 'Số điện thoại' : 'Phone'}</label>
                  <input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'vi' ? 'Địa chỉ' : 'Address'}</label>
                <input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{locale === 'vi' ? 'Ảnh đại diện' : 'Avatar'}</label>
                <label className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <ImagePlus className="w-4 h-4" />
                  <span className="text-sm">
                    {uploadingAvatar
                      ? (locale === 'vi' ? 'Đang tải ảnh...' : 'Uploading image...')
                      : (locale === 'vi' ? 'Chọn ảnh từ máy' : 'Choose image from device')}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileChange}
                    disabled={uploadingAvatar}
                  />
                </label>
                {formData.avatar && (
                  <div className="mt-3 relative w-20 h-20">
                    <img src={formData.avatar} alt="" className="w-20 h-20 object-cover rounded-full border" />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, avatar: '' }))}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      title={locale === 'vi' ? 'Xóa ảnh' : 'Remove image'}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary-500 rounded"
                />
                <span>{locale === 'vi' ? 'Tài khoản hoạt động' : 'Account is active'}</span>
              </label>
            </div>
            <div className="p-4 sm:p-6 border-t">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  {locale === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  onClick={saveUser}
                  disabled={uploadingAvatar}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600"
                >
                  {locale === 'vi' ? 'Lưu thay đổi' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Roles Modal */}
      {roleUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-4 sm:p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{locale === 'vi' ? 'Phân vai trò' : 'Assign Roles'}</h2>
                  <p className="text-sm text-gray-500">{roleUser.name}</p>
                </div>
                <button onClick={() => setRoleUser(null)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-2">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedRoles.includes(role.name)
                      ? 'bg-primary-50 border border-primary-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.name)}
                    onChange={() => toggleRole(role.name)}
                    className="w-4 h-4 text-primary-500 rounded"
                  />
                  <div className="flex-1">
                    <span className="font-medium">{role.name}</span>
                    {role.description && (
                      <p className="text-sm text-gray-500">{role.description}</p>
                    )}
                  </div>
                  {selectedRoles.includes(role.name) && (
                    <Check className="w-4 h-4 text-primary-500" />
                  )}
                </label>
              ))}
            </div>
            <div className="p-4 sm:p-6 border-t">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setRoleUser(null)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  {locale === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  onClick={saveRoles}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600"
                >
                  {locale === 'vi' ? 'Lưu thay đổi' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
