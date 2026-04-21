import { defaultLocalBackend, normalizeBackendOrigin } from '@/lib/backendOrigin';

/**
 * Trình duyệt: gọi `/api` (cùng origin với Next) — proxy route → Spring Boot.
 * Server (SSR): gọi trực tiếp backend qua INTERNAL_API_URL, BACKEND_URL hoặc NEXT_PUBLIC_API_URL.
 */
function resolveApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  const raw = (
    (typeof process !== 'undefined' && process.env.INTERNAL_API_URL) ||
    (typeof process !== 'undefined' && process.env.BACKEND_URL) ||
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) ||
    defaultLocalBackend()
  ).toString();
  return `${normalizeBackendOrigin(raw)}/api`;
}

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private normalizeUploadPath(value?: string | null): string | undefined {
    if (!value) return value ?? undefined;
    const raw = String(value).trim();
    if (!raw) return undefined;
    if (raw.startsWith('/uploads/')) return raw;
    if (raw.startsWith('uploads/')) return `/${raw}`;

    const match = raw.match(/^https?:\/\/[^/]+(\/uploads\/.*)$/i);
    if (match?.[1]) return match[1];
    return raw;
  }

  private normalizeArticleImage<T extends { image?: string }>(article: T): T {
    return {
      ...article,
      image: this.normalizeUploadPath(article.image),
    };
  }

  private async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;
    const baseUrl = resolveApiBaseUrl();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    let response: Response;
    try {
      response = await fetch(`${baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
      });
    } catch {
      throw new Error(
        typeof window !== 'undefined'
          ? 'Cannot reach API. Start the backend (e.g. mvn spring-boot:run -Pdev), then reload. Requests use Next.js /api proxy — ensure port matches BACKEND_URL or NEXT_PUBLIC_API_URL in .env.local.'
          : `Cannot reach API at ${baseUrl}. Set INTERNAL_API_URL or NEXT_PUBLIC_API_URL.`
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      const msg =
        (json as { message?: string; error?: string }).message ||
        (json as { message?: string; error?: string }).error ||
        'Request failed';
      throw new Error(msg);
    }

    // Spring ApiResponse { success, message, data }
    if (json && typeof json === 'object' && 'success' in json) {
      const wrap = json as { success: boolean; message?: string; data?: unknown };
      if (wrap.success === false) {
        throw new Error(wrap.message || 'Request failed');
      }
      if ('data' in wrap && wrap.data !== undefined) {
        return wrap.data as T;
      }
    }

    return json as T;
  }

  // Auth
  async login(email: string, password: string) {
    return this.fetch<{
      user: any;
      accessToken: string;
      refreshToken: string;
      permissions: string[];
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: { name: string; email: string; password: string; phone?: string }) {
    return this.fetch<{ user: any; accessToken: string; refreshToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe(token: string) {
    return this.fetch<any>('/auth/me', { token });
  }

  async updateMe(token: string, data: { name?: string; phone?: string; address?: string; avatar?: string }) {
    return this.fetch<any>('/auth/me', {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    });
  }

  async uploadMyAvatar(token: string, file: File) {
    const baseUrl = resolveApiBaseUrl();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${baseUrl}/auth/upload-avatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      const msg = (json as any)?.message || (json as any)?.error || 'Upload failed';
      throw new Error(msg);
    }

    if (json && typeof json === 'object' && 'success' in json && (json as any).data) {
      return (json as any).data as { url: string; path: string };
    }

    return json as { url: string; path: string };
  }

  async logout(token: string) {
    return this.fetch('/auth/logout', {
      method: 'POST',
      token,
    });
  }

  // Products
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    const response = await this.fetch<any>(`/products?${searchParams.toString()}`);
    if (response.items && response.total !== undefined) {
      return response;
    }
    return { items: [], total: 0 };
  }

  async getProduct(slug: string) {
    return this.fetch<any>(`/products/${slug}`);
  }

  // Categories
  async getCategories() {
    const response = await this.fetch<any>('/categories');
    if (Array.isArray(response)) return response;
    return [];
  }

  async getCategory(slug: string) {
    return this.fetch<any>(`/categories/${slug}`);
  }

  // Orders
  async getOrders(token: string, params?: { page?: number; status?: string }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    return this.fetch<{ items: any[]; total: number }>(`/orders?${searchParams.toString()}`, { token });
  }

  async getOrder(token: string, id: string) {
    return this.fetch<any>(`/orders/${id}`, { token });
  }

  async createOrder(token: string, data: any) {
    return this.fetch<any>('/orders', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    });
  }

  // Articles
  async getArticles(params?: { page?: number; category?: string; search?: string; locale?: string }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    const response = await this.fetch<{ items: any[]; total: number }>(`/articles?${searchParams.toString()}`);
    if (response.items && response.total !== undefined) {
      return {
        ...response,
        items: Array.isArray(response.items)
          ? response.items.map((article: any) => this.normalizeArticleImage(article))
          : [],
      };
    }
    return { items: [], total: 0 };
  }

  async getArticle(slug: string, locale?: string) {
    const searchParams = new URLSearchParams();
    if (locale) searchParams.append('locale', locale);
    const queryString = searchParams.toString();
    const data = await this.fetch<any>(`/articles/${slug}${queryString ? `?${queryString}` : ''}`);
    return this.normalizeArticleImage(data);
  }

  async getFeaturedArticles(locale?: string) {
    const q = locale ? `?locale=${encodeURIComponent(locale)}` : '';
    const data = await this.fetch<any[]>(`/articles/featured${q}`);
    return Array.isArray(data) ? data.map((article: any) => this.normalizeArticleImage(article)) : [];
  }

  // CT GROUP — public
  async getPublicSiteSettings() {
    const sep = '?';
    const noCache = `${sep}_ts=${Date.now()}`;
    return this.fetch<{
      logoPath?: string | null;
      bannerPath?: string | null;
      bannerImages?: string[] | null;
      phone?: string | null;
      email?: string | null;
      addressVi?: string | null;
      addressEn?: string | null;
      introTitle?: string | null;
      introSloganVi?: string | null;
      introSloganEn?: string | null;
      introDescriptionVi?: string | null;
      introDescriptionEn?: string | null;
      introDescription2Vi?: string | null;
      introDescription2En?: string | null;
      introDescription3Vi?: string | null;
      introDescription3En?: string | null;
      introContentVi?: string | null;
      introContentEn?: string | null;
      socialLinks?: Array<{ href: string; icon: string; label: string }> | null;
    }>(`/public/settings/site${noCache}`);
  }

  async getAdminSiteSettings(token: string) {
    return this.fetch<{
      logoPath?: string | null;
      bannerPath?: string | null;
      bannerImages?: string[] | null;
      phone?: string | null;
      email?: string | null;
      addressVi?: string | null;
      addressEn?: string | null;
      introTitle?: string | null;
      introSloganVi?: string | null;
      introSloganEn?: string | null;
      introDescriptionVi?: string | null;
      introDescriptionEn?: string | null;
      introDescription2Vi?: string | null;
      introDescription2En?: string | null;
      introDescription3Vi?: string | null;
      introDescription3En?: string | null;
      introContentVi?: string | null;
      introContentEn?: string | null;
      socialLinks?: Array<{ href: string; icon: string; label: string }> | null;
    }>(`/admin/settings/site`, { token });
  }

  async updateAdminSiteSettings(
    token: string,
    data: {
      logoPath?: string | null;
      bannerPath?: string | null;
      bannerImages?: string[] | null;
      phone?: string | null;
      email?: string | null;
      addressVi?: string | null;
      addressEn?: string | null;
      introTitle?: string | null;
      introSloganVi?: string | null;
      introSloganEn?: string | null;
      introDescriptionVi?: string | null;
      introDescriptionEn?: string | null;
      introDescription2Vi?: string | null;
      introDescription2En?: string | null;
      introDescription3Vi?: string | null;
      introDescription3En?: string | null;
      introContentVi?: string | null;
      introContentEn?: string | null;
      socialLinks?: Array<{ href: string; icon: string; label: string }> | null;
    }
  ) {
    return this.fetch<any>(`/admin/settings/site`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    });
  }

  async submitContact(data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }) {
    return this.fetch<{ id: string }>('/public/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBusinessSectors(locale?: string) {
    const q = locale ? `?locale=${encodeURIComponent(locale)}` : '';
    const sep = q ? '&' : '?';
    const noCache = `${sep}_ts=${Date.now()}`;
    return this.fetch<
      Array<{
        id: string;
        slug: string;
        sortOrder: number;
        imagePath: string;
        title: string;
        subtitle: string;
        description: string;
        detailHref: string;
      }>
    >(`/public/business-sectors${q}${noCache}`);
  }

  async getBusinessSectorBySlug(slug: string, locale?: string) {
    const q = locale ? `?locale=${encodeURIComponent(locale)}` : '';
    const sep = q ? '&' : '?';
    const noCache = `${sep}_ts=${Date.now()}`;
    return this.fetch<{
      id: string;
      slug: string;
      sortOrder: number;
      imagePath: string;
      title: string;
      subtitle: string;
      description: string;
      detailHref: string;
    }>(`/public/business-sectors/${encodeURIComponent(slug)}${q}${noCache}`);
  }

  async getAdminBusinessSectors(token: string) {
    const r = await this.fetch<any[]>('/admin/business-sectors', { token });
    return Array.isArray(r) ? r : [];
  }

  async createBusinessSector(token: string, data: any) {
    return this.fetch<any>('/admin/business-sectors', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    });
  }

  async updateBusinessSector(token: string, id: string, data: any) {
    return this.fetch<any>(`/admin/business-sectors/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    });
  }

  async deleteBusinessSector(token: string, id: string) {
    return this.fetch<any>(`/admin/business-sectors/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Admin APIs
  async getDashboardStats(token: string, period: string = 'week') {
    return this.fetch<any>(`/dashboard/stats?period=${period}`, { token });
  }

  async getRecentOrders(token: string) {
    const r = await this.fetch<any[]>('/dashboard/recent-orders', { token });
    return r || [];
  }

  async getTopProducts(token: string) {
    const r = await this.fetch<any[]>('/dashboard/top-products', { token });
    return r || [];
  }

  // CRUD Admin
  async createProduct(token: string, data: any) {
    return this.fetch<any>('/products', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    });
  }

  async updateProduct(token: string, id: string, data: any) {
    return this.fetch<any>(`/products/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(token: string, id: string) {
    return this.fetch<any>(`/products/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Categories Admin
  async createCategory(token: string, data: any) {
    return this.fetch<any>('/categories', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    });
  }

  async updateCategory(token: string, id: string, data: any) {
    return this.fetch<any>(`/categories/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(token: string, id: string) {
    return this.fetch<any>(`/categories/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Articles Admin
  async getAdminArticles(token: string, params?: { page?: number; limit?: number; includeUnpublished?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.page !== undefined) searchParams.append('page', String(params.page));
      if (params.limit !== undefined) searchParams.append('limit', String(params.limit));
      if (params.includeUnpublished) searchParams.append('includeUnpublished', 'true');
    }
    const response = await this.fetch<any>(`/admin/articles?${searchParams.toString()}`, { token });
    if (Array.isArray(response)) {
      return response.map((article: any) => this.normalizeArticleImage(article));
    }
    if (response?.items && Array.isArray(response.items)) {
      return {
        ...response,
        items: response.items.map((article: any) => this.normalizeArticleImage(article)),
      };
    }
    return response;
  }

  async createArticle(token: string, data: any) {
    return this.fetch<any>('/admin/articles', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    });
  }

  async updateArticle(token: string, id: string, data: any) {
    return this.fetch<any>(`/admin/articles/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    });
  }

  async deleteArticle(token: string, id: string) {
    return this.fetch<any>(`/admin/articles/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  async uploadAdminImage(token: string, file: File) {
    const baseUrl = resolveApiBaseUrl();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${baseUrl}/admin/uploads/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      const msg = (json as any)?.message || (json as any)?.error || 'Upload failed';
      throw new Error(msg);
    }

    if (json && typeof json === 'object' && 'success' in json && (json as any).data) {
      return (json as any).data as { url: string; path: string };
    }

    return json as { url: string; path: string };
  }

  // Orders Admin
  async updateOrderStatus(token: string, id: string, status: string, note?: string) {
    return this.fetch<any>(`/orders/${id}/status`, {
      method: 'PUT',
      token,
      body: JSON.stringify({ status, note }),
    });
  }

  // Users Admin
  async getUsers(token: string, params?: { page?: number; search?: string; role?: string }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    return this.fetch<{ items: any[]; total: number }>(`/admin/users?${searchParams.toString()}`, { token });
  }

  async updateUser(token: string, id: string, data: any) {
    return this.fetch<any>(`/admin/users/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    });
  }

  async assignUserRoles(token: string, userId: string, roleIds: string[]) {
    return this.fetch<any>(`/admin/users/${userId}/roles`, {
      method: 'POST',
      token,
      body: JSON.stringify({ roleIds }),
    });
  }

  async deleteUser(token: string, id: string) {
    return this.fetch<any>(`/admin/users/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // RBAC Admin
  async getRoles(token: string) {
    const r = await this.fetch<any[]>('/roles', { token });
    return r || [];
  }

  async createRole(token: string, data: any) {
    return this.fetch<any>('/roles', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    });
  }

  async updateRole(token: string, id: string, data: any) {
    return this.fetch<any>(`/roles/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    });
  }

  async deleteRole(token: string, id: string) {
    return this.fetch<any>(`/roles/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  async assignRolePermissions(token: string, roleId: string, permissionIds: string[]) {
    return this.fetch<any>(`/roles/${roleId}/permissions`, {
      method: 'POST',
      token,
      body: JSON.stringify(permissionIds),
    });
  }

  async getPermissions(token: string) {
    return this.fetch<{ permissions: any[]; grouped: Record<string, any[]> }>('/permissions', { token });
  }

  async getUserPermissions(token: string, userId: string) {
    return this.fetch<any>(`/users/${userId}/permissions`, { token });
  }
}

export const api = new ApiClient();
