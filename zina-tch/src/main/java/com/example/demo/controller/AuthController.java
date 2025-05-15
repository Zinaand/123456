package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.demo.pojo.Users;
import com.example.demo.service.UsersService;
import com.example.demo.utils.JwtUtil;
import com.example.demo.utils.PasswordUtil;
import com.example.demo.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * 认证管理 前端控制器
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UsersService usersService;
    
    @Autowired
    private PasswordUtil passwordUtil;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * 用户登录
     * @param loginDto 登录参数(用户名/密码)
     * @return token信息
     */
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> loginDto) {
        String username = loginDto.get("username");
        String password = loginDto.get("password");
        
        // 参数校验
        if (username == null || password == null) {
            return Result.validateFailed("用户名或密码不能为空");
        }
        
        // 查询用户
        QueryWrapper<Users> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", username).or().eq("phone", username);
        Users user = usersService.getOne(queryWrapper);
        
        // 用户不存在
        if (user == null) {
            return Result.validateFailed("用户名或密码错误");
        }
        
        // 密码校验
        if (!passwordUtil.matches(password, user.getPassword())) {
            return Result.validateFailed("用户名或密码错误");
        }
        
        // 更新最后登录时间
        user.setLastLogin(new Date());
        usersService.updateById(user);
        
        // 生成token
        String token = jwtUtil.generateToken(user.getId(), user.getName(), user.getRole());
        
        // 返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("userId", user.getId());
        result.put("name", user.getName());
        result.put("role", user.getRole());
        
        return Result.success(result, "登录成功");
    }
    
    /**
     * 用户注册
     * @param registerDto 注册参数(用户名/密码/邮箱)
     * @return 注册结果
     */
    @PostMapping("/register")
    public Result<Map<String, Object>> register(@RequestBody Map<String, String> registerDto) {
        String username = registerDto.get("username");
        String password = registerDto.get("password");
        String email = registerDto.get("email");
        
        // 参数校验
        if (username == null || password == null || email == null) {
            return Result.validateFailed("用户名、密码或邮箱不能为空");
        }
        
        // 检查邮箱是否已存在
        QueryWrapper<Users> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", email);
        if (usersService.count(queryWrapper) > 0) {
            return Result.validateFailed("该邮箱已被注册");
        }
        
        // 创建用户
        Users user = new Users();
        user.setName(username);
        user.setPassword(passwordUtil.encode(password)); // 密码加密
        user.setEmail(email);
        user.setRole("user"); // 默认角色
        user.setStatus("active"); // 默认状态
        user.setRegisterDate(new Date());
        user.setCreatedAt(new Date());
        user.setUpdatedAt(new Date());
        
        // 生成会员编号 (可根据实际需求调整)
        user.setMemberNumber("MEM" + System.currentTimeMillis());
        
        // 保存用户
        boolean success = usersService.save(user);
        if (!success) {
            return Result.error("注册失败，请稍后重试");
        }
        
        // 生成token
        String token = jwtUtil.generateToken(user.getId(), user.getName(), user.getRole());
        
        // 返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("userId", user.getId());
        result.put("name", user.getName());
        result.put("role", user.getRole());
        
        return Result.success(result, "注册成功");
    }
} 