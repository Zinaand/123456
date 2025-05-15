"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

export default function Navbar() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 在组件加载时，检查用户登录状态
  useEffect(() => {
    const checkLoginStatus = () => {
      const storedToken = localStorage.getItem("token");
      const storedUserName = localStorage.getItem("userName");
      const storedUserRole = localStorage.getItem("userRole");
      
      // 只有在同时存在token和用户名的情况下才视为已登录
      if (storedToken && storedUserName) {
        setUserName(storedUserName);
        setUserRole(storedUserRole);
        setIsLoggedIn(true);
      } else {
        // 如果缺少必要信息，清除所有存储的用户数据
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userInfo");
        
        setIsLoggedIn(false);
        setUserName(null);
        setUserRole(null);
      }
    };
    
    // 初始检查
    checkLoginStatus();
    
    // 监听storage事件，当其他标签页修改localStorage时更新状态
    window.addEventListener("storage", checkLoginStatus);
    
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // 处理登出
  const handleLogout = () => {
    // 清除所有用户相关的localStorage数据
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userInfo");
    
    setIsLoggedIn(false);
    setUserName(null);
    setUserRole(null);
    
    toast({
      title: "已登出",
      description: "您已成功退出登录",
    });
    
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            医护培训
          </Link>
        </div>
        
        {/* 桌面菜单 */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium">
            首页
          </Link>
          <Link href="/courses" className="text-sm font-medium">
            课程
          </Link>
          <Link href="/resources" className="text-sm font-medium">
            资源
          </Link>
          <Link href="/about" className="text-sm font-medium">
            关于我们
          </Link>
        </nav>
        
        {/* 移动菜单按钮 */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* 登录状态 */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    {userName}
                    {userRole === "admin" && <span className="text-xs bg-primary text-primary-foreground px-1 rounded">管理员</span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {userRole === "admin" && (
                    <DropdownMenuItem onClick={() => router.push("/admin")}>
                      管理后台
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    个人中心
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  登录
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">注册</Button>
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* 移动菜单 */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t py-4">
          <div className="container space-y-4">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                首页
              </Link>
              <Link href="/courses" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                课程
              </Link>
              <Link href="/resources" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                资源
              </Link>
              <Link href="/about" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                关于我们
              </Link>
            </nav>
            
            <div className="flex flex-col space-y-2 pt-2 border-t">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{userName}</span>
                      {userRole === "admin" && <span className="text-xs bg-primary text-primary-foreground px-1 rounded">管理员</span>}
                    </div>
                  </div>
                  
                  {userRole === "admin" && (
                    <Button variant="outline" size="sm" onClick={() => {
                      router.push("/admin");
                      setIsMobileMenuOpen(false);
                    }}>
                      管理后台
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm" onClick={() => {
                    router.push("/profile");
                    setIsMobileMenuOpen(false);
                  }}>
                    个人中心
                  </Button>
                  
                  <Button variant="destructive" size="sm" onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      登录
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">注册</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 