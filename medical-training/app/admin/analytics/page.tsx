"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { statsApi } from "@/lib/api"

// 格式化时间(秒转换为时分秒)
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  } else if (minutes > 0) {
    return `${minutes}分钟${remainingSeconds}秒`
  } else {
    return `${remainingSeconds}秒`
  }
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month")
  const [userWatchTimeData, setUserWatchTimeData] = useState<{userId: number, watchTime: number}[]>([])
  const [videoPlayTimeData, setVideoPlayTimeData] = useState<{videoId: number, playTime: number}[]>([])
  const [loading, setLoading] = useState({
    userWatchTime: true,
    videoPlayTime: true
  })

  // 从后端获取数据
  useEffect(() => {
    // 获取用户观看时间数据
    const fetchUserWatchTime = async () => {
      try {
        setLoading(prev => ({ ...prev, userWatchTime: true }))
        console.log("开始获取用户观看时间数据...")
        const response = await statsApi.getAllUserWatchTime()
        console.log("用户观看时间数据原始返回:", response)
        
        if (!response || !response.data) {
          console.error("API返回数据为空或无效")
          return
        }
        
        // 转换数据格式
        const entries = Object.entries(response.data || {})
        console.log("用户观看时间数据条目:", entries)
        
        if (entries.length === 0) {
          console.warn("用户观看时间数据为空")
          return
        }
        
        const formattedData = entries.map(([userId, watchTime]) => {
          console.log(`处理用户 ${userId}, 观看时间 ${watchTime}`)
          return {
            userId: Number(userId),
            watchTime: Number(watchTime)
          }
        }).sort((a, b) => b.watchTime - a.watchTime) // 按观看时间降序排序
        
        console.log("格式化后的用户观看时间数据:", formattedData)
        setUserWatchTimeData(formattedData)
      } catch (error) {
        console.error("获取用户观看时间数据失败:", error)
        // 出错时不更新状态，保持空数组
      } finally {
        setLoading(prev => ({ ...prev, userWatchTime: false }))
      }
    }

    // 获取视频播放时间数据
    const fetchVideoPlayTime = async () => {
      try {
        setLoading(prev => ({ ...prev, videoPlayTime: true }))
        console.log("开始获取视频播放时间数据...")
        const response = await statsApi.getAllVideoPlayTime()
        console.log("视频播放时间数据原始返回:", response)
        
        if (!response || !response.data) {
          console.error("API返回数据为空或无效")
          return
        }
        
        // 转换数据格式
        const entries = Object.entries(response.data || {})
        console.log("视频播放时间数据条目:", entries)
        
        if (entries.length === 0) {
          console.warn("视频播放时间数据为空")
          return
        }
        
        const formattedData = entries.map(([videoId, playTime]) => {
          console.log(`处理视频 ${videoId}, 播放时间 ${playTime}`)
          return {
            videoId: Number(videoId),
            playTime: Number(playTime)
          }
        }).sort((a, b) => b.playTime - a.playTime) // 按播放时间降序排序
        
        console.log("格式化后的视频播放时间数据:", formattedData)
        setVideoPlayTimeData(formattedData)
      } catch (error) {
        console.error("获取视频播放时间数据失败:", error)
        // 出错时不更新状态，保持空数组
      } finally {
        setLoading(prev => ({ ...prev, videoPlayTime: false }))
      }
    }

    fetchUserWatchTime()
    fetchVideoPlayTime()
  }, [])
  
  // "总览"选项卡的模拟数据 - 仅用于展示
  // 模拟数据 - 会员注册统计
  const memberData = [
    { name: "1月", 新会员: 65 },
    { name: "2月", 新会员: 78 },
    { name: "3月", 新会员: 90 },
    { name: "4月", 新会员: 81 },
    { name: "5月", 新会员: 95 },
    { name: "6月", 新会员: 110 },
    { name: "7月", 新会员: 120 },
  ]

  // 模拟数据 - 视频观看统计
  const videoViewData = [
    { name: "1月", 总观看次数: 1200, 会员观看: 800, 非会员观看: 400 },
    { name: "2月", 总观看次数: 1350, 会员观看: 950, 非会员观看: 400 },
    { name: "3月", 总观看次数: 1500, 会员观看: 1100, 非会员观看: 400 },
    { name: "4月", 总观看次数: 1400, 会员观看: 1000, 非会员观看: 400 },
    { name: "5月", 总观看次数: 1600, 会员观看: 1200, 非会员观看: 400 },
    { name: "6月", 总观看次数: 1800, 会员观看: 1300, 非会员观看: 500 },
    { name: "7月", 总观看次数: 2000, 会员观看: 1500, 非会员观看: 500 },
  ]

  // 模拟数据 - 视频类型分布
  const videoTypeData = [
    { name: "基础护理", value: 35 },
    { name: "急救技术", value: 25 },
    { name: "医疗设备", value: 20 },
    { name: "沟通技巧", value: 15 },
    { name: "其他", value: 5 },
  ]

  // 饼图颜色
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  // 模拟数据 - 热门视频排名
  const topVideosData = [
    { name: "基础护理技能培训", views: 1245 },
    { name: "高级心肺复苏技术", views: 987 },
    { name: "医疗设备操作指南", views: 876 },
    { name: "患者沟通技巧", views: 765 },
    { name: "急救药物使用指南", views: 654 },
  ]

  // 为用户观看时间生成图表数据
  const userWatchTimeChartData = userWatchTimeData.slice(0, 10).map(item => ({
    userId: `用户ID: ${item.userId}`,
    watchTime: item.watchTime,
    formattedTime: formatTime(item.watchTime)
  }))

  // 为视频播放时间生成图表数据
  const videoPlayTimeChartData = videoPlayTimeData.slice(0, 10).map(item => ({
    videoId: `视频ID: ${item.videoId}`,
    playTime: item.playTime,
    formattedTime: formatTime(item.playTime)
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">数据统计</h2>
          <p className="text-muted-foreground">查看网站使用数据和分析报告</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择时间范围" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">最近一周</SelectItem>
            <SelectItem value="month">最近一个月</SelectItem>
            <SelectItem value="quarter">最近一季度</SelectItem>
            <SelectItem value="year">最近一年</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="members">会员分析</TabsTrigger>
          <TabsTrigger value="videos">视频分析</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>会员注册趋势</CardTitle>
                <CardDescription>查看会员注册数量变化趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={memberData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="新会员" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>视频观看统计</CardTitle>
                <CardDescription>查看视频观看数量变化趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={videoViewData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="会员观看" stackId="a" fill="#8884d8" />
                      <Bar dataKey="非会员观看" stackId="a" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>视频类型分布</CardTitle>
                <CardDescription>各类型视频数量占比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={videoTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {videoTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>热门视频排名</CardTitle>
                <CardDescription>观看次数最多的视频</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={topVideosData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>会员观看时间分析</CardTitle>
              <CardDescription>用户总观看时间排名(前10名)</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.userWatchTime ? (
                <p className="text-center py-12 text-muted-foreground">正在加载数据...</p>
              ) : userWatchTimeData.length === 0 ? (
                <p className="text-center py-12 text-muted-foreground">暂无用户观看时间数据或数据加载失败</p>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={userWatchTimeChartData}
                      margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="userId" width={80} />
                      <Tooltip 
                        formatter={(value: number) => [formatTime(value), '观看时间']}
                      />
                      <Legend />
                      <Bar dataKey="watchTime" name="观看时间(秒)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>用户观看时间详情列表</CardTitle>
              <CardDescription>所有用户观看时间统计数据</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.userWatchTime ? (
                <p className="text-center py-12 text-muted-foreground">正在加载数据...</p>
              ) : userWatchTimeData.length === 0 ? (
                <p className="text-center py-12 text-muted-foreground">暂无用户观看时间数据或数据加载失败</p>
              ) : (
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3">用户ID</th>
                        <th scope="col" className="px-6 py-3">总观看时间</th>
                        <th scope="col" className="px-6 py-3">占比</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userWatchTimeData.map((item, index) => {
                        const totalTime = userWatchTimeData.reduce((sum, curr) => sum + curr.watchTime, 0)
                        const percentage = totalTime > 0 ? (item.watchTime / totalTime * 100).toFixed(2) : '0.00'
                        
                        return (
                          <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4">{item.userId}</td>
                            <td className="px-6 py-4">{formatTime(item.watchTime)}</td>
                            <td className="px-6 py-4">{percentage}%</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>视频播放时间分析</CardTitle>
              <CardDescription>视频总播放时间排名(前10名)</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.videoPlayTime ? (
                <p className="text-center py-12 text-muted-foreground">正在加载数据...</p>
              ) : videoPlayTimeData.length === 0 ? (
                <p className="text-center py-12 text-muted-foreground">暂无视频播放时间数据或数据加载失败</p>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={videoPlayTimeChartData}
                      margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="videoId" width={80} />
                      <Tooltip 
                        formatter={(value: number) => [formatTime(value), '播放时间']}
                      />
                      <Legend />
                      <Bar dataKey="playTime" name="播放时间(秒)" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>视频播放时间详情列表</CardTitle>
              <CardDescription>所有视频播放时间统计数据</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.videoPlayTime ? (
                <p className="text-center py-12 text-muted-foreground">正在加载数据...</p>
              ) : videoPlayTimeData.length === 0 ? (
                <p className="text-center py-12 text-muted-foreground">暂无视频播放时间数据或数据加载失败</p>
              ) : (
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3">视频ID</th>
                        <th scope="col" className="px-6 py-3">总播放时间</th>
                        <th scope="col" className="px-6 py-3">占比</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videoPlayTimeData.map((item, index) => {
                        const totalTime = videoPlayTimeData.reduce((sum, curr) => sum + curr.playTime, 0)
                        const percentage = totalTime > 0 ? (item.playTime / totalTime * 100).toFixed(2) : '0.00'
                        
                        return (
                          <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4">{item.videoId}</td>
                            <td className="px-6 py-4">{formatTime(item.playTime)}</td>
                            <td className="px-6 py-4">{percentage}%</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
