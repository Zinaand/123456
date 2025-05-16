import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 允许发送cookies
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token（客户端）
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权错误
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// 视频相关API
export const videoApi = {
  getVideos: (params?: {
    page?: number;
    size?: number;
    keyword?: string; 
    categoryId?: number;
    accessType?: string;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    if (params?.keyword) queryParams.append('keyword', params.keyword);
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId.toString());
    if (params?.accessType) queryParams.append('accessType', params.accessType);
    if (params?.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    console.log(`请求视频列表API: /api/videos${queryString}`);
    return api.get(`/api/videos${queryString}`);
  },
  getVideoById: (id: number) => api.get(`/api/videos/${id}`),
  createVideo: (formData: FormData) => api.post('/api/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateVideo: (id: number, formData: FormData) => api.put(`/api/videos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteVideo: (id: number) => api.delete(`/api/videos/${id}`),
  getVideoStats: (id: number) => api.get(`/api/videos/${id}/stats`),
};

// 分类相关API
export const categoryApi = {
  getCategories: () => api.get('/api/categories'),
  getCategoryById: (id: number) => api.get(`/api/categories/${id}`),
};

// 用户相关API
export const userApi = {
  login: (data: { username: string; password: string }) =>
    api.post('/api/auth/login', data),
  register: (data: { username: string; password: string; email: string }) =>
    api.post('/api/auth/register', data),
  getProfile: () => api.get('/api/user/profile'),
};

// 会员相关API
export const membershipApi = {
  getMembershipInfo: () => api.get('/api/membership'),
  upgradeMembership: (planId: number) => api.post('/api/membership/upgrade', { planId }),
};

// 评论相关 API
export const commentApi = {
  getComments: (videoId: number) => api.get(`/api/videos/${videoId}/comments`),
  createComment: (videoId: number, data: { content: string }) =>
    api.post(`/api/videos/${videoId}/comments`, data),
  deleteComment: (commentId: number) => api.delete(`/api/comments/${commentId}`),
};

// 观看历史相关 API
export const watchHistoryApi = {
  getHistory: () => api.get('/api/watch-history'),
  addToHistory: (videoId: number) => api.post('/api/watch-history', { videoId }),
  clearHistory: () => api.delete('/api/watch-history'),
};

// 支付相关 API
export const paymentApi = {
  // 获取支付历史
  getPaymentHistory: () => api.get('/api/payments'),
  
  // 创建支付订单（通用）
  createPayment: (data: { amount: number; type: string }) =>
    api.post('/api/payments', data),
    
  // 微信支付
  createWechatPayment: (data: { 
    amount: string | number; 
    membershipType: string; 
    userId?: number;
    description?: string; 
  }) => {
    // 确保数据格式正确
    const paymentData = {
      ...data,
      amount: String(data.amount), // 确保金额是字符串
      membershipType: String(data.membershipType).toUpperCase() // 确保会员类型是大写字符串
    };
    console.log('发送微信支付请求:', JSON.stringify(paymentData));
    
    // 获取token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // 直接使用fetch，绕过axios
    return fetch('http://localhost:8090/api/payments/wechat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(paymentData)
    }).then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          console.error('微信支付请求失败:', text);
          throw new Error(text);
        });
      }
      return response.json();
    });
  },
  
  // 支付宝支付
  createAlipayPayment: (data: { 
    amount: string | number; 
    membershipType: string; 
    userId?: number;
    description?: string; 
  }) => {
    // 确保数据格式正确
    const paymentData = {
      ...data,
      amount: String(data.amount), // 确保金额是字符串
      membershipType: String(data.membershipType).toUpperCase() // 确保会员类型是大写字符串
    };
    console.log('发送支付宝支付请求:', JSON.stringify(paymentData));
    
    // 获取token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // 直接使用fetch，绕过axios
    return fetch('http://localhost:8090/api/payments/alipay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(paymentData)
    }).then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          console.error('支付宝支付请求失败:', text);
          throw new Error(text);
        });
      }
      return response.json();
    });
  },
  
  // 查询支付状态
  checkPaymentStatus: (paymentId: string) => 
    api.get(`/api/payments/${paymentId}/status`),
    
  // 支付成功后的回调处理
  handlePaymentCallback: (paymentId: string, data: any) =>
    api.post(`/api/payments/${paymentId}/callback`, data),
    
  // 取消支付
  cancelPayment: (paymentId: string) =>
    api.post(`/api/payments/${paymentId}/cancel`),
};

// 反馈相关 API
export const feedbackApi = {
  submitFeedback: (data: { content: string; type: string }) =>
    api.post('/api/feedback', data),
  getFeedback: () => api.get('/api/feedback'),
};

// 学习资料相关 API
export const materialApi = {
  getMaterials: () => api.get('/api/materials'),
  getMaterialById: (id: number) => api.get(`/api/materials/${id}`),
  downloadMaterial: (id: number) => api.get(`/api/materials/${id}/download`),
};

// 统计分析相关 API
export const statsApi = {
  // 获取所有用户的观看时间
  getAllUserWatchTime: () => 
    api.get('/api/stats/user-watch-time'),
  
  // 获取所有视频的播放时间
  getAllVideoPlayTime: () => 
    api.get('/api/stats/video-play-time'),
  
  // 获取特定用户的观看时间
  getUserWatchTime: (userId: number) => 
    api.get(`/api/stats/user/${userId}/watch-time`),
  
  // 获取特定视频的播放时间
  getVideoPlayTime: (videoId: number) => 
    api.get(`/api/stats/video/${videoId}/play-time`),
};

export default api; 