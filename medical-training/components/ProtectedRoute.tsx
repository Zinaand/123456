"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [] 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 如果不在加载中且未验证，重定向到登录
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    // 如果指定了允许的角色，且用户角色不在允许列表内，重定向到首页
    if (
      !isLoading && 
      isAuthenticated && 
      allowedRoles.length > 0 && 
      user && 
      !allowedRoles.includes(user.role)
    ) {
      router.push("/");
      return;
    }
  }, [isLoading, isAuthenticated, router, pathname, allowedRoles, user]);

  // 如果在加载中，显示加载状态
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  // 如果未认证，返回null（等待重定向）
  if (!isAuthenticated) {
    return null;
  }

  // 如果指定了允许的角色，且用户角色不在允许列表内，返回null（等待重定向）
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  // 通过所有检查，渲染子组件
  return <>{children}</>;
} 