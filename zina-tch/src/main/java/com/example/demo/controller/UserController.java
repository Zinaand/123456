package com.example.demo.controller;

import com.example.demo.pojo.Users;
import com.example.demo.service.UsersService;
import com.example.demo.utils.JwtUtil;
import com.example.demo.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * 用户信息 前端控制器
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private UsersService usersService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * 获取用户个人信息
     * @param request HTTP请求
     * @return 用户信息
     */
    @GetMapping("/profile")
    public Result<Map<String, Object>> getUserProfile(HttpServletRequest request) {
        // 从请求头中获取token
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Result.unauthorized();
        }
        
        // 解析token
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return Result.unauthorized();
        }
        
        // 获取用户ID
        Integer userId = jwtUtil.getUserIdFromToken(token);
        if (userId == null) {
            return Result.unauthorized();
        }
        
        // 查询用户信息
        Users user = usersService.getById(userId);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        // 组装返回数据（过滤敏感信息）
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("name", user.getName());
        userInfo.put("email", user.getEmail());
        userInfo.put("phone", user.getPhone());
        userInfo.put("avatar", user.getAvatar());
        userInfo.put("role", user.getRole());
        userInfo.put("status", user.getStatus());
        userInfo.put("memberNumber", user.getMemberNumber());
        userInfo.put("registerDate", user.getRegisterDate());
        userInfo.put("lastLogin", user.getLastLogin());
        
        return Result.success(userInfo);
    }
} 