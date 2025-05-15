"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Eye, Film, Users, FileText, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { videoApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

// 视频数据接口
interface Video {
  id: number
  title: string
  description: string
  duration: number
  videoUrl: string
  thumbnailUrl: string
  instructorId: number
  views: number
  accessType: string
  status: string
  uploadDate: string
  categoryId: number
}

export default function VideoDetailsPage({ params }: { params: { id: string } }) {
  const [video, setVideo] = useState<Video | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 获取视频数据
  useEffect(() => {
    async function fetchVideoData() {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await videoApi.getVideoById(Number(params.id))
        
        if (response.data && response.data.data) {
          setVideo(response.data.data)
        } else {
          setError("获取视频数据失败")
        }
      } catch (err) {
        console.error("获取视频数据错误", err)
        setError("无法加载视频，请稍后重试")
        toast({
          variant: "destructive",
          title: "加载失败",
          description: "无法获取视频数据，请稍后重试",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchVideoData()
  }, [params.id])

  // 格式化时长（秒转分钟）
  const formatDuration = (seconds: number | undefined): string => {
    if (!seconds) return "0分钟"
    const minutes = Math.floor(seconds / 60)
    return `${minutes}分钟`
  }

  // 格式化日期
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // 加载中状态
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-40 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  // 错误状态
  if (error || !video) {
    return (
      <div className="p-6 space-y-4">
        <Link href="/admin/videos" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回视频列表
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-destructive mb-4">{error || "视频不存在"}</div>
            <Button asChild>
              <Link href="/admin/videos">返回视频列表</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <Link href="/admin/videos" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回视频列表
        </Link>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/video/${video.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              预览
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/videos/${video.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              编辑
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{video.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant={video.status === "published" ? "secondary" : "outline"}>
              {video.status === "published" ? "已发布" : "草稿"}
            </Badge>
            <Badge variant={video.accessType === "internal" ? "secondary" : "outline"}>
              {video.accessType === "internal" ? "会员专享" : "公开课程"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>视频预览</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                {video.thumbnailUrl ? (
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                ) : video.videoUrl ? (
                  <video 
                    src={video.videoUrl} 
                    controls 
                    poster="/placeholder.svg?height=400&width=800" 
                    className="w-full h-full object-cover"
                  >
                    您的浏览器不支持视频播放
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Film className="h-12 w-12 mr-2" />
                    <span>无视频预览</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>视频信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">上传时间: {formatDate(video.uploadDate)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">时长: {formatDuration(video.duration)}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">观看次数: {video.views}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">讲师ID: {video.instructorId}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">分类ID: {video.categoryId}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>视频描述</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{video.description || "暂无描述"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 