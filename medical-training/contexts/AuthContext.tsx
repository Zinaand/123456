"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

// 定义用户类型
interface User {
  id: number;
  name: string;
  role: string;
  memberNumber?: string;
}

// 定义身份验证上下文类型
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 身份验证提供者组件
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // 初始化：从本地存储加载用户信息
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userInfoStr = localStorage.getItem("userInfo");

        if (token && userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          setUser(userInfo);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("初始化身份验证失败:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    // 仅在客户端执行
    if (typeof window !== "undefined") {
      initializeAuth();
    }
  }, []);

  // 登录函数
  const login = (token: string, userData: User) => {
    // 保存token和用户信息到localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userData.id.toString());
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("userRole", userData.role);
    localStorage.setItem("userInfo", JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  };

  // 登出函数
  const logout = () => {
    // 清除localStorage中的用户信息
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userInfo");

    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  // 检查身份验证状态
  const checkAuth = (): boolean => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 使用身份验证的自定义钩子
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth必须在AuthProvider内部使用");
  }
  return context;
}; 