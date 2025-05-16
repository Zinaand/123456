'use client';

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Clock, Eye, CalendarIcon, Tag } from "lucide-react";
import { ApiResponse, Video } from "@/types";
import { videoApi } from "@/lib/api";
import { formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategoryNameById } from "@/lib/category-utils";
import { toast } from "@/components/ui/use-toast";
import { VideoPlayer } from "@/components/video-player";

export default function CourseDetailPage() {
  const params = useParams();
  const videoId = Number(params.id);
  
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        setLoading(true);
        const response = await videoApi.getVideoById(videoId);
        const apiResponse = response.data as ApiResponse<Video>;
        
        if (apiResponse.code === 200 && apiResponse.data) {
          setVideo(apiResponse.data);
        } else {
          setError("获取课程详情失败");
        }
      } catch (error) {
        console.error("获取课程详情失败:", error);
        setError("获取课程详情失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoDetail();
    }
  }, [videoId]);

  // 加载状态
  if (loading) {
    return (
      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="w-full aspect-video bg-muted animate-pulse rounded-lg mb-6" />
          <div className="h-8 bg-muted animate-pulse rounded-md mb-4 w-2/3" />
          <div className="h-4 bg-muted animate-pulse rounded-md mb-2 w-1/2" />
          <div className="h-4 bg-muted animate-pulse rounded-md mb-2 w-1/3" />
          <div className="h-32 bg-muted animate-pulse rounded-md mt-6" />
        </div>
      </div>
    );
  }

  // 错误状态
  if (error || !video) {
    return (
      <div className="container py-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">出错了</h1>
          <p className="text-red-500 mb-4">{error || "未找到该课程"}</p>
          <Button onClick={() => window.history.back()}>返回上一页</Button>
        </div>
      </div>
    );
  }

  // 格式化上传日期
  const uploadDate = new Date(video.uploadDate).toLocaleDateString('zh-CN');
  // 获取分类名称
  const categoryName = getCategoryNameById(video.categoryId);

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        {/* 视频播放器 */}
        <div className="w-full aspect-video mb-6">
          {video.videoUrl ? (
            <VideoPlayer
              videoUrl={video.videoUrl}
              thumbnailUrl={video.thumbnailUrl}
              title={video.title}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => {
                toast({
                  title: "视频加载失败",
                  description: "无法加载视频，请检查URL或稍后重试",
                  variant: "destructive",
                });
              }}
              allowDownload={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
              <p className="text-muted-foreground">视频未找到</p>
            </div>
          )}
        </div>

        {/* 课程信息 */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {video.accessType === "internal" && (
              <Badge variant="outline" className="bg-primary/10">会员专享</Badge>
            )}
            <Badge variant="outline">视频教程</Badge>
            <Badge variant="outline" className="bg-secondary/10">{categoryName}</Badge>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight mb-2">{video.title}</h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatDuration(video.duration)}</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              <span>{video.views} 次观看</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>上传于 {uploadDate}</span>
            </div>
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              <span>分类：{categoryName}</span>
            </div>
          </div>
        </div>

        {/* 课程描述 */}
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-4">课程描述</h2>
          <p className="whitespace-pre-line">{video.description}</p>
        </div>

        {/* 相关操作 */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }}>
            {isPlaying ? "正在学习" : "开始学习"}
          </Button>
          <Button variant="outline">收藏课程</Button>
        </div>
      </div>
    </div>
  );
} 