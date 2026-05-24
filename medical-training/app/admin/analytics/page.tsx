"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Skeleton } from "@/components/ui/skeleton"

// 格式化时间(秒转换为时分秒)
const formatTime = (seconds: number) => {
  if (!seconds || seconds <= 0) return "0秒"
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  if (hours > 0) {
    return `${hours}小时${minutes > 0 ? minutes + '分钟' : ''}`
  } else if (minutes > 0) {
    return `${minutes}分钟${remainingSeconds > 0 ? remainingSeconds + '秒' : ''}`
  } else {
    return `${remainingSeconds}秒`
  }
}

// 饼图颜色
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#FF6B6B", "#4ECDC4"]

interface OverviewStats {
  totalUsers: number
  totalMembers: number
  totalVideos: number
  totalViews: number
  todayUsers: number
  monthUsers: number
}

interface MonthlyRegistration {
  name: string
  month: string
  新会员: number
}

interface MonthlyView {
  name: string
  month: string
  总观看次数: number
  会员观看: number
  非会员观看: number
}

interface CategoryDistribution {
  name: string
  value: number
  percentage: number
  categoryId: number
}

interface TopVideo {
  id: number
  name: string
  views: number
  thumbnailUrl: string
  categoryName: string
}

interface UserWatchTime {
  userId: number
  userName?: string
  watchTime: number
}

interface VideoPlayTime {
  videoId: number
  videoName?: string
  playTime: number
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month")
  
