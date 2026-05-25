package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.demo.pojo.Users;
import com.example.demo.pojo.WatchHistory;
import com.example.demo.pojo.Payments;
import com.example.demo.pojo.Videos;
import com.example.demo.service.UsersService;
import com.example.demo.service.PaymentsService;
import com.example.demo.service.WatchHistoryService;
import com.example.demo.service.VideosService;
import com.example.demo.utils.JwtUtil;
import com.example.demo.utils.PasswordUtil;
import com.example.demo.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

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
    private PaymentsService paymentsService;
    
    @Autowired
    private WatchHistoryService watchHistoryService;
    
    @Autowired
    private VideosService videosService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private PasswordUtil passwordUtil;
    
    private Integer resolveUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return null;
        }
        return jwtUtil.getUserIdFromToken(token);
    }
    
    /**
     * 获取用户个人信息
     */
    @GetMapping("/profile")
    public Result<Map<String, Object>> getUserProfile(HttpServletRequest request) {
        Integer userId = resolveUserId(request);
        if (userId == null) {
            return Result.unauthorized();
        }
        
        Users user = usersService.getById(userId);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
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
        userInfo.put("membershipType", user.getMembershipType());
        userInfo.put("membershipStartDate", user.getMembershipStartDate());
        userInfo.put("membershipExpireDate", user.getMembershipExpireDate());
        
        boolean isValidMember = isValidMember(user);
        userInfo.put("isValidMember", isValidMember);
        
        return Result.success(userInfo);
    }
    
    /**
     * 更新用户个人信息
     */
    @PutMapping("/profile")
    public Result<Map<String, Object>> updateUserProfile(
            @RequestBody Map<String, String> profileData,
            HttpServletRequest request) {
        Integer userId = resolveUserId(request);
        if (userId == null) {
            return Result.unauthorized();
        }
        
        Users user = usersService.getById(userId);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        if (profileData.containsKey("name")) {
            String name = profileData.get("name");
            if (name != null && !name.trim().isEmpty()) {
                user.setName(name.trim());
            }
        }
        if (profileData.containsKey("phone")) {
            user.setPhone(profileData.get("phone"));
        }
        if (profileData.containsKey("avatar")) {
            user.setAvatar(profileData.get("avatar"));
        }
        user.setUpdatedAt(new Date());
        
        boolean success = usersService.updateById(user);
        if (!success) {
            return Result.error("更新失败，请稍后重试");
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("id", user.getId());
        result.put("name", user.getName());
        result.put("email", user.getEmail());
        result.put("phone", user.getPhone());
        result.put("avatar", user.getAvatar());
        result.put("role", user.getRole());
        result.put("status", user.getStatus());
        result.put("memberNumber", user.getMemberNumber());
        result.put("registerDate", user.getRegisterDate());
        result.put("lastLogin", user.getLastLogin());
        result.put("membershipType", user.getMembershipType());
        result.put("membershipStartDate", user.getMembershipStartDate());
        result.put("membershipExpireDate", user.getMembershipExpireDate());
        result.put("isValidMember", isValidMember(user));
        
        return Result.success(result, "个人信息更新成功");
    }
    
    /**
     * 修改密码
     */
    @PutMapping("/password")
    public Result<Void> changePassword(
            @RequestBody Map<String, String> passwordData,
            HttpServletRequest request) {
        Integer userId = resolveUserId(request);
        if (userId == null) {
            return Result.unauthorized();
        }
        
        String oldPassword = passwordData.get("oldPassword");
        String newPassword = passwordData.get("newPassword");
        
        if (oldPassword == null || oldPassword.isEmpty() || newPassword == null || newPassword.isEmpty()) {
            return Result.validateFailed("旧密码和新密码不能为空");
        }
        
        if (newPassword.length() < 6) {
            return Result.validateFailed("新密码长度不能少于6位");
        }
        
        Users user = usersService.getById(userId);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        if (!passwordUtil.matches(oldPassword, user.getPassword())) {
            return Result.validateFailed("旧密码不正确");
        }
        
        user.setPassword(passwordUtil.encode(newPassword));
        user.setUpdatedAt(new Date());
        
        boolean success = usersService.updateById(user);
        if (!success) {
            return Result.error("密码修改失败，请稍后重试");
        }
        
        return Result.success(null, "密码修改成功");
    }
    
    /**
     * 获取用户观看记录（含视频详情）
     */
    @GetMapping("/watch-history")
    public Result<Map<String, Object>> getUserWatchHistory(HttpServletRequest request) {
        Integer userId = resolveUserId(request);
        if (userId == null) {
            return Result.unauthorized();
        }
        
        QueryWrapper<WatchHistory> historyQuery = new QueryWrapper<>();
        historyQuery.eq("user_id", userId).orderByDesc("last_watched");
        List<WatchHistory> watchHistories = watchHistoryService.list(historyQuery);
        
        List<Map<String, Object>> historyDetails = new ArrayList<>();
        long totalWatchTime = 0;
        int completedCount = 0;
        
        for (WatchHistory wh : watchHistories) {
            Videos video = videosService.getById(wh.getVideoId());
            
            Map<String, Object> item = new HashMap<>();
            item.put("id", wh.getId());
            item.put("videoId", wh.getVideoId());
            item.put("progress", wh.getProgress());
            item.put("completed", wh.getCompleted());
            item.put("lastWatched", wh.getLastWatched());
            item.put("createdAt", wh.getCreatedAt());
            
            if (video != null) {
                item.put("videoTitle", video.getTitle());
                item.put("videoThumbnail", video.getThumbnailUrl());
                item.put("videoDuration", video.getDuration());
                item.put("videoUrl", video.getVideoUrl());
            }
            
            if (wh.getProgress() != null) {
                totalWatchTime += wh.getProgress();
            }
            if (Boolean.TRUE.equals(wh.getCompleted())) {
                completedCount++;
            }
            
            historyDetails.add(item);
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("records", historyDetails);
        result.put("totalCount", historyDetails.size());
        result.put("totalWatchTime", totalWatchTime);
        result.put("completedCount", completedCount);
        
        return Result.success(result);
    }
    
    /**
     * 获取用户支付记录
     */
    @GetMapping("/payments")
    public Result<List<Map<String, Object>>> getUserPayments(HttpServletRequest request) {
        Integer userId = resolveUserId(request);
        if (userId == null) {
            return Result.unauthorized();
        }
        
        QueryWrapper<Payments> paymentQuery = new QueryWrapper<>();
        paymentQuery.eq("user_id", userId).orderByDesc("created_at");
        
        List<Payments> payments = paymentsService.list(paymentQuery);
        
        List<Map<String, Object>> paymentList = new ArrayList<>();
        for (Payments p : payments) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", p.getId());
            item.put("amount", p.getAmount());
            item.put("paymentMethod", p.getPaymentMethod());
            item.put("status", p.getStatus());
            item.put("transactionId", p.getTransactionId());
            item.put("paymentDate", p.getPaymentDate());
            item.put("createdAt", p.getCreatedAt());
            paymentList.add(item);
        }
        
        return Result.success(paymentList);
    }
    
    private boolean isValidMember(Users user) {
        if (user == null) return false;
        if ("admin".equals(user.getRole()) || "super_admin".equals(user.getRole())) return true;
        if ("member".equals(user.getRole())) {
            return user.getMembershipExpireDate() != null
                    && user.getMembershipExpireDate().after(new Date());
        }
        return false;
    }
}
