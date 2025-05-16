package com.example.demo.security;

/**
 * 自定义异常：未授权异常
 * 当用户尝试访问无权限的资源时抛出
 */
public class UnauthorizedException extends RuntimeException {
    
    private static final long serialVersionUID = 1L;

    public UnauthorizedException() {
        super("没有相关权限，请联系管理员");
    }

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
} 