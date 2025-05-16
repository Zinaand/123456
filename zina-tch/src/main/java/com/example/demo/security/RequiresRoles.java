package com.example.demo.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 自定义注解：要求特定角色才能访问
 * 可以应用于类和方法上
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresRoles {
    /**
     * 允许访问的角色列表，默认为空
     */
    String[] value() default {};
    
    /**
     * 逻辑类型：AND要求拥有所有角色，OR要求拥有任一角色
     */
    Logical logical() default Logical.OR;
    
    /**
     * 枚举：逻辑类型
     */
    enum Logical {
        AND, OR
    }
} 