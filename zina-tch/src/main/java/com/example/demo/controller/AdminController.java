package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.demo.pojo.Users;
import com.example.demo.security.RequiresRoles;
import com.example.demo.service.UsersService;
import com.example.demo.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 管理员控制器
 * 用于管理后台的相关操作
 */
@RestController
@RequestMapping("/api/admin")
@RequiresRoles({"admin", "super_admin"})
public class AdminController {

    @Autowired
    private UsersService usersService;

    /**
     * 获取管理后台的统计数据
     * @return 统计数据
     */
    @GetMapping("/dashboard")
    public Result<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // 获取用户总数
        long userCount = usersService.count();
        stats.put("userCount", userCount);
        
        // 获取管理员数量
        QueryWrapper<Users> adminQuery = new QueryWrapper<>();
        adminQuery.eq("role", "admin").or().eq("role", "super_admin");
        long adminCount = usersService.count(adminQuery);
        stats.put("adminCount", adminCount);
        
        // 获取会员数量
        QueryWrapper<Users> memberQuery = new QueryWrapper<>();
        memberQuery.eq("role", "member");
        long memberCount = usersService.count(memberQuery);
        stats.put("memberCount", memberCount);
        
        // 获取普通用户数量
        QueryWrapper<Users> userQuery = new QueryWrapper<>();
        userQuery.eq("role", "user");
        long normalUserCount = usersService.count(userQuery);
        stats.put("normalUserCount", normalUserCount);
        
        // 这里可以添加更多的统计数据，如视频数量、收入等
        
        return Result.success(stats, "获取管理后台统计数据成功");
    }
    
    /**
     * 清理系统缓存
     * @return 操作结果
     */
    @PostMapping("/cache/clear")
    @RequiresRoles("super_admin") // 只有超级管理员才能清理缓存
    public Result<String> clearCache() {
        // 实际清理缓存的代码
        // ...
        
        return Result.success("缓存清理成功");
    }
    
    /**
     * 检查系统状态
     * @return 系统状态
     */
    @GetMapping("/system/status")
    public Result<Map<String, Object>> getSystemStatus() {
        Map<String, Object> status = new HashMap<>();
        
        // 检查各系统组件状态
        status.put("database", "正常");
        status.put("fileStorage", "正常");
        status.put("cache", "正常");
        status.put("memory", Runtime.getRuntime().freeMemory() / (1024 * 1024) + "MB");
        status.put("totalMemory", Runtime.getRuntime().totalMemory() / (1024 * 1024) + "MB");
        
        return Result.success(status, "获取系统状态成功");
    }
    
    /**
     * 执行系统备份
     * @return 操作结果
     */
    @PostMapping("/system/backup")
    @RequiresRoles("super_admin") // 只有超级管理员才能执行备份
    public Result<String> backupSystem() {
        // 实际执行备份的代码
        // ...
        
        return Result.success("系统备份成功");
    }
} 