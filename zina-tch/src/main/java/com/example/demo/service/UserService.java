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

    /**
     * 判断用户是否为有效会员（含角色和到期时间检查）
     * @param user 用户对象
     * @return true=有效会员可访问，false=非会员
     */
    boolean isValidMember(com.example.demo.pojo.Users user);
}