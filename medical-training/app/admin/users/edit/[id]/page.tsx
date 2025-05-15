"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

// 表单验证schema
const userEditFormSchema = z.object({
  name: z.string().min(2, "姓名至少2个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入有效的手机号码"),
  idNumber: z.string().regex(/^\d{17}[\dX]$/, "请输入有效的身份证号"),
});

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 初始化表单
  const form = useForm<z.infer<typeof userEditFormSchema>>({
    resolver: zodResolver(userEditFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      idNumber: "",
    },
  });

  // 获取用户信息
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
          const userData = response.data.data;
          // 设置表单默认值
          form.reset({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            idNumber: userData.idNumber,
          });
        } else {
          toast({
            title: "获取用户信息失败",
            description: response.data.message || "未知错误",
            variant: "destructive",
          });
          router.push('/admin/users');
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
  }, [params.id, router, form]);

  // 表单提交处理
  const onSubmit = async (values: z.infer<typeof userEditFormSchema>) => {
    try {
      setSubmitting(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // 调用更新用户API
      const response = await api.put(`/users/${params.id}`, values);

      if (response.data.success) {
        toast({
          title: "更新成功",
          description: "用户信息已更新",
        });
        router.push(`/admin/users/${params.id}`);
      } else {
        toast({
          title: "更新失败",
          description: response.data.message || "未知错误",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "更新失败",
        description: error.response?.data?.message || "未知错误",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">编辑会员</h2>
          <p className="text-muted-foreground">修改会员的信息</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push(`/admin/users/${params.id}`)}
        >
          返回详情
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>编辑信息</CardTitle>
          <CardDescription>修改会员的基本信息</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓名</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入姓名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="请输入邮箱" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>手机号码</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入手机号码" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>身份证号</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入身份证号" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/admin/users/${params.id}`)}
                >
                  取消
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "保存中..." : "保存修改"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 