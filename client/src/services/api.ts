// API Service Layer - Connects frontend to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Request failed',
          error: data.error,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check your connection.',
        error: 'NETWORK_ERROR',
      };
    }
  }

  // Auth
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, phone: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password }),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Restaurants
  async getRestaurants(params?: { cuisine?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.cuisine) query.append('cuisine', params.cuisine);
    if (params?.search) query.append('search', params.search);
    return this.request(`/restaurants?${query.toString()}`);
  }

  async getRestaurant(id: string) {
    return this.request(`/restaurants/${id}`);
  }

  async getRestaurantMenu(restaurantId: string) {
    return this.request(`/restaurants/${restaurantId}/menu`);
  }

  // Orders
  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  async placeOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(id: string, reason: string) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Addresses
  async getAddresses() {
    return this.request('/addresses');
  }

  async createAddress(addressData: any) {
    return this.request('/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  async updateAddress(id: string, addressData: any) {
    return this.request(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  }

  async deleteAddress(id: string) {
    return this.request(`/addresses/${id}`, { method: 'DELETE' });
  }

  // Favourites
  async getFavourites() {
    return this.request('/favourites');
  }

  async addFavourite(type: string, itemId: string) {
    return this.request('/favourites', {
      method: 'POST',
      body: JSON.stringify({ type, itemId }),
    });
  }

  async removeFavourite(id: string) {
    return this.request(`/favourites/${id}`, { method: 'DELETE' });
  }

  // Restaurant Dashboard
  async getRestaurantDashboard() {
    return this.request('/restaurant/dashboard');
  }

  async getRestaurantOrders() {
    return this.request('/restaurant/orders');
  }

  async acceptOrder(orderId: string) {
    return this.request(`/restaurant/orders/${orderId}/accept`, { method: 'PUT' });
  }

  async rejectOrder(orderId: string, reason: string) {
    return this.request(`/restaurant/orders/${orderId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request(`/restaurant/orders/${orderId}/status/${status}`, { method: 'PUT' });
  }

  // Rider Dashboard
  async getRiderDashboard() {
    return this.request('/rider/dashboard');
  }

  async getDeliveryRequests() {
    return this.request('/rider/requests');
  }

  async acceptDelivery(orderId: string) {
    return this.request(`/rider/requests/${orderId}/accept`, { method: 'POST' });
  }

  async rejectDelivery(orderId: string) {
    return this.request(`/rider/requests/${orderId}/reject`, { method: 'POST' });
  }

  async updateDeliveryStatus(deliveryId: string, status: string) {
    return this.request(`/rider/deliveries/${deliveryId}/status/${status}`, { method: 'PUT' });
  }

  async verifyOtp(deliveryId: string, otp: string) {
    return this.request(`/rider/deliveries/${deliveryId}/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ otp }),
    });
  }

  async toggleRiderStatus() {
    return this.request('/rider/status', { method: 'PUT' });
  }

  // Admin Dashboard
  async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  async getAdminAnalytics() {
    return this.request('/admin/analytics');
  }

  async getUsers(params?: { role?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.role) query.append('role', params.role);
    if (params?.status) query.append('status', params.status);
    return this.request(`/admin/users?${query.toString()}`);
  }

  async updateUserStatus(userId: string, status: string) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getAdminRestaurants(params?: { status?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    return this.request(`/admin/restaurants?${query.toString()}`);
  }

  async approveRestaurant(restaurantId: string) {
    return this.request(`/admin/restaurants/${restaurantId}/approve`, { method: 'PUT' });
  }

  async rejectRestaurant(restaurantId: string, reason: string) {
    return this.request(`/admin/restaurants/${restaurantId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  async getAdminRiders(params?: { verificationStatus?: string }) {
    const query = new URLSearchParams();
    if (params?.verificationStatus) query.append('verificationStatus', params.verificationStatus);
    return this.request(`/admin/riders?${query.toString()}`);
  }

  async approveRider(riderId: string) {
    return this.request(`/admin/riders/${riderId}/approve`, { method: 'PUT' });
  }

  async rejectRider(riderId: string) {
    return this.request(`/admin/riders/${riderId}/reject`, { method: 'PUT' });
  }

  async getAdminOrders(params?: { status?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    return this.request(`/admin/orders?${query.toString()}`);
  }
}

export const api = new ApiService();
