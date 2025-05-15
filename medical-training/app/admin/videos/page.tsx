"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { videoApi } from "@/lib/api"

// 定义视频对象类型
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
  instructorName?: string
}

export default function VideosPage() {
  // 管理删除对话框
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // 搜索状态
  const [searchQuery, setSearchQuery] = useState("")
  // 加载状态
  const [isLoading, setIsLoading] = useState(true)
  // 视频数据
  const [videos, setVideos] = useState<Video[]>([])
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10 // 每页显示的记录数

  // 获取视频列表
  useEffect(() => {
    fetchVideos(currentPage)
  }, [currentPage])

  // 获取视频数据的函数
  const fetchVideos = async (page = currentPage) => {
    try {
      setIsLoading(true)
      console.log("开始获取视频列表数据，页码：", page)
      
      const response = await videoApi.getVideos({
        size: pageSize,
        page: page
      })
      
      console.log("获取视频列表响应:", response)
      
      if (response.data && response.data.data) {
        const rawRecords = response.data.data.records || [];
        const total = response.data.data.total || 0;
        const pages = Math.ceil(total / pageSize) || 1;
        
        console.log("原始记录数:", rawRecords.length);
        console.log("总记录数:", total);
        console.log("总页数:", pages);
        
        setTotalCount(total);
        setTotalPages(pages);
        
        // 检查每条记录的完整性
        rawRecords.forEach((record: any, index: number) => {
          if (!record.id || !record.title) {
            console.warn(`记录 #${index} 数据不完整:`, record);
          }
        });
        
        // 处理视频数据
        const videosData = rawRecords.map((video: Video, index: number) => {
          console.log(`处理视频 #${index}:`, video);
          
          return {
            ...video,
            // 格式化时长为分钟
            durationFormatted: formatDuration(video.duration),
            // 格式化日期
            uploadDateFormatted: formatDate(video.uploadDate)
          };
        });
        
        console.log("处理后的视频数据:", videosData)
        setVideos(videosData)
      } else {
        console.error("响应数据格式不正确:", response)
        toast({
          variant: "destructive",
          title: "数据格式错误",
          description: "获取到的视频数据格式不正确",
        })
      }
    } catch (error) {
      console.error("获取视频列表失败", error)
      toast({
        variant: "destructive",
        title: "获取视频失败",
        description: "无法获取视频列表，请稍后重试",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 格式化时长（秒转分钟）
  const formatDuration = (seconds: number): string => {
    if (!seconds) return "0分钟"
    const minutes = Math.floor(seconds / 60)
    return `${minutes}分钟`
  }

  // 格式化日期
  const formatDate = (dateString: string): string => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    } catch (e) {
      console.error("日期格式化错误:", e)
      return dateString
    }
  }

  // 确定访问类型
  const getAccessType = (type: string): string => {
    // 转换可能的不同格式的类型值为统一格式
    const normalizedType = type?.toLowerCase();
    
    if (normalizedType === 'internal' || normalizedType === 'member' || normalizedType === 'vip') {
      return 'internal'
    }
    return 'external'
  }

  // 展示状态标签
  const getStatusLabel = (status: string): string => {
    const normalizedStatus = status?.toLowerCase();
    
    if (normalizedStatus === 'published' || normalizedStatus === 'active') {
      return '已发布'
    } else if (normalizedStatus === 'draft') {
      return '草稿'
    } else {
      return status || '未知状态'
    }
  }

  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  // 处理删除视频
  const handleDeleteVideo = async () => {
    if (!videoToDelete) return
    
    try {
      setIsDeleting(true)
      // 调用删除API
      await videoApi.deleteVideo(videoToDelete)
      
      toast({
        title: "视频已删除",
        description: "视频已成功从系统中删除",
      })
      
      // 重新获取视频列表
      fetchVideos(currentPage)
      
      // 关闭对话框并重置状态
      setDeleteDialogOpen(false)
      setVideoToDelete(null)
    } catch (error) {
      console.error("删除视频失败", error)
      toast({
        variant: "destructive",
        title: "删除失败",
        description: "删除视频时出现错误，请重试",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // 处理删除按钮点击
  const handleDeleteClick = (videoId: number) => {
    setVideoToDelete(videoId)
    setDeleteDialogOpen(true)
  }
  
  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // 过滤视频列表
  const filteredVideos = searchQuery
    ? videos.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : videos

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">视频管理</h2>
          <p className="text-muted-foreground">管理系统中的所有视频课程</p>
        </div>
        <Button asChild>
          <Link href="/admin/videos/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            上传新视频
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>视频列表</CardTitle>
          <CardDescription>查看和管理所有视频课程</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="搜索视频..." 
                className="pl-8" 
                value={searchQuery} 
                onChange={handleSearch}
              />
            </div>
            <Button variant="outline">筛选</Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>时长</TableHead>
                  <TableHead>上传日期</TableHead>
                  <TableHead>观看次数</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      正在加载视频数据...
                    </TableCell>
                  </TableRow>
                ) : filteredVideos.length > 0 ? (
                  filteredVideos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium">{video.title}</TableCell>
                      <TableCell>{formatDuration(video.duration)}</TableCell>
                      <TableCell>{formatDate(video.uploadDate)}</TableCell>
                      <TableCell>{video.views}</TableCell>
                      <TableCell>
                        <Badge variant={getAccessType(video.accessType) === "internal" ? "secondary" : "outline"}>
                          {getAccessType(video.accessType) === "internal" ? "会员专享" : "公开课程"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusLabel(video.status) === "已发布" ? "secondary" : "outline"}>
                          {getStatusLabel(video.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/videos/${video.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/videos/${video.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteClick(video.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      没有找到匹配的视频
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* 分页控件 */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              共 {totalCount} 条记录，当前显示第 {currentPage} 页，共 {totalPages} 页
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
                上一页
              </Button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                // 显示当前页附近的页码
                let pageToShow;
                if (totalPages <= 5) {
                  pageToShow = i + 1;
                } else if (currentPage <= 3) {
                  pageToShow = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageToShow = totalPages - 4 + i;
                } else {
                  pageToShow = currentPage - 2 + i;
                }
                
                return (
                  <Button 
                    key={i}
                    variant={currentPage === pageToShow ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handlePageChange(pageToShow)}
                    disabled={isLoading}
                  >
                    {pageToShow}
                  </Button>
                );
              })}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
              >
                下一页
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除视频</DialogTitle>
            <DialogDescription>
              您确定要删除该视频吗？此操作无法撤销，视频相关的所有数据都将被永久删除。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>取消</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteVideo} 
              disabled={isDeleting}
            >
              {isDeleting ? "删除中..." : "确认删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}