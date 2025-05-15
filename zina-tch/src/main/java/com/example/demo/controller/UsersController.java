package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.pojo.Users;
import com.example.demo.service.UsersService;
import com.example.demo.utils.JwtUtil;
import com.example.demo.utils.PasswordUtil;
import com.example.demo.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * 用户表 前端控制器
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@RestController
@RequestMapping("/users")
public class UsersController {

    @Autowired
    private UsersService usersService;
    
    @Autowired
    private PasswordUtil passwordUtil;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * 获取用户列表（分页）
     * @param page 页码
     * @param size 每页条数
     * @param keyword 搜索关键词
     * @return 用户列表
     */
    @GetMapping
    public Result<Map<String, Object>> getUserList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword) {
        
        // 创建分页对象
        Page<Users> pageParam = new Page<>(page, size);
        
        // 构建查询条件
        QueryWrapper<Users> queryWrapper = new QueryWrapper<>();
        
        // 关键词搜索
        if (keyword != null && !keyword.isEmpty()) {
            queryWrapper.like("name", keyword)
                    .or().like("email", keyword)
                    .or().like("phone", keyword)
                    .or().like("member_number", keyword);
        }
        
        // 按注册时间降序排序
        queryWrapper.orderByDesc("register_date");
        
        // 执行分页查询
        Page<Users> userPage = usersService.page(pageParam, queryWrapper);
        
        // 封装结果
        Map<String, Object> result = new HashMap<>();
        result.put("total", userPage.getTotal());
        result.put("pages", userPage.getPages());
        result.put("current", userPage.getCurrent());
        result.put("records", userPage.getRecords());
        
        return Result.success(result);
    }
    
    /**
     * 获取用户详情
     * @param id 用户ID
     * @return 用户详情
     */
    @GetMapping("/{id}")
    public Result<Users> getUserDetail(@PathVariable Integer id) {
        Users user = usersService.getById(id);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        // 密码脱敏
        user.setPassword(null);
        
        return Result.success(user);
    }
    
    /**
     * 新增用户
     * @param user 用户信息
     * @return 操作结果
     */
    @PostMapping
    public Result<Users> createUser(@RequestBody Users user) {
        // 检查必要参数
        if (user.getName() == null || user.getEmail() == null || user.getPassword() == null) {
            return Result.validateFailed("姓名、邮箱和密码不能为空");
        }
        
        // 检查邮箱是否已存在
        QueryWrapper<Users> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", user.getEmail());
        if (usersService.count(queryWrapper) > 0) {
            return Result.validateFailed("该邮箱已被注册");
        }
        
        // 检查手机号是否已存在（如果提供）
        if (user.getPhone() != null && !user.getPhone().isEmpty()) {
            queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("phone", user.getPhone());
            if (usersService.count(queryWrapper) > 0) {
                return Result.validateFailed("该手机号已被注册");
            }
        }
        
        // 密码加密
        user.setPassword(passwordUtil.encode(user.getPassword()));
        
        // 设置初始状态和注册时间
        if (user.getStatus() == null) {
            user.setStatus("active");
        }
        
        if (user.getRole() == null) {
            user.setRole("user");
        }
        
        user.setRegisterDate(new Date());
        user.setCreatedAt(new Date());
        user.setUpdatedAt(new Date());
        
        // 生成会员编号
        user.setMemberNumber("MEM" + System.currentTimeMillis());
        
        // 保存用户
        boolean success = usersService.save(user);
        if (!success) {
            return Result.error("用户创建失败");
        }
        
        // 密码脱敏
        user.setPassword(null);
        
        return Result.success(user, "用户创建成功");
    }
    
    /**
     * 更新用户信息
     * @param id 用户ID
     * @param user 用户信息
     * @return 操作结果
     */
    @PutMapping("/{id}")
    public Result<Users> updateUser(@PathVariable Integer id, @RequestBody Users user) {
        // 检查用户是否存在
        Users existingUser = usersService.getById(id);
        if (existingUser == null) {
            return Result.error("用户不存在");
        }
        
        // 设置ID
        user.setId(id);
        
        // 如果修改了邮箱，检查是否已存在
        if (user.getEmail() != null && !user.getEmail().equals(existingUser.getEmail())) {
            QueryWrapper<Users> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("email", user.getEmail());
            if (usersService.count(queryWrapper) > 0) {
                return Result.validateFailed("该邮箱已被其他用户使用");
            }
        }
        
        // 如果修改了手机号，检查是否已存在
        if (user.getPhone() != null && !user.getPhone().isEmpty() && !user.getPhone().equals(existingUser.getPhone())) {
            QueryWrapper<Users> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("phone", user.getPhone());
            if (usersService.count(queryWrapper) > 0) {
                return Result.validateFailed("该手机号已被其他用户使用");
            }
        }
        
        // 如果更新密码，需要加密
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordUtil.encode(user.getPassword()));
        } else {
            // 不更新密码
            user.setPassword(null);
        }
        
        // 更新时间
        user.setUpdatedAt(new Date());
        
        // 更新用户信息
        boolean success = usersService.updateById(user);
        if (!success) {
            return Result.error("用户更新失败");
        }
        
        // 获取更新后的用户信息
        Users updatedUser = usersService.getById(id);
        
        // 密码脱敏
        updatedUser.setPassword(null);
        
        return Result.success(updatedUser, "用户更新成功");
    }
    
    /**
     * 删除用户
     * @param id 用户ID
     * @return 操作结果
     */
    @DeleteMapping("/{id}")
    public Result<Object> deleteUser(@PathVariable Integer id) {
        // 检查用户是否存在
        Users existingUser = usersService.getById(id);
        if (existingUser == null) {
            return Result.error("用户不存在");
        }
        
        // 删除用户
        boolean success = usersService.removeById(id);
        if (!success) {
            return Result.error("用户删除失败");
        }
        
        return Result.success(null, "用户删除成功");
    }
    
    /**
     * 更新用户状态
     * @param id 用户ID
     * @param statusMap 状态信息
     * @return 操作结果
     */
    @PatchMapping("/{id}/status")
    public Result<Users> updateUserStatus(@PathVariable Integer id, @RequestBody Map<String, String> statusMap) {
        String status = statusMap.get("status");
        if (status == null) {
            return Result.validateFailed("状态参数不能为空");
        }
        
        // 检查状态值是否有效
        if (!status.equals("active") && !status.equals("inactive") && !status.equals("locked")) {
            return Result.validateFailed("无效的状态值");
        }
        
        // 检查用户是否存在
        Users existingUser = usersService.getById(id);
        if (existingUser == null) {
            return Result.error("用户不存在");
        }
        
        // 更新状态
        existingUser.setStatus(status);
        existingUser.setUpdatedAt(new Date());
        
        boolean success = usersService.updateById(existingUser);
        if (!success) {
            return Result.error("状态更新失败");
        }
        
        // 密码脱敏
        existingUser.setPassword(null);
        
        return Result.success(existingUser, "状态更新成功");
    }
    
    /**
     * 更新用户角色
     * @param id 用户ID
     * @param roleMap 角色信息
     * @return 操作结果
     */
    @PatchMapping("/{id}/role")
    public Result<Users> updateUserRole(@PathVariable Integer id, @RequestBody Map<String, String> roleMap) {
        String role = roleMap.get("role");
        if (role == null) {
            return Result.validateFailed("角色参数不能为空");
        }
        
        // 检查角色值是否有效
        if (!role.equals("admin") && !role.equals("user")) {
            return Result.validateFailed("无效的角色值");
        }
        
        // 检查用户是否存在
        Users existingUser = usersService.getById(id);
        if (existingUser == null) {
            return Result.error("用户不存在");
        }
        
        // 更新角色
        existingUser.setRole(role);
        existingUser.setUpdatedAt(new Date());
        
        boolean success = usersService.updateById(existingUser);
        if (!success) {
            return Result.error("角色更新失败");
        }
        
        // 密码脱敏
        existingUser.setPassword(null);
        
        return Result.success(existingUser, "角色更新成功");
    }
    
    /**
     * 批量删除用户
     * @param ids 用户ID列表
     * @return 操作结果
     */
    @DeleteMapping("/batch")
    public Result<Object> batchDeleteUsers(@RequestBody List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return Result.validateFailed("用户ID列表不能为空");
        }
        
        boolean success = usersService.removeByIds(ids);
        if (!success) {
            return Result.error("批量删除失败");
        }
        
        return Result.success(null, "批量删除成功");
    }
}

