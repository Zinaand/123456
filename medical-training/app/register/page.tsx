"use client";

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    idNumber: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "错误",
        description: "姓名、邮箱和密码为必填项",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "错误",
        description: "两次输入的密码不一致",
        variant: "destructive",
      });
      return;
    }
    
    // 调用注册API
    try {
      setLoading(true);
      
      // 注册参数，与后端接口对应
      const registerData = {
        username: formData.name, // 注册时使用姓名作为用户名
        password: formData.password,
        email: formData.email
      };
      
      const response = await userApi.register(registerData);
      
      // 保存token到localStorage
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("userId", response.data.data.userId);
      localStorage.setItem("userName", response.data.data.name);
      localStorage.setItem("userRole", response.data.data.role);
      
      toast({
        title: "注册成功",
        description: "欢迎加入医学培训系统",
      });
      
      // 跳转到首页
      router.push("/");
    } catch (error: any) {
      toast({
        title: "注册失败",
        description: error.response?.data?.message || "注册过程中出现错误",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 py-12">
      <Card className="mx-auto max-w-md w-full">
        <form onSubmit={handleRegister}>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">创建账户</CardTitle>
          <CardDescription>填写以下信息注册成为会员</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
              <Input 
                id="name" 
                placeholder="请输入真实姓名" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idNumber">身份证号</Label>
              <Input 
                id="idNumber" 
                placeholder="请输入身份证号码" 
                value={formData.idNumber}
                onChange={handleChange}
              />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">联系电话</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="请输入手机号码" 
                value={formData.phone}
                onChange={handleChange}
              />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">电子邮箱</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="请输入电子邮箱" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">设置密码</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="请设置登录密码" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认密码</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="请再次输入密码" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "注册中..." : "注册会员"}
            </Button>
          <div className="text-center text-sm">
            已有账户?{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              立即登录
            </Link>
          </div>
        </CardFooter>
        </form>
      </Card>
    </div>
  )
}
