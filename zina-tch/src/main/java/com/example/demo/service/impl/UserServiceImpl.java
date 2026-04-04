package com.example.demo.service.impl;

import com.example.demo.pojo.Users;
import com.example.demo.service.UserService;
import com.example.demo.service.UsersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UsersService usersService;

    @Override
    @Transactional
    public void updateMembership(Long userId, String membershipType, LocalDateTime expireTime) {
        log.info("更新用户会员信息, userId={}, membershipType={}, expireTime={}", userId, membershipType, expireTime);

        Users user = usersService.getById(userId);
        if (user == null) {
            log.error("用户不存在, userId={}", userId);
            return;
        }

        // 设置会员信息
        user.setMembershipType(membershipType);
        user.setMembershipStartDate(new java.util.Date());
        user.setMembershipExpireDate(java.sql.Timestamp.valueOf(expireTime));
        user.setUpdatedAt(new java.util.Date());

        // 将普通用户角色升级为 member
        if ("user".equals(user.getRole())) {
            user.setRole("member");
            log.info("用户 {} 角色从 user 升级为 member", userId);
        }

        usersService.updateById(user);
        log.info("用户 {} 会员信息更新成功，会员类型: {}，到期时间: {}", userId, membershipType, expireTime);
    }

    /**
     * 检查用户是否为有效会员（会员未过期）
     */
    @Override
    public boolean isValidMember(Users user) {
        if (user == null) {
            return false;
        }
        // admin/super_admin 始终可访问
        if ("admin".equals(user.getRole()) || "super_admin".equals(user.getRole())) {
            return true;
        }
        // member 角色需要检查到期时间
        if ("member".equals(user.getRole())) {
            if (user.getMembershipExpireDate() == null) {
                return false;
            }
            return user.getMembershipExpireDate().after(new java.util.Date());
        }
        return false;
    }
} 