// API 响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  name?: string;
  phone?: string;
  memberNumber?: string;
  createdAt: string;
  updatedAt: string;
  membershipType?: string;
  membershipExpireDate?: string;
}

// 登录响应类型
export interface LoginResponse {
  token: string;
  userId: number;
  name: string;
  role: string;
  memberNumber?: string;
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

// 支付类型
export enum PaymentType {
  WECHAT = 'WECHAT',
  ALIPAY = 'ALIPAY',
  CARD = 'CARD'
}

// 支付状态
export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CLOSED = 'CLOSED'
}

// 会员类型
export enum MembershipType {
  YEARLY = 'YEARLY',
  QUARTERLY = 'QUARTERLY',
  MONTHLY = 'MONTHLY'
}

// 支付请求
export interface PaymentRequest {
  amount: number;
  membershipType: string;
  paymentType?: string;
  description?: string;
  userId?: number;
}

// 支付响应
export interface PaymentResponse {
  paymentId: number;
  outTradeNo: string;
  amount: number;
  status: PaymentStatus;
  qrCodeUrl?: string;
  payUrl?: string;
  createdTime: string;
  expireTime: string;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
} 