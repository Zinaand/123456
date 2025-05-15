package com.example.demo.service;

import java.time.LocalDateTime;

public interface UserService {
    
    /**
     * 更新用户会员信息
     * @param userId 用户ID
     * @param membershipType 会员类型
     * @param expireTime 过期时间
     */
    void updateMembership(Long userId, String membershipType, LocalDateTime expireTime);
} 