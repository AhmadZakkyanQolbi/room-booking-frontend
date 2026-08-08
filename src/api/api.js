import axios from 'axios';

const API_BASE = 'http://localhost:5196/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (email, password) => {
  try {
    console.log('[Login] Attempting login for:', email);
    const response = await api.post('/auth/login', { email, password });
    console.log('[Login] Response:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      console.log('[Login] Token saved successfully');
      return { success: true, data: response.data };
    } else {
      console.warn('[Login] No token in response');
      return { 
        success: false, 
        message: 'Token tidak ditemukan dalam response' 
      };
    }
  } catch (error) {
    console.error('[Login] Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Login gagal'
    };
  }
};

export const logoutUser = () => {
  console.log('[Logout] User logged out');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    console.warn('[getUser] Failed to parse user data');
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[getCurrentUser] Error:', error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Gagal get user data' 
    };
  }
};

export const getDepartments = async () => {
  try {
    const response = await api.get('/departments');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[getDepartments] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal load departments'
    };
  }
};

export const createDepartment = async (data) => {
  try {
    const response = await api.post('/departments', data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[createDepartment] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal tambah department'
    };
  }
};

export const updateDepartment = async (id, data) => {
  try {
    const response = await api.put(`/departments/${id}`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[updateDepartment] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal update department'
    };
  }
};

export const deleteDepartment = async (id) => {
  try {
    await api.delete(`/departments/${id}`);
    return { success: true };
  } catch (error) {
    console.error('[deleteDepartment] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal hapus department'
    };
  }
};

export const getDashboard = async () => {
  try {
    const response = await api.get('/dashboard/summary');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[getDashboard] Error:', error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Gagal load dashboard' 
    };
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[getDashboardStats] Error:', error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Gagal load stats' 
    };
  }
};

export const getRooms = async () => {
  try {
    const response = await api.get('/rooms');
    console.log('[getRooms] Success:', response.data.length, 'rooms found');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[getRooms] Error:', error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Gagal load rooms' 
    };
  }
};

export const getRoomById = async (id) => {
  try {
    const response = await api.get(`/rooms/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[getRoomById] Error:', error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Gagal load room' 
    };
  }
};

export const createRoom = async (formData) => {
  try {
    const response = await api.post('/rooms', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    console.log('[createRoom] Success:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[createRoom] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal menambah ruangan'
    };
  }
};

export const updateRoom = async (id, formData) => {
  try {
    const response = await api.put(`/rooms/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[updateRoom] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal update ruangan'
    };
  }
};

export const deleteRoom = async (id) => {
  try {
    await api.delete(`/rooms/${id}`);
    return { success: true };
  } catch (error) {
    console.error('[deleteRoom] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal hapus ruangan'
    };
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[getUsers] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal load users'
    };
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[getUserById] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal load user'
    };
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[createUser] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal tambah user'
    };
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[updateUser] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal update user'
    };
  }
};

export const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
    return { success: true };
  } catch (error) {
    console.error('[deleteUser] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal hapus user'
    };
  }
};

export const getCalendar = async (startDate, endDate) => {
  try {
    const response = await api.get('/bookings/calendar', {
      params: { startDate, endDate }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[getCalendar] Error:', error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Gagal load calendar' 
    };
  }
};

export const getBookings = async (params = {}) => {
  try {
    const response = await api.get('/bookings', { params });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[getBookings] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal load bookings'
    };
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await api.get(`/bookings/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[getBookingById] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal load booking'
    };
  }
};

export const createBooking = async (data) => {
  try {
    const response = await api.post('/bookings', data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[createBooking] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal membuat booking'
    };
  }
};

export const updateBooking = async (id, data) => {
  try {
    const response = await api.put(`/bookings/${id}`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[updateBooking] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal update booking'
    };
  }
};

export const updateBookingStatus = async (id, status, rejectionReason = null) => {
  try {
    const body = { status };
    if (rejectionReason) body.rejectionReason = rejectionReason;
    const response = await api.put(`/bookings/${id}/status`, body);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[updateBookingStatus] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal update status'
    };
  }
};

export const cancelBooking = async (id) => {
  try {
    await api.delete(`/bookings/${id}`);
    return { success: true };
  } catch (error) {
    console.error('[cancelBooking] Error:', error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Gagal cancel booking' 
    };
  }
};

export const exportExcel = async (params = null) => {
  try {
    const config = {
      responseType: 'blob',
      timeout: 30000, 
    };
    
    if (params) {
      config.params = params;
    }
    
    console.log('[exportExcel] Exporting with params:', params);
    const response = await api.get('/reports/export/excel', config);
    
    if (response.data instanceof Blob) {
      console.log('[exportExcel] Success, blob size:', response.data.size);
      return { success: true, data: response.data };
    }
    
    const text = await response.data.text();
    try {
      const json = JSON.parse(text);
      return { success: false, message: json.message || 'Gagal export Excel' };
    } catch {
      return { success: false, message: 'Gagal export Excel' };
    }
  } catch (error) {
    console.error('[exportExcel] Error:', error.message);
    
    if (error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        return { 
          success: false, 
          message: json.message || 'Gagal export Excel' 
        };
      } catch {
        return { 
          success: false, 
          message: 'Terjadi kesalahan saat export data' 
        };
      }
    }
    
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Terjadi kesalahan saat export data' 
    };
  }
};

export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[getNotifications] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal load notifications'
    };
  }
};

export const markNotificationAsRead = async (id) => {
  try {
    await api.put(`/notifications/${id}/read`);
    return { success: true };
  } catch (error) {
    console.error('[markNotificationAsRead] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal update notification'
    };
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    await api.put('/notifications/read-all');
    return { success: true };
  } catch (error) {
    console.error('[markAllNotificationsAsRead] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal update notifications'
    };
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await api.put('/profile', data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[updateProfile] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal update profile'
    };
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    await api.post('/profile/change-password', { oldPassword, newPassword });
    return { success: true };
  } catch (error) {
    console.error('[changePassword] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal change password'
    };
  }
};

export const getRoomStatistics = async (params = {}) => {
  try {
    const response = await api.get('/statistics/rooms', { params });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[getRoomStatistics] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal load statistics'
    };
  }
};

export const getBookingStatistics = async (params = {}) => {
  try {
    const response = await api.get('/statistics/bookings', { params });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('[getBookingStatistics] Error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Gagal load statistics'
    };
  }
};

export const downloadFile = (blob, fileName) => {
  try {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    console.log('[downloadFile] File downloaded:', fileName);
  } catch (error) {
    console.error('[downloadFile] Error:', error.message);
  }
};

export default api;