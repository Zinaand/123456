package com.example.demo.controller;

import com.example.demo.common.ApiResponse;
import com.example.demo.pojo.Users;
import com.example.demo.service.UsersService;
import com.example.demo.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 会员管理控制器
 * 提供会员状态查询等功能
 */
@RestController
@RequestMapping("/api/membership")
@RequiredArgsConstructor
@Slf4j
public class MembershipController {

    private final UsersService usersService;
    private final JwtUtil jwtUtil;

    /**
     * 获取当前用户的会员信息
     */
    @GetMapping
    public ApiResponse<Map<String, Object>> getMembershipInfo(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ApiResponse.unauthorized("请先登录");
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return ApiResponse.unauthorized("登录已过期，请重新登录");
        }

        Integer userId = jwtUtil.getUserIdFromToken(token);
        Users user = usersService.getById(userId);

        if (user == null) {
            return ApiResponse.badRequest("用户不存在");
        }

        Map<String, Object> membershipInfo = new HashMap<>();
        membershipInfo.put("membershipType", user.getMembershipType());
        membershipInfo.put("membershipStartDate", user.getMembershipStartDate());
        membershipInfo.put("membershipExpireDate", user.getMembershipExpireDate());
        membershipInfo.put("role", user.getRole());

        boolean isValidMember = isValidMember(user);
        membershipInfo.put("isValidMember", isValidMember);

        String message = isValidMember ? "会员状态正常" : "当前非会员或会员已过期";

        return ApiResponse.success(message, membershipInfo);
    }

    /**
     * 判断用户是否为有效会员
     */
    private boolean isValidMember(Users user) {
        if (user == null) {
            return false;
        }
        if ("admin".equals(user.getRole()) || "super_admin".equals(user.getRole())) {
            return true;
        }
        if ("member".equals(user.getRole())) {
            if (user.getMembershipExpireDate() == null) {
                return false;
            }
            return user.getMembershipExpireDate().after(new java.util.Date());
        }
        return false;
    }
}
