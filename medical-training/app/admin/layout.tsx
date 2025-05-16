"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, FileVideo, Home, LayoutDashboard, LogOut, Menu, Settings, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"


interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    title: "仪表盘",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "用户管理",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "视频管理",
    href: "/admin/videos",
    icon: <FileVideo className="h-5 w-5" />,
  },
  {
    title: "数据统计",
    href: "/admin/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "系统设置",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    
    router.push('/');
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setOpen(false)}>
                  <Home className="h-6 w-6" />
                  <span>医护培训管理系统</span>
                </Link>
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent",
                      pathname === item.href ? "bg-accent" : "transparent",
                    )}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Home className="h-6 w-6" />
            <span className="hidden md:inline">医护培训管理系统</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              退出系统
            </Button>
          </div>
        </header>
        <div className="grid flex-1 md:grid-cols-[220px_1fr]">
          <aside className="hidden border-r md:block">
            <nav className="grid gap-2 p-4 text-sm">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent",
                    pathname === item.href ? "bg-accent" : "transparent",
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
