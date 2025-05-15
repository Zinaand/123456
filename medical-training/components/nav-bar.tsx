"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LogOut, UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AdminLoginDialog } from "@/components/admin-login-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// 定义本地存储的用户信息类型
interface LocalUserInfo {
    id: number
    name: string
    role: string
    memberNumber?: string
}

export default function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userName, setUserName] = useState("")
    const [userRole, setUserRole] = useState<string | null>(null)

    // 在客户端加载时检查用户登录状态
    useEffect(() => {
        // 首先尝试从userInfo对象获取用户信息
        const userInfoStr = localStorage.getItem("userInfo")
        if (userInfoStr) {
            try {
                const userInfo = JSON.parse(userInfoStr) as LocalUserInfo
                setIsLoggedIn(true)
                setUserName(userInfo.name || "用户")
                setUserRole(userInfo.role)
                return
            } catch (e) {
                console.error("解析用户信息失败", e)
            }
        }

        // 如果没有userInfo对象，尝试从单独的字段获取
        const userName = localStorage.getItem("userName")
        const userId = localStorage.getItem("userId")
        const userRole = localStorage.getItem("userRole")

        if (userName && userId) {
            setIsLoggedIn(true)
            setUserName(userName)
            setUserRole(userRole)
        }
    }, [])

    // 处理登出
    const handleLogout = () => {
        // 清除所有可能的用户信息存储
        localStorage.removeItem("userInfo")
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        localStorage.removeItem("userName")
        localStorage.removeItem("userRole")

        setIsLoggedIn(false)
        setUserName("")
        setUserRole(null)
        window.location.href = "/"
    }

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Link href="/">
                        <div className="flex items-center space-x-2">
                            <img src="/placeholder.svg?height=40&width=40" alt="医护培训" className="h-10 w-10" />
                            <h1 className="text-2xl font-bold text-blue-700">医护培训</h1>
                        </div>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center space-x-6">
                    <Link href="/" className="text-gray-600 hover:text-blue-700">
                        首页
                    </Link>
                    <Link href="/courses" className="text-gray-600 hover:text-blue-700">
                        课程
                    </Link>
                    <Link href="/about" className="text-gray-600 hover:text-blue-700">
                        关于我们
                    </Link>
                    {userRole === "admin" && (
                        <Link href="/admin" className="text-gray-600 hover:text-blue-700">
                            管理后台
                        </Link>
                    )}
                </nav>

                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <UserIcon className="h-4 w-4" />
                                    <span>{userName}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">个人资料</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/my-courses">我的课程</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/my-certificates">我的证书</Link>
                                </DropdownMenuItem>
                                {userRole === "admin" && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin">管理后台</Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    退出登录
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="outline">登录</Button>
                            </Link>
                            <Link href="/register">
                                <Button>注册</Button>
                            </Link>
                        </>
                    )}
                    {!isLoggedIn && <AdminLoginDialog />}
                </div>
            </div>
        </header>
    )
}
