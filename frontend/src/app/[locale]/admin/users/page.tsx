'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import { Users, Shield, Check, Edit, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
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

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
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
    setSelectedUser(user);
    setSelectedRoles(user.roles || []);
  };

  const toggleRole = (roleName: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleName)
        ? prev.filter(r => r !== roleName)
        : [...prev, roleName]
    );
  };

  const saveRoles = async () => {
    if (!accessToken || !selectedUser) return;
    
    try {
      // Find role IDs from role names
      const roleIds = roles
        .filter(r => selectedRoles.includes(r.name))
        .map(r => r.id);
      
      await api.assignUserRoles(accessToken, selectedUser.id, roleIds);
      alert(t('updateRoleSuccess'));
      setSelectedUser(null);
      fetchData();
    } catch (error: any) {
      alert(error.message || t('error'));
    }
  };

  const deleteUser = async (user: User) => {
    if (!accessToken) return;
    if (!confirm(t('confirmDeleteUser', { name: user.name }))) return;
    
    try {
      await api.deleteUser(accessToken, user.id);
      alert(t('deleteUserSuccess'));
      fetchData();
    } catch (error: any) {
      alert(error.message || t('error'));
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('manageUsers')}</h1>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
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

      {/* Roles Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{locale === 'vi' ? 'Phân vai trò' : 'Assign Roles'}</h2>
                  <p className="text-sm text-gray-500">{selectedUser.name}</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-2">
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
            <div className="p-6 border-t">
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedUser(null)}
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
