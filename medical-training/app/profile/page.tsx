"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { User, Lock, History, CreditCard, Loader2, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { userApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar"

interface UserProfile {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  role: string
  status: string
  memberNumber?: string
  registerDate: string
  lastLogin?: string
  membershipType?: string
  membershipStartDate?: string
  membershipExpireDate?: string
  isValidMember: boolean
}

interface WatchHistoryRecord {
  id: number
  videoId: number
  progress: number
  completed: boolean
  lastWatched: string
  createdAt: string
  videoTitle?: string
  videoThumbnail?: string
  videoDuration?: number
  videoUrl?: string
}

interface PaymentRecord {
  id: number
  amount: number
  type: string
  status: string
  transactionId?: string
  createdAt: string
  description?: string
}

interface WatchStats {
  records: WatchHistoryRecord[]
  totalCount: number
  totalWatchTime: number
  completedCount: number
}

const MEMBERSHIP_LABELS: Record<string, string> = {
  YEARLY: "年度会员",
  QUARTERLY: "季度会员",
  MONTHLY: "月度会员",
}

const formatTime = (seconds: number) => {
  if (!seconds || seconds <= 0) return "0秒"
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  if (hours > 0) return `${hours}小时${minutes > 0 ? minutes + '分钟' : ''}`
  if (minutes > 0) return `${minutes}分钟${remainingSeconds > 0 ? remainingSeconds + '秒' : ''}`
  return `${remainingSeconds}秒`
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-"
  const date = new Date(dateStr)
  return date.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" })
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [saving, setSaving] = useState(false)

  // Profile form
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" })

  // Password form
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" })
  const [passwordSaving, setPasswordSaving] = useState(false)

  // Watch history
  const [watchHistory, setWatchHistory] = useState<WatchStats | null>(null)
  const [historyLoading, setHistoryLoading] = useState(true)

  // Payments
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [paymentsLoading, setPaymentsLoading] = useState(true)

  // Load profile
  const loadProfile = useCallback(async () => {
    try {
      const res = await userApi.getProfile()
      const data = res.data?.data
      if (data) {
        setProfile(data)
        setProfileForm({ name: data.name || "", phone: data.phone || "" })
      }
    } catch (err: any) {
      toast({ title: "加载失败", description: err.response?.data?.message || "请先登录", variant: "destructive" })
      if (err.response?.status === 401) router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  // Load watch history
  const loadWatchHistory = useCallback(async () => {
    try {
      const res = await userApi.getWatchHistory()
      if (res.data?.data) {
        setWatchHistory(res.data.data)
      }
    } catch (err) {
      console.error("Failed to load watch history", err)
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  // Load payments
  const loadPayments = useCallback(async () => {
    try {
      const res = await userApi.getPayments()
      if (res.data?.data) {
        setPayments(res.data.data)
      }
    } catch (err) {
      console.error("Failed to load payments", err)
    } finally {
      setPaymentsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
    loadWatchHistory()
    loadPayments()
  }, [loadProfile, loadWatchHistory, loadPayments])

  // Save profile
  const handleSaveProfile = async () => {
    if (!profileForm.name.trim()) {
      toast({ title: "请输入用户名", variant: "destructive" })
      return
    }
    setSaving(true)
    try {
      const res = await userApi.updateProfile(profileForm)
      if (res.data?.success !== false) {
        setProfile(prev => prev ? { ...prev, ...profileForm } : null)
        toast({ title: "保存成功", description: "个人信息已更新" })
      } else {
        toast({ title: "保存失败", description: res.data?.message || "请稍后重试", variant: "destructive" })
      }
    } catch (err: any) {
      toast({ title: "保存失败", description: err.response?.data?.message || "请稍后重试", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  // Change password
  const handleChangePassword = async () => {
    if (!passwordForm.oldPassword) {
      toast({ title: "请输入旧密码", variant: "destructive" })
      return
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      toast({ title: "新密码长度不能少于6位", variant: "destructive" })
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "两次输入的密码不一致", variant: "destructive" })
      return
    }
    setPasswordSaving(true)
    try {
      const res = await userApi.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      })
      if (res.data?.success !== false) {
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
        toast({ title: "密码修改成功", description: "请使用新密码登录" })
      } else {
        toast({ title: "修改失败", description: res.data?.message || "请稍后重试", variant: "destructive" })
      }
    } catch (err: any) {
      toast({ title: "修改失败", description: err.response?.data?.message || "旧密码不正确", variant: "destructive" })
    } finally {
      setPasswordSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Navbar />

      <main className="flex-1 container max-w-5xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">个人中心</h1>
          <p className="text-muted-foreground mt-1">管理您的个人信息和学习记录</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Left sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold text-primary">
                      {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{profile?.name}</h3>
                  <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  <Badge className="mt-2" variant={profile?.isValidMember ? "default" : "secondary"}>
                    {profile?.isValidMember
                      ? MEMBERSHIP_LABELS[profile?.membershipType || ""] || "会员"
                      : "非会员"}
                  </Badge>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">会员编号</span>
                    <span className="font-medium truncate ml-2">{profile?.memberNumber || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">注册时间</span>
                    <span className="font-medium">{formatDate(profile?.registerDate)}</span>
                  </div>
                  {profile?.membershipExpireDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">到期时间</span>
                      <span className="font-medium">{formatDate(profile?.membershipExpireDate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">最近登录</span>
                    <span className="font-medium">{formatDate(profile?.lastLogin)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right content */}
          <div>
            <Tabs defaultValue="profile" className="space-y-4">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="profile" className="gap-1.5">
                  <User className="h-4 w-4 hidden sm:inline" />
                  <span>个人信息</span>
                </TabsTrigger>
                <TabsTrigger value="password" className="gap-1.5">
                  <Lock className="h-4 w-4 hidden sm:inline" />
                  <span>修改密码</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-1.5">
                  <History className="h-4 w-4 hidden sm:inline" />
                  <span>观看记录</span>
                </TabsTrigger>
                <TabsTrigger value="payments" className="gap-1.5">
                  <CreditCard className="h-4 w-4 hidden sm:inline" />
                  <span>支付记录</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>个人信息</CardTitle>
                    <CardDescription>修改您的个人信息</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">用户名</Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="请输入用户名"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">邮箱</Label>
                      <Input id="email" value={profile?.email || ""} disabled className="bg-muted" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">手机号</Label>
                      <Input
                        id="phone"
                        value={profileForm.phone || ""}
                        onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="请输入手机号"
                      />
                    </div>
                    <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">
                      {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                      <Save className="h-4 w-4" />
                      保存修改
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Password Tab */}
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>修改密码</CardTitle>
                    <CardDescription>定期更换密码可以保护您的账户安全</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="oldPwd">旧密码</Label>
                      <Input
                        id="oldPwd"
                        type="password"
                        value={passwordForm.oldPassword}
                        onChange={e => setPasswordForm(f => ({ ...f, oldPassword: e.target.value }))}
                        placeholder="请输入旧密码"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newPwd">新密码</Label>
                      <Input
                        id="newPwd"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                        placeholder="请输入新密码（至少6位）"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPwd">确认新密码</Label>
                      <Input
                        id="confirmPwd"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                        placeholder="请再次输入新密码"
                      />
                    </div>
                    <Button onClick={handleChangePassword} disabled={passwordSaving} className="gap-2">
                      {passwordSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                      <Lock className="h-4 w-4" />
                      修改密码
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Watch History Tab */}
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>观看记录</CardTitle>
                    <CardDescription>您学习过的视频课程</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {historyLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : watchHistory && watchHistory.records.length > 0 ? (
                      <>
                        {/* Stats summary */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold">{watchHistory.totalCount}</div>
                            <div className="text-xs text-muted-foreground mt-1">观看视频数</div>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold">{formatTime(watchHistory.totalWatchTime)}</div>
                            <div className="text-xs text-muted-foreground mt-1">累计观看时长</div>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold">{watchHistory.completedCount}</div>
                            <div className="text-xs text-muted-foreground mt-1">已完成视频</div>
                          </div>
                        </div>

                        {/* History list */}
                        <div className="space-y-3">
                          {watchHistory.records.map((record) => (
                            <div
                              key={record.id}
                              className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                              onClick={() => router.push(`/video/${record.videoId}`)}
                            >
                              <div className="w-24 h-14 rounded bg-muted overflow-hidden flex-shrink-0">
                                {record.videoThumbnail ? (
                                  <img
                                    src={record.videoThumbnail}
                                    alt={record.videoTitle}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                    <History className="h-6 w-6 text-primary/50" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{record.videoTitle || `视频 #${record.videoId}`}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  观看进度：{formatTime(record.progress)}
                                  {record.videoDuration ? ` / ${formatTime(record.videoDuration)}` : ""}
                                  {record.completed && (
                                    <Badge className="ml-2 h-4 text-[10px]" variant="default">已完成</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDate(record.lastWatched)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <History className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>暂无观看记录</p>
                        <Button variant="outline" className="mt-4" onClick={() => router.push("/courses")}>
                          去选课
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments">
                <Card>
                  <CardHeader>
                    <CardTitle>支付记录</CardTitle>
                    <CardDescription>查看您的所有支付订单</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {paymentsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : payments.length > 0 ? (
                      <div className="space-y-3">
                        {payments.map((payment) => (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between p-4 rounded-lg border"
                          >
                            <div>
                              <div className="font-medium">
                                {payment.description || `${MEMBERSHIP_LABELS[payment.type] || payment.type} 订阅`}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                订单号：{payment.transactionId || "-"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(payment.createdAt)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">
                                ¥{Number(payment.amount).toFixed(2)}
                              </div>
                              <Badge
                                className="mt-1"
                                variant={
                                  payment.status === "COMPLETED" ? "default" :
                                  payment.status === "PENDING" ? "secondary" : "outline"
                                }
                              >
                                {payment.status === "COMPLETED" ? "已支付" :
                                  payment.status === "PENDING" ? "处理中" : payment.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>暂无支付记录</p>
                        {!profile?.isValidMember && (
                          <Button className="mt-4" onClick={() => router.push("/payment")}>
                            开通会员
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