  // 数据状态
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null)
  const [monthlyRegistration, setMonthlyRegistration] = useState<MonthlyRegistration[]>([])
  const [monthlyViews, setMonthlyViews] = useState<MonthlyView[]>([])
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistribution[]>([])
  const [topVideos, setTopVideos] = useState<TopVideo[]>([])
  const [userWatchTimeData, setUserWatchTimeData] = useState<UserWatchTime[]>([])
  const [videoPlayTimeData, setVideoPlayTimeData] = useState<VideoPlayTime[]>([])
  
  // 加载状态
  const [loading, setLoading] = useState({
    overview: true,
    registration: true,
    views: true,
    categories: true,
    topVideos: true,
    userWatchTime: true,
    videoPlayTime: true,
  })

  // 加载所有统计数据
  const loadAllStats = useCallback(async () => {
    setLoading(prev => ({
      overview: true,
      registration: true,
      views: true,
      categories: true,
      topVideos: true,
      userWatchTime: true,
      videoPlayTime: true,
    }))

    // 并行加载所有数据
    const [
      overviewRes,
      registrationRes,
      viewsRes,
      categoriesRes,
      topVideosRes,
      userWatchTimeRes,
      videoPlayTimeRes
    ] = await Promise.allSettled([
      statsApi.getOverview(),
      statsApi.getMonthlyRegistration(),
      statsApi.getMonthlyViews(),
      statsApi.getCategoryDistribution(),
      statsApi.getTopVideos(10),
      statsApi.getAllUserWatchTime(),
      statsApi.getAllVideoPlayTime(),
    ])

    // 处理总览数据
    if (overviewRes.status === 'fulfilled' && overviewRes.value.data) {
      setOverviewStats(overviewRes.value.data.data)
    }
    setLoading(prev => ({ ...prev, overview: false }))

    // 处理会员注册趋势数据
    if (registrationRes.status === 'fulfilled' && registrationRes.value.data) {
      setMonthlyRegistration(registrationRes.value.data.data)
    }
    setLoading(prev => ({ ...prev, registration: false }))

    // 处理视频观看统计
    if (viewsRes.status === 'fulfilled' && viewsRes.value.data) {
      setMonthlyViews(viewsRes.value.data.data)
    }
    setLoading(prev => ({ ...prev, views: false }))

    // 处理视频类型分布
    if (categoriesRes.status === 'fulfilled' && categoriesRes.value.data) {
      setCategoryDistribution(categoriesRes.value.data.data)
    }
    setLoading(prev => ({ ...prev, categories: false }))

    // 处理热门视频
    if (topVideosRes.status === 'fulfilled' && topVideosRes.value.data) {
      setTopVideos(topVideosRes.value.data.data)
    }
    setLoading(prev => ({ ...prev, topVideos: false }))

    // 处理用户观看时间
    if (userWatchTimeRes.status === 'fulfilled' && userWatchTimeRes.value.data) {
      const data = userWatchTimeRes.value.data.data
      const entries = Object.entries(data || {})
      const formattedData: UserWatchTime[] = entries.map(([userId, watchTime]) => ({
        userId: Number(userId),
        watchTime: Number(watchTime)
      })).sort((a, b) => b.watchTime - a.watchTime)
      setUserWatchTimeData(formattedData)
    }
    setLoading(prev => ({ ...prev, userWatchTime: false }))

    // 处理视频播放时间
    if (videoPlayTimeRes.status === 'fulfilled' && videoPlayTimeRes.value.data) {
      const data = videoPlayTimeRes.value.data.data
      const entries = Object.entries(data || {})
      const formattedData: VideoPlayTime[] = entries.map(([videoId, playTime]) => ({
        videoId: Number(videoId),
        playTime: Number(playTime)
      })).sort((a, b) => b.playTime - a.playTime)
      setVideoPlayTimeData(formattedData)
    }
    setLoading(prev => ({ ...prev, videoPlayTime: false }))
  }, [])

  useEffect(() => {
    loadAllStats()
  }, [loadAllStats])

  // 生成用户观看时间图表数据
  const userWatchTimeChartData = userWatchTimeData.slice(0, 10).map(item => ({
    name: `用户 ${item.userId}`,
    watchTime: item.watchTime,
    formattedTime: formatTime(item.watchTime)
  }))

  // 生成视频播放时间图表数据
  const videoPlayTimeChartData = videoPlayTimeData.slice(0, 10).map(item => ({
    name: `视频 ${item.videoId}`,
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

      {/* 概览卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            {loading.overview ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overviewStats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  本月新增 {overviewStats?.monthUsers || 0} 会员
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总会员数</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </CardHeader>
          <CardContent>
            {loading.overview ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overviewStats?.totalMembers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  活跃会员占比 {overviewStats?.totalUsers ? Math.round((overviewStats?.totalMembers || 0) / overviewStats?.totalUsers * 100) : 0}%
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总视频数</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </CardHeader>
          <CardContent>
            {loading.overview ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overviewStats?.totalVideos || 0}</div>
                <p className="text-xs text-muted-foreground">
                  视频总播放量 {overviewStats?.totalViews || 0} 次
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日新增</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </CardHeader>
          <CardContent>
            {loading.overview ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overviewStats?.todayUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  较昨日 +{overviewStats?.todayUsers || 0}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="members">会员分析</TabsTrigger>
          <TabsTrigger value="videos">视频分析</TabsTrigger>
        </TabsList>

        {/* 总览选项卡 */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {/* 会员注册趋势 */}
            <Card>
              <CardHeader>
                <CardTitle>会员注册趋势</CardTitle>
                <CardDescription>每月新会员注册数量变化</CardDescription>
              </CardHeader>
              <CardContent>
                {loading.registration ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : monthlyRegistration.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    暂无注册数据
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyRegistration}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [`${value} 人`, '新会员']}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="新会员" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }}
                          name="新会员"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 视频观看统计 */}
            <Card>
              <CardHeader>
                <CardTitle>视频观看统计</CardTitle>
                <CardDescription>按播放量统计的会员与非会员观看对比</CardDescription>
              </CardHeader>
              <CardContent>
                {loading.views ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : monthlyViews.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    暂无观看数据
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyViews}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number, name: string) => [`${value} 次`, name]}
                        />
                        <Legend />
                        <Bar dataKey="会员观看" stackId="a" fill="#8884d8" name="会员观看" />
                        <Bar dataKey="非会员观看" stackId="a" fill="#82ca9d" name="非会员观看" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {/* 视频类型分布 */}
            <Card>
              <CardHeader>
                <CardTitle>视频类型分布</CardTitle>
                <CardDescription>各类型视频数量占比</CardDescription>
              </CardHeader>
              <CardContent>
                {loading.categories ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : categoryDistribution.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    暂无分类数据
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value} 个视频`, '视频数量']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 热门视频排名 */}
            <Card>
              <CardHeader>
                <CardTitle>热门视频排名</CardTitle>
                <CardDescription>观看次数最多的视频 TOP10</CardDescription>
              </CardHeader>
              <CardContent>
                {loading.topVideos ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : topVideos.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    暂无视频数据
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={topVideos}
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip 
                          formatter={(value: number) => [`${value} 次`, '观看次数']}
                        />
                        <Bar dataKey="views" fill="#8884d8" name="观看次数" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 会员分析选项卡 */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>会员观看时间分析</CardTitle>
              <CardDescription>用户总观看时间排名(前10名)</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.userWatchTime ? (
                <Skeleton className="h-[400px] w-full" />
              ) : userWatchTimeData.length === 0 ? (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  暂无用户观看时间数据
                </div>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={userWatchTimeChartData}
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={70} />
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
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : userWatchTimeData.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  暂无用户观看时间数据
                </div>
              ) : (
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3">排名</th>
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
                          <tr key={item.userId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4 font-medium">#{index + 1}</td>
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

        {/* 视频分析选项卡 */}
        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>热门视频播放量排名</CardTitle>
              <CardDescription>按视频播放量（views）统计的 TOP10 排名</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.topVideos ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : topVideos.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  暂无播放量数据
                </div>
              ) : (
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3">排名</th>
                        <th scope="col" className="px-6 py-3">视频名称</th>
                        <th scope="col" className="px-6 py-3">分类</th>
                        <th scope="col" className="px-6 py-3">播放量</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topVideos.map((item, index) => (
                        <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <td className="px-6 py-4 font-medium">#{index + 1}</td>
                          <td className="px-6 py-4">{item.name}</td>
                          <td className="px-6 py-4">{item.categoryName}</td>
                          <td className="px-6 py-4">{item.views} 次</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>视频播放时间分析</CardTitle>
              <CardDescription>视频总播放时间排名(前10名)</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.videoPlayTime ? (
                <Skeleton className="h-[400px] w-full" />
              ) : videoPlayTimeData.length === 0 ? (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                  暂无视频播放时间数据
                </div>
              ) : (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={videoPlayTimeChartData}
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={70} />
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
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : videoPlayTimeData.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  暂无视频播放时间数据
                </div>
              ) : (
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3">排名</th>
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
                          <tr key={item.videoId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4 font-medium">#{index + 1}</td>
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
