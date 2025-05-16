package com.example.demo.security;

import io.jsonwebtoken.Claims;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.Arrays;

/**
 * 角色检查切面
 * 拦截带有RequiresRoles注解的方法，判断当前用户是否有权限执行
 */
@Aspect
@Component
public class RoleCheckAspect {
    
    @Autowired
    private com.example.demo.utils.JwtUtil jwtUtil;
    
    /**
     * 环绕通知：拦截带有RequiresRoles注解的方法
     * @param joinPoint 切点
     * @return 方法执行结果
     * @throws Throwable 可能抛出的异常
     */
    @Around("@annotation(com.example.demo.security.RequiresRoles) || @within(com.example.demo.security.RequiresRoles)")
    public Object checkRole(ProceedingJoinPoint joinPoint) throws Throwable {
        // 获取当前请求
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        
        // 获取当前用户角色
        String role = getCurrentUserRole(request);
        
        // 如果未获取到角色，说明用户未登录
        if (role == null) {
            throw new UnauthorizedException("未登录或登录已过期，请重新登录");
        }
        
        // 获取目标方法上的RequiresRoles注解
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        
        // 优先检查方法上的注解
        RequiresRoles methodRequiresRoles = method.getAnnotation(RequiresRoles.class);
        
        // 如果方法上没有，则检查类上的注解
        RequiresRoles classRequiresRoles = null;
        if (methodRequiresRoles == null) {
            classRequiresRoles = method.getDeclaringClass().getAnnotation(RequiresRoles.class);
        }
        
        // 合并获取需要的角色
        RequiresRoles requiresRoles = methodRequiresRoles != null ? methodRequiresRoles : classRequiresRoles;
        
        // 如果没有RequiresRoles注解，直接放行
        if (requiresRoles == null) {
            return joinPoint.proceed();
        }
        
        // 检查用户角色是否满足要求
        String[] requiredRoles = requiresRoles.value();
        boolean hasPermission = false;
        
        // 判断逻辑类型
        if (requiresRoles.logical() == RequiresRoles.Logical.OR) {
            // OR逻辑：用户拥有任一所需角色即可
            hasPermission = Arrays.stream(requiredRoles)
                    .anyMatch(requiredRole -> requiredRole.equals(role));
        } else {
            // AND逻辑：用户必须拥有所有所需角色
            hasPermission = Arrays.stream(requiredRoles)
                    .allMatch(requiredRole -> requiredRole.equals(role));
        }
        
        // 如果没有权限，抛出异常
        if (!hasPermission) {
            throw new UnauthorizedException();
        }
        
        // 有权限，执行原方法
        return joinPoint.proceed();
    }
    
    /**
     * 获取当前用户角色
     * @param request HTTP请求
     * @return 用户角色
     */
    private String getCurrentUserRole(HttpServletRequest request) {
        // 1. 首先从Security上下文中获取
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            // 从用户名中解析角色，假设格式为："username:role"
            String principal = authentication.getName();
            if (principal.contains(":")) {
                return principal.split(":")[1];
            }
        }
        
        // 2. 如果Security上下文中没有，则从JWT令牌中获取
        String jwt = getJwtFromRequest(request);
        if (StringUtils.hasText(jwt) && jwtUtil.validateToken(jwt)) {
            Claims claims = jwtUtil.parseToken(jwt);
            return (String) claims.get("role");
        }
        
        return null;
    }
    
    /**
     * 从请求头获取JWT令牌
     * @param request HTTP请求
     * @return JWT令牌
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
} 