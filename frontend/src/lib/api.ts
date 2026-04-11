const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl = API_URL;

  private async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
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
    const response = await this.fetch<any>(
      `/products?${searchParams.toString()}`
    );
    // Handle both response formats
    if (response.items && response.total !== undefined) {
      return response;
    }
    if (response.data) {
      return response.data;
    }
    return { items: response, total: Array.isArray(response) ? response.length : 0 };
  }

  async getProduct(slug: string) {
    return this.fetch<any>(`/products/${slug}`);
  }

  // Categories
  async getCategories() {
    const response = await this.fetch<any>('/categories');
    if (Array.isArray(response)) return response;
    return response.data || [];
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
    return response.data || { items: [], total: 0 };
  }

  async getArticle(slug: string, locale?: string) {
    const searchParams = new URLSearchParams();
    if (locale) searchParams.append('locale', locale);
    const queryString = searchParams.toString();
    const response = await this.fetch<any>(`/articles/${slug}${queryString ? `?${queryString}` : ''}`);
    return response.data;
  }

  // Admin APIs
  async getDashboardStats(token: string, period: string = 'week') {
    const response = await this.fetch<any>(`/dashboard/stats?period=${period}`, { token });
    return response.data;
  }

  async getRecentOrders(token: string) {
    const response = await this.fetch<any[]>('/dashboard/recent-orders', { token });
    return response.data || [];
  }

  async getTopProducts(token: string) {
    const response = await this.fetch<any[]>('/dashboard/top-products', { token });
    return response.data || [];
  }

  // CRUD Admin
  async createProduct(token: string, data: any) {
    const response = await this.fetch<any>('/products', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async updateProduct(token: string, id: string, data: any) {
    const response = await this.fetch<any>(`/products/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteProduct(token: string, id: string) {
    return this.fetch<any>(`/products/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Categories Admin
  async createCategory(token: string, data: any) {
    const response = await this.fetch<any>('/categories', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async updateCategory(token: string, id: string, data: any) {
    const response = await this.fetch<any>(`/categories/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    });
    return response.data;
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
    return response.data || response;
  }

  async createArticle(token: string, data: any) {
    const response = await this.fetch<any>('/admin/articles', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async updateArticle(token: string, id: string, data: any) {
    const response = await this.fetch<any>(`/admin/articles/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteArticle(token: string, id: string) {
    return this.fetch<any>(`/admin/articles/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Orders Admin
  async updateOrderStatus(token: string, id: string, status: string, note?: string) {
    const response = await this.fetch<any>(`/orders/${id}/status`, {
      method: 'PUT',
      token,
      body: JSON.stringify({ status, note }),
    });
    return response.data;
  }

  // Users Admin
  async getUsers(token: string, params?: { page?: number; search?: string; role?: string }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    // Backend endpoint: /api/admin/users
    const response = await this.fetch<{ items: any[]; total: number }>(`/admin/users?${searchParams.toString()}`, { token });
    return response.data || response;
  }

  async updateUser(token: string, id: string, data: any) {
    const response = await this.fetch<any>(`/admin/users/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async assignUserRoles(token: string, userId: string, roleIds: string[]) {
    const response = await this.fetch<any>(`/admin/users/${userId}/roles`, {
      method: 'POST',
      token,
      body: JSON.stringify({ roleIds }),
    });
    return response.data;
  }

  async deleteUser(token: string, id: string) {
    return this.fetch<any>(`/admin/users/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // RBAC Admin
  async getRoles(token: string) {
    const response = await this.fetch<any[]>('/roles', { token });
    return response.data || response || [];
  }

  async createRole(token: string, data: any) {
    const response = await this.fetch<any>('/roles', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async updateRole(token: string, id: string, data: any) {
    const response = await this.fetch<any>(`/roles/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteRole(token: string, id: string) {
    return this.fetch<any>(`/roles/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  async assignRolePermissions(token: string, roleId: string, permissionIds: string[]) {
    const response = await this.fetch<any>(`/roles/${roleId}/permissions`, {
      method: 'POST',
      token,
      body: JSON.stringify(permissionIds), // Backend expects array of permission IDs directly
    });
    return response.data;
  }

  async getPermissions(token: string) {
    const response = await this.fetch<{ permissions: any[]; grouped: Record<string, any[]> }>('/permissions', { token });
    return response.data;
  }

  async getUserPermissions(token: string, userId: string) {
    const response = await this.fetch<any>(`/users/${userId}/permissions`, { token });
    return response.data;
  }
}

export const api = new ApiClient();
