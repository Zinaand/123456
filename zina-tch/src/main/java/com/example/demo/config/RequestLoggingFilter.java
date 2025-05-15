package com.example.demo.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

/**
 * 请求日志记录过滤器
 * 用于记录请求体和响应体的详细内容
 */
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {
    
    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);
    
    private static final List<String> LOGGABLE_CONTENT_TYPES = 
            Collections.unmodifiableList(Arrays.asList(
                    "application/json",
                    "application/xml",
                    "application/x-www-form-urlencoded",
                    "text/plain"
            ));
    
    // 只记录支付相关的API日志
    private static final List<String> PAYMENT_API_PATHS = 
            Collections.unmodifiableList(Arrays.asList(
                    "/api/payments/alipay",
                    "/api/payments/wechat"
            ));
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // 判断是否是我们想要记录的支付API
        boolean shouldLog = false;
        String requestURI = request.getRequestURI();
        for (String path : PAYMENT_API_PATHS) {
            if (requestURI.contains(path)) {
                shouldLog = true;
                break;
            }
        }
        
        // 如果不是支付API，直接放行
        if (!shouldLog) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // 包装请求和响应，以便能够重复读取内容
        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);
        
        // 前置日志记录
        logRequestStart(wrappedRequest);
        
        // 继续过滤器链
        try {
            filterChain.doFilter(wrappedRequest, wrappedResponse);
        } finally {
            // 后置日志记录
            logRequestEnd(wrappedRequest, wrappedResponse);
            // 重要：复制响应内容到原始响应
            wrappedResponse.copyBodyToResponse();
        }
    }
    
    /**
     * 记录请求开始日志
     */
    private void logRequestStart(ContentCachingRequestWrapper request) {
        log.info("=== 接收到API请求 ===");
        log.info("请求方法: {} {}", request.getMethod(), request.getRequestURI());
        log.info("请求参数: {}", getRequestParams(request));
        log.info("Content-Type: {}", request.getContentType());
    }
    
    /**
     * 记录请求结束日志
     */
    private void logRequestEnd(ContentCachingRequestWrapper request, ContentCachingResponseWrapper response) {
        // 记录请求体
        byte[] requestBody = request.getContentAsByteArray();
        if (requestBody.length > 0 && isLoggableContentType(request.getContentType())) {
            log.info("请求体: {}", new String(requestBody, StandardCharsets.UTF_8));
        }
        
        // 记录响应状态和体
        int status = response.getStatus();
        log.info("响应状态: {}", status);
        byte[] responseBody = response.getContentAsByteArray();
        if (responseBody.length > 0 && isLoggableContentType(response.getContentType())) {
            log.info("响应体: {}", new String(responseBody, StandardCharsets.UTF_8));
        }
        log.info("=== API请求结束 ===");
    }
    
    /**
     * 获取请求参数
     */
    private String getRequestParams(HttpServletRequest request) {
        StringBuilder params = new StringBuilder();
        request.getParameterMap().forEach((key, value) -> {
            Stream.of(value).forEach(v -> params.append(key).append("=").append(v).append("&"));
        });
        return params.length() > 0 ? params.substring(0, params.length() - 1) : "";
    }
    
    /**
     * 判断内容类型是否应该记录
     */
    private boolean isLoggableContentType(String contentType) {
        if (contentType == null) return false;
        return LOGGABLE_CONTENT_TYPES.stream()
                .anyMatch(contentType.toLowerCase()::contains);
    }
} 