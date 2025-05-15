"use client";
import { BarChart3, FileVideo, TrendingUp, Users, Clock, ArrowRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { PlusCircle, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

// 用户接口定义
interface User {
  id: number;
  memberNumber: string;
  name: string;
  email: string;
  phone?: string;
  registerDate: string;
  status: string;
}

// 视频接口定义
interface Video {
  id: number;
  title: string;
  description: string;
  duration: number; // 秒数
  videoUrl: string;
  thumbnailUrl: string;
  instructorId: number;
  views: number;
  accessType: string;
  status: string;
  uploadDate: string;
  instructorName?: string;
}

export default function AdminDashboard() {
  const pageSize = 5;
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [popularVideos, setPopularVideos] = useState<Video[]>([]);
  const [videoLoading, setVideoLoading] = useState(true);

  const fetchUsers = async (page = 1, keyword = "") => {
    try {
      setLoading(true);
      
      // 从localStorage获取token
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      // 调用用户列表API
      const response = await api.get(`/users`, {
        params: {
          page,
          size: pageSize,
          keyword
        }
      });
      
      // 设置用户列表数据
      if (response.data.success) {
        const userData = response.data.data;
        setUsers(userData.records);
        setTotalPages(userData.pages);
        setCurrentPage(userData.current);
      } else {
        toast({
          title: "获取用户列表失败",
          description: response.data.message || "未知错误",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        // 未授权，跳转到登录页
        router.push('/login');
      } else {
        toast({
          title: "获取用户列表失败",
          description: error.response?.data?.message || "未知错误",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 获取热门视频
  const fetchPopularVideos = async () => {
    try {
      setVideoLoading(true);
      
      // 从localStorage获取token
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      // 调用热门视频API - 修改为正确的API路径
      const response = await api.get("/api/videos", {
        params: {
          page: 1,
          size: 5,
          sort: 'views,desc' // 按观看次数排序
        }
      });
      
      // 设置热门视频数据
      console.log("热门视频API响应:", response);
      
      if (response.data && response.data.data) {
        const rawRecords = response.data.data.records || [];
        console.log("热门视频原始数据:", rawRecords);
        
        // 处理视频数据
        const videosData = rawRecords.map((video: Video) => ({
          ...video,
          // 转换为前端需要的格式
          completionRate: "70%" // 假设完成率数据，实际应从后端获取
        }));
        
        setPopularVideos(videosData);
      } 
    } catch (error: any) {
      if (error.response?.status === 401) {
        // 未授权，跳转到登录页
        router.push('/login');
      }
      console.error("获取热门视频失败", error);
    } finally {
      setVideoLoading(false);
    }
  };

  // 格式化时长（秒转分钟）
  const formatDuration = (seconds: number): string => {
    if (!seconds) return "0分钟";
    const minutes = Math.floor(seconds / 60);
    return `${minutes}分钟`;
  }

  // 格式化日期
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    } catch (e) {
      console.error("日期格式化错误:", e);
      return dateString;
    }
  }

  // 组件挂载时获取数据
  useEffect(() => {
    fetchUsers(1);
    fetchPopularVideos();
  }, []);

  // 模拟数据
  const stats = [
    {
      title: "总会员数",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: <Users className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "视频总数",
      value: "256",
      change: "+5%",
      trend: "up",
      icon: <FileVideo className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "总观看时长",
      value: "3,567小时",
      change: "+18%",
      trend: "up",
      icon: <Clock className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "本月收入",
      value: "¥45,678",
      change: "+8%",
      trend: "up",
      icon: <BarChart3 className="h-5 w-5 text-muted-foreground" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">管理员仪表盘</h2>
          <p className="text-muted-foreground">查看网站数据和管理内容</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>添加新视频</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
                ) : (
                  <TrendingUp className="mr-1 h-4 w-4 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-emerald-500" : "text-red-500"}>{stat.change}</span>
                <span className="ml-1">相比上月</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">最近活跃会员</TabsTrigger>
          <TabsTrigger value="videos">热门视频</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>最近活跃会员</CardTitle>
              <CardDescription>查看最近活跃的会员及其观看情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>会员号</TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>邮箱</TableHead>
                    <TableHead>联系电话</TableHead>
                    <TableHead>注册日期</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        加载中...
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        暂无会员数据
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.memberNumber}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone || '-'}</TableCell>
                        <TableCell>{new Date(user.registerDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "outline" : "secondary"}>
                            {user.status === "active" ? "正常" : "已禁用"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/users/${user.id}`}>查看</Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                            >
                              编辑
                            </Button>
                      
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto" asChild>
                <Link href="/admin/users">
                  查看所有会员
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>热门视频</CardTitle>
              <CardDescription>查看最受欢迎的视频课程</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">视频标题</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">观看次数</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">时长</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">上传日期</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videoLoading ? (
                      <tr className="border-b">
                        <td colSpan={5} className="px-4 py-3 text-center">加载中...</td>
                      </tr>
                    ) : popularVideos.length === 0 ? (
                      <tr className="border-b">
                        <td colSpan={5} className="px-4 py-3 text-center">暂无视频数据</td>
                      </tr>
                    ) : (
                      popularVideos.map((video) => (
                        <tr key={video.id} className="border-b">
                          <td className="px-4 py-3 text-sm">{video.title}</td>
                          <td className="px-4 py-3 text-sm">{video.views || 0}</td>
                          <td className="px-4 py-3 text-sm">{formatDuration(video.duration)}</td>
                          <td className="px-4 py-3 text-sm">{formatDate(video.uploadDate)}</td>
                          <td className="px-4 py-3 text-sm">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/videos/${video.id}`}>查看详情</Link>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto" asChild>
                <Link href="/admin/videos">
                  查看所有视频
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
