'use client';

import Link from "next/link"
import { Clock, Play, Tag } from "lucide-react"
import { useEffect, useState } from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { videoApi } from "@/lib/api"
import { ApiResponse, PaginatedResponse, Video } from "@/types"
import { formatDuration } from "@/lib/utils"
import { getCategoryNameById } from "@/lib/category-utils"

// 这个组件负责展示首页热门课程
export default function FeaturedVideos() {
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedVideos = async () => {
      try {
        // 获取状态为"推荐"的视频，限制4个
        const response = await videoApi.getVideos({
          page: 1,
          size: 4,
          status: "published"
        });
        
        const apiResponse = response.data as ApiResponse<PaginatedResponse<Video>>;
        if (apiResponse.code === 200 && apiResponse.data.records) {
          setFeaturedVideos(apiResponse.data.records);
        }
      } catch (error) {
        console.error('获取推荐视频失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedVideos();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="flex flex-col h-full overflow-hidden">
            <div className="relative aspect-video bg-muted animate-pulse" />
            <CardHeader className="pb-2 pt-4">
              <div className="h-6 bg-muted animate-pulse rounded-md" />
            </CardHeader>
            <CardContent className="pb-2 flex-grow">
              <div className="h-10 bg-muted animate-pulse rounded-md" />
            </CardContent>
            <CardFooter className="pt-2">
              <div className="h-8 w-full bg-muted animate-pulse rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredVideos.map((video) => {
        const categoryName = getCategoryNameById(video.categoryId);
        
        return (
          <Card key={video.id} className="flex flex-col h-full overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative aspect-video overflow-hidden">
              <img
                alt={video.title}
                className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-300"
                src={video.thumbnailUrl || "/placeholder.svg?height=180&width=320"}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="rounded-full bg-white/90 p-2">
                  <Play className="h-8 w-8 text-primary" />
                </div>
              </div>
              {video.accessType === "internal" && (
                <Badge className="absolute top-2 right-2" variant="secondary">
                  会员专享
                </Badge>
              )}
            </div>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2 flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <Tag className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{categoryName}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between items-center">
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {formatDuration(video.duration)}
              </div>
              <Link href={`/courses/${video.id}`}>
                <Button variant="ghost" size="sm">
                  观看课程
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  )
}