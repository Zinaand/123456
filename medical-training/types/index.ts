// 视频数据接口定义
export interface Video {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  instructorId: number;
  duration: number;
  videoUrl: string;
  thumbnailUrl: string;
  accessType: string; // external:非会员可观看5分钟,internal:仅会员
  views: number;
  status: string;
  uploadDate: string;
}

// 分页响应接口
export interface PaginatedResponse<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// API响应接口
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
} 