// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// 视频相关类型
export interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

// 评论相关类型
export interface Comment {
  id: number;
  content: string;
  userId: number;
  videoId: number;
  createdAt: string;
  updatedAt: string;
}

// 观看历史相关类型
export interface WatchHistory {
  id: number;
  userId: number;
  videoId: number;
  watchTime: number;
  createdAt: string;
  updatedAt: string;
}

// 会员相关类型
export interface Membership {
  id: number;
  userId: number;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 支付相关类型
export interface Payment {
  id: number;
  userId: number;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 反馈相关类型
export interface Feedback {
  id: number;
  userId: number;
  content: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// 学习资料相关类型
export interface Material {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// 分类相关类型
export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// API 响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
} 