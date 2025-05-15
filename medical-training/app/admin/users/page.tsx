"use client";
import Link from "next/link"
import { PlusCircle, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

// 用户类型定义
interface User {
  id: number;
  name: string;
  memberNumber: string;
  idNumber: string;
  phone: string;
  email: string;
  registerDate: string;
  status: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const pageSize = 10;

  // 获取用户列表
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

  // 更新用户状态
  const updateUserStatus = async (userId: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      await api.patch(`/users/${userId}/status`, { status });
      
      toast({
        title: "状态更新成功",
        description: "用户状态已更新",
      });
      
      // 重新获取用户列表
      fetchUsers(currentPage, keyword);
    } catch (error: any) {
      toast({
        title: "状态更新失败",
        description: error.response?.data?.message || "未知错误",
        variant: "destructive",
      });
    }
  };

  // 删除用户
  const deleteUser = async (userId: number) => {
    if (!confirm("确定要删除该用户吗？此操作不可恢复！")) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      await api.delete(`/users/${userId}`);
      
      toast({
        title: "删除成功",
        description: "用户已成功删除",
      });
      
      // 重新获取用户列表
      fetchUsers(currentPage, keyword);
    } catch (error: any) {
      toast({
        title: "删除失败",
        description: error.response?.data?.message || "未知错误",
        variant: "destructive",
      });
    }
  };

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1, keyword);
  };

  // 页面加载时获取用户列表
  useEffect(() => {
    fetchUsers();
  }, []);

  // 渲染页码
  const renderPaginationItems = () => {
    const items = [];
    
    // 简单的分页逻辑
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            href="#" 
            isActive={currentPage === i}
            onClick={(e) => {
              e.preventDefault();
              fetchUsers(i, keyword);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">会员管理</h2>
          <p className="text-muted-foreground">管理系统中的所有会员账户</p>
        </div>
        <Button onClick={() => router.push('/admin/users/add')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          添加会员
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>会员列表</CardTitle>
          <CardDescription>查看和管理所有注册会员</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="搜索会员..." 
                className="pl-8" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <Button type="submit" variant="outline">搜索</Button>
          </form>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <p>加载中...</p>
            </div>
          ) : (
            <div className="rounded-md border">
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
                  {users.length === 0 ? (
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
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => updateUserStatus(
                                user.id, 
                                user.status === "active" ? "inactive" : "active"
                              )}
                            >
                              {user.status === "active" ? "禁用" : "启用"}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteUser(user.id)}
                            >
                              删除
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          fetchUsers(currentPage - 1, keyword);
                        }
                      }}
                    />
                  </PaginationItem>
                  
                  {renderPaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          fetchUsers(currentPage + 1, keyword);
                        }
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
