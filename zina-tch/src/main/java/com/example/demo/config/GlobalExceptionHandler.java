package com.example.demo.config;

import com.example.demo.utils.Result;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import javax.servlet.http.HttpServletRequest;
import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * 全局异常处理
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * 处理参数校验异常
     */
    @ExceptionHandler(value = {MethodArgumentNotValidException.class, BindException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<String> handleValidException(Exception e) {
        log.error("参数校验异常: {}", e.getMessage(), e);
        
        BindingResult bindingResult = null;
        if (e instanceof MethodArgumentNotValidException) {
            bindingResult = ((MethodArgumentNotValidException) e).getBindingResult();
        } else if (e instanceof BindException) {
            bindingResult = ((BindException) e).getBindingResult();
        }
        
        StringBuilder message = new StringBuilder();
        if (bindingResult != null && bindingResult.hasErrors()) {
            for (FieldError fieldError : bindingResult.getFieldErrors()) {
                message.append(fieldError.getField())
                       .append(": ")
                       .append(fieldError.getDefaultMessage())
                       .append("; ");
            }
        } else {
            message.append("参数校验失败: ").append(e.getMessage());
        }
        
        return Result.validateFailed(message.toString());
    }
    
    /**
     * 处理参数类型不匹配异常
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<String> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
        log.error("参数类型不匹配: {}", e.getMessage(), e);
        return Result.validateFailed("参数类型错误：" + e.getName() + "=" + e.getValue() + ", 需要类型: " + e.getRequiredType());
    }

    /**
     * 处理参数缺失异常
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<String> handleMissingServletRequestParameterException(MissingServletRequestParameterException e) {
        log.error("缺少必要参数: {}", e.getMessage(), e);
        return Result.validateFailed("缺少必要参数：" + e.getParameterName());
    }
    
    /**
     * 处理请求体无法解析异常
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Result<String> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        log.error("请求体无法解析: {}", e.getMessage(), e);
        return Result.validateFailed("请求体不可读或格式错误: " + e.getMessage());
    }
    
    /**
     * 处理请求方法不支持异常
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public Result<String> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        log.error("不支持的请求方法: {}", e.getMessage(), e);
        return Result.error(405, "不支持' " + e.getMethod() + "'请求方法");
    }
    
    /**
     * 处理认证异常
     */
    @ExceptionHandler({ExpiredJwtException.class, SignatureException.class, MalformedJwtException.class})
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Result<String> handleJwtException(Exception e) {
        log.error("JWT认证异常: {}", e.getMessage(), e);
        return Result.unauthorized();
    }
    
    /**
     * 处理授权异常
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Result<String> handleAccessDeniedException(AccessDeniedException e) {
        log.error("访问被拒绝: {}", e.getMessage(), e);
        return Result.forbidden();
    }
    
    /**
     * 处理登录认证异常
     */
    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Result<String> handleBadCredentialsException(BadCredentialsException e) {
        log.error("用户名或密码错误: {}", e.getMessage(), e);
        return Result.validateFailed("用户名或密码错误");
    }
    
    /**
     * 处理其他所有异常
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<String> handleException(Exception e, HttpServletRequest request) {
        // 记录完整的堆栈跟踪
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        String stackTrace = sw.toString();
        
        log.error("未捕获异常: {} \n请求路径: {} \n堆栈跟踪: {}", 
                e.getMessage(), request.getRequestURI(), stackTrace);
        
        // 在开发环境中，返回详细错误信息
        // 在生产环境中应该只返回通用错误消息
        return Result.error("服务器内部错误: " + e.getMessage());
    }
} 