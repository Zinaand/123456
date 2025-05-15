"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import type { ApiResponse } from "@/lib/types"

// 定义登录响应数据类型
interface LoginResponse {
  token: string
  userId: number
  name: string
  role: string
  memberNumber?: string
}

export function AdminLoginDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      toast({
        title: "错误",
        description: "请填写用户名和密码",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const response = await userApi.login({ username, password })

      // 使用类型断言确保响应数据符合预期类型
      const responseData = response.data as ApiResponse<LoginResponse>
      const userData = responseData.data

      // 检查用户角色
      if (userData.role !== "admin") {
        toast({
          title: "无权限",
          description: "只有管理员账号才能登录管理后台",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // 保存token和用户信息到localStorage
      localStorage.setItem("token", userData.token)
      localStorage.setItem("userId", userData.userId.toString())
      localStorage.setItem("userName", userData.name)
      localStorage.setItem("userRole", userData.role)
      
      // 保存userInfo对象
      const userInfo = {
        id: userData.userId,
        name: userData.name,
        role: userData.role,
        memberNumber: userData.memberNumber || "",
      }
      localStorage.setItem("userInfo", JSON.stringify(userInfo))

      toast({
        title: "登录成功",
        description: "欢迎回到管理后台",
      })

      // 关闭对话框并跳转
      setOpen(false)
      router.push("/admin")
    } catch (error: any) {
      toast({
        title: "登录失败",
        description: error.response?.data?.message || "用户名或密码错误",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">管理员登录</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleLogin}>
          <DialogHeader>
            <DialogTitle>管理员登录</DialogTitle>
            <DialogDescription>
              请输入管理员账号和密码进入后台管理系统
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-username">用户名</Label>
              <Input
                id="admin-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入管理员用户名"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-password">密码</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "登录中..." : "登录"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 