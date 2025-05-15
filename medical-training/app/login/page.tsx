"use client"

import type React from "react"
import type { ApiResponse } from "@/lib/types"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

// 定义登录响应数据类型
interface LoginResponse {
  token: string
  userId: number
  name: string
  role: string
  memberNumber?: string
}

export default function LoginPage() {
  const router = useRouter()
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

      // 保存token和用户信息到localStorage
      localStorage.setItem("token", userData.token)
      localStorage.setItem("userId", userData.userId.toString())
      localStorage.setItem("userName", userData.name)
      localStorage.setItem("userRole", userData.role)

      // 同时保存userInfo对象以兼容导航栏组件
      const userInfo = {
        id: userData.userId,
        name: userData.name,
        role: userData.role,
        memberNumber: userData.memberNumber || "",
      }
      localStorage.setItem("userInfo", JSON.stringify(userInfo))

      toast({
        title: "登录成功",
        description: "欢迎回到医学培训系统",
      })

      // 根据角色导航到不同页面
      if (userData.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/")
      }
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
    <div className="flex min-h-screen items-center justify-center bg-muted/50 py-12">
      <Card className="mx-auto max-w-md">
          <form onSubmit={handleLogin}>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">登录账户</CardTitle>
          <CardDescription>输入您的账号信息登录系统</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
                <Label htmlFor="username">用户名/邮箱/电话</Label>
                <Input
                    id="username"
                    placeholder="请输入用户名、邮箱或电话"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">密码</Label>
            </div>
                <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "登录中..." : "登录"}
              </Button>
          <div className="text-center text-sm">
            还没有账户?{" "}
            <Link href="/register" className="text-primary underline-offset-4 hover:underline">
              立即注册
            </Link>
          </div>
        </CardFooter>
          </form>
      </Card>
    </div>
  )
}
