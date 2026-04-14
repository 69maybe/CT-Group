'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Shield, Users, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Role {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  _count: { userRoles: number };
  rolePermissions: { id: string; name: string; description?: string }[];
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export default function AdminRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const { accessToken } = useAuthStore();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('admin');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    
    try {
      const [rolesData, permissionsData] = await Promise.all([
        api.getRoles(accessToken),
        api.getPermissions(accessToken),
      ]);
      
      // Handle both response formats: { data: {...} } or direct array
      const rolesArray = Array.isArray(rolesData) ? rolesData : (rolesData || []);
      const permData = permissionsData || {};
      const permissionsArray = Array.isArray(permData) ? permData : (permData.permissions || permData.grouped ? Object.values(permData.grouped || {}).flat() : []);
      
      setRoles(rolesArray);
      setPermissions(permissionsArray);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setRoles([]);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const openPermissionsModal = (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissions(role.rolePermissions.map(rp => rp.id));
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const savePermissions = async () => {
    if (!accessToken || !selectedRole) return;
    
    try {
      await api.assignRolePermissions(accessToken, selectedRole.id, selectedPermissions);
      toast.success(t('updatePermissionsSuccess'));
      setSelectedRole(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || t('error'));
    }
  };

  // Group permissions by resource
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) acc[perm.resource] = [];
    acc[perm.resource].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (loading) {
    return <div className="flex items-center justify-center h-64">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t('manageRoles')}</h1>
      </div>

      {/* Roles Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{locale === 'vi' ? 'Vai trò' : 'Role'}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{locale === 'vi' ? 'Mô tả' : 'Description'}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('users')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{locale === 'vi' ? 'Quyền hạn' : 'Permissions'}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{locale === 'vi' ? 'Thao tác' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary-500" />
                    <span className="font-medium">{role.name}</span>
                    {role.isDefault && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{locale === 'vi' ? 'Mặc định' : 'Default'}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{role.description || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{role._count.userRoles}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {role.rolePermissions.slice(0, 3).map((rp) => (
                      <span key={rp.id} className="px-2 py-0.5 bg-primary-50 text-primary-600 text-xs rounded">
                        {rp.name}
                      </span>
                    ))}
                    {role.rolePermissions.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        +{role.rolePermissions.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openPermissionsModal(role)}
                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                    title={locale === 'vi' ? 'Phân quyền' : 'Assign permissions'}
                  >
                    <Shield className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Permissions Modal */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{locale === 'vi' ? 'Phân quyền' : 'Assign Permissions'}: {selectedRole.name}</h2>
                  <p className="text-sm text-gray-500">{selectedPermissions.length} {locale === 'vi' ? 'quyền được chọn' : 'permissions selected'}</p>
                </div>
                <button onClick={() => setSelectedRole(null)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-6">
              {Object.entries(groupedPermissions).map(([resource, perms]) => (
                <div key={resource}>
                  <h3 className="font-semibold text-lg mb-3 capitalize">{resource}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {perms.map((perm) => (
                      <label
                        key={perm.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedPermissions.includes(perm.id)
                            ? 'bg-primary-50 border border-primary-200'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                          className="w-4 h-4 text-primary-500 rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{perm.name}</p>
                          {perm.description && (
                            <p className="text-xs text-gray-500">{perm.description}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 sm:p-6 border-t sticky bottom-0 bg-white">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSelectedRole(null)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  {locale === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  onClick={savePermissions}
                  className="flex-1 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600"
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
