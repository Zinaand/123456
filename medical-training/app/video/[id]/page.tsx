"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { videoApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"


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

export default function VideoPage({ params }: { params: { id: string } }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  
  // 视频数据状态
  const [videoData, setVideoData] = useState<Video | null>(null)
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
          setVideoData(response.data.data)
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

  // 模拟从本地存储获取播放进度
  useEffect(() => {
    const savedProgress = localStorage.getItem(`video-progress-${params.id}`)
    if (savedProgress) {
      const savedTime = Number.parseFloat(savedProgress)
      setCurrentTime(savedTime)
      if (videoRef.current) {
        videoRef.current.currentTime = savedTime
      }
    }
  }, [params.id])

  // 处理视频时间更新
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime
      setCurrentTime(current)
      setProgress((current / duration) * 100)
      
      // 保存播放进度到本地存储
      localStorage.setItem(`video-progress-${params.id}`, current.toString())
    }
  }

  // 处理视频加载元数据
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  // 格式化时间显示
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // 格式化时长（秒转分钟）
  const formatDuration = (seconds: number | undefined): string => {
    if (!seconds) return "0分钟"
    const minutes = Math.floor(seconds / 60)
    return `${minutes}分钟`
  }

  // 处理进度条点击
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const clickPosition = e.nativeEvent.offsetX / e.currentTarget.offsetWidth
    const newTime = clickPosition * duration
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
      setProgress((newTime / duration) * 100)
    }
  }

  // 加载中或错误状态
  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[50vh]">
        <p>正在加载视频数据...</p>
      </div>
    )
  }

  if (error || !videoData) {
    return (
      <div className="container py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-destructive mb-4">{error || "视频不存在"}</p>
        <Link href="/courses">
          <Button>返回课程列表</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-4">
        <Link href="/courses" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回课程列表
        </Link>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full aspect-video"
              poster={videoData.thumbnailUrl || "/placeholder.svg?height=400&width=800"}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={() => {
                if (videoRef.current) {
                  if (isPlaying) {
                    videoRef.current.pause()
                  } else {
                    videoRef.current.play()
                  }
                  setIsPlaying(!isPlaying)
                }
              }}
            >
              <source src={videoData.videoUrl} type="video/mp4" />
              您的浏览器不支持视频播放。
            </video>
            
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div 
                className="h-2 bg-muted rounded-full cursor-pointer"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold mb-2">{videoData.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">观看次数: {videoData.views}</Badge>
              <Badge variant="outline">{formatDuration(videoData.duration)}</Badge>
              <Badge variant="outline">上传于: {new Date(videoData.uploadDate).toLocaleDateString()}</Badge>
            </div>
            <p className="text-muted-foreground">{videoData.description}</p>
          </div>
          
          <Tabs defaultValue="materials">
            <TabsList>
              <TabsTrigger value="materials">学习资料</TabsTrigger>
              <TabsTrigger value="notes">笔记</TabsTrigger>
              <TabsTrigger value="comments">讨论</TabsTrigger>
            </TabsList>
            
            <TabsContent value="materials" className="py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">课程讲义</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">PDF, 2.4MB</span>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        下载
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">练习题</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">PDF, 1.8MB</span>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        下载
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="py-4">
              <div className="space-y-4">
                <p className="text-muted-foreground">课程笔记功能即将上线...</p>
              </div>
            </TabsContent>
            
            <TabsContent value="comments" className="py-4">
              <div className="space-y-4">
                <p className="text-muted-foreground">评论功能即将上线...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>课程信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">讲师</h3>
                <p className="text-sm text-muted-foreground">专业医疗培训师</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">课程类型</h3>
                <p className="text-sm text-muted-foreground">医疗培训</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">课程时长</h3>
                <p className="text-sm text-muted-foreground">{formatDuration(videoData.duration)}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">上传日期</h3>
                <p className="text-sm text-muted-foreground">{new Date(videoData.uploadDate).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
