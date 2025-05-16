package com.example.demo.security;

/**
 * 用户角色枚举类
 * 定义系统中所有角色
 */
public enum UserRole {
    
    USER("user", "普通用户"),
    ADMIN("admin", "管理员"),
    SUPER_ADMIN("super_admin", "超级管理员"),
    MEMBER("member", "会员");
    
    private final String code;
    private final String description;
    
    UserRole(String code, String description) {
        this.code = code;
        this.description = description;
    }
    
    public String getCode() {
        return code;
    }
    
    public String getDescription() {
        return description;
    }
    
    /**
     * 根据角色代码获取角色枚举
     * @param code 角色代码
     * @return 角色枚举，若未找到则返回null
     */
    public static UserRole getByCode(String code) {
        for (UserRole role : UserRole.values()) {
            if (role.getCode().equals(code)) {
                return role;
            }
        }
        return null;
    }
    
    /**
     * 判断角色代码是否有效
     * @param code 角色代码
     * @return 是否有效
     */
    public static boolean isValidRole(String code) {
        return getByCode(code) != null;
    }
} 