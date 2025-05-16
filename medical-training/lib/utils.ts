import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化视频时长（秒）为易读格式
 * @param seconds 视频时长（秒）
 * @returns 格式化后的时长字符串，例如：1小时25分钟
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0分钟";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}小时${minutes > 0 ? ` ${minutes}分钟` : ''}`;
  }
  
  return `${minutes}分钟`;
}
