"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface UserDetails {
  id: number;
  name: string;
  memberNumber: string;
  idNumber: string;
  phone: string;
  email: string;
  registerDate: string;
  status: string;
  // 可以根据需要添加更多字段
}

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await api.get(`/users/${params.id}`);
        
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          toast({
            title: "获取用户信息失败",
            description: response.data.message || "未知错误",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          toast({
            title: "用户不存在",
            description: "找不到该用户信息",
            variant: "destructive",
          });
          router.push('/admin/users');
        } else {
          toast({
            title: "获取用户信息失败",
            description: error.response?.data?.message || "未知错误",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>加载中...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">会员详情</h2>
          <p className="text-muted-foreground">查看会员的详细信息</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/users')}>
          返回列表
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
          <CardDescription>会员的基本资料信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">会员号</p>
              <p className="font-medium">{user.memberNumber}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">状态</p>
              <Badge variant={user.status === "active" ? "outline" : "secondary"}>
                {user.status === "active" ? "正常" : "已禁用"}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">姓名</p>
              <p className="font-medium">{user.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">身份证号</p>
              <p className="font-medium">{user.idNumber}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">邮箱</p>
              <p className="font-medium">{user.email}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">手机号码</p>
              <p className="font-medium">{user.phone || '-'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">注册日期</p>
              <p className="font-medium">
                {new Date(user.registerDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/users/edit/${user.id}`)}
            >
              编辑信息
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm("确定要删除该用户吗？此操作不可恢复！")) {
                  // 实现删除功能
                  router.push('/admin/users');
                }
              }}
            >
              删除用户
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 