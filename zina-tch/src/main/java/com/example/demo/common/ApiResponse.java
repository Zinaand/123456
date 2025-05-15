package com.example.demo.common;

import lombok.Data;

@Data
public class ApiResponse<T> {
    
    private int code;
    private String message;
    private T data;
    
    // 成功响应码
    private static final int SUCCESS_CODE = 200;
    // 客户端错误响应码
    private static final int BAD_REQUEST_CODE = 400;
    // 未授权响应码
    private static final int UNAUTHORIZED_CODE = 401;
    // 禁止访问响应码
    private static final int FORBIDDEN_CODE = 403;
    // 资源不存在响应码
    private static final int NOT_FOUND_CODE = 404;
    // 服务器错误响应码
    private static final int INTERNAL_ERROR_CODE = 500;
    
    private ApiResponse(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
    
    /**
     * 成功响应
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(SUCCESS_CODE, "操作成功", data);
    }
    
    /**
     * 成功响应（自定义消息）
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(SUCCESS_CODE, message, data);
    }
    
    /**
     * 客户端错误响应
     */
    public static <T> ApiResponse<T> badRequest(String message) {
        return new ApiResponse<>(BAD_REQUEST_CODE, message, null);
    }
    
    /**
     * 未授权响应
     */
    public static <T> ApiResponse<T> unauthorized(String message) {
        return new ApiResponse<>(UNAUTHORIZED_CODE, message, null);
    }
    
    /**
     * 禁止访问响应
     */
    public static <T> ApiResponse<T> forbidden(String message) {
        return new ApiResponse<>(FORBIDDEN_CODE, message, null);
    }
    
    /**
     * 资源不存在响应
     */
    public static <T> ApiResponse<T> notFound(String message) {
        return new ApiResponse<>(NOT_FOUND_CODE, message, null);
    }
    
    /**
     * 服务器错误响应
     */
    public static <T> ApiResponse<T> internalError(String message) {
        return new ApiResponse<>(INTERNAL_ERROR_CODE, message, null);
    }
} 