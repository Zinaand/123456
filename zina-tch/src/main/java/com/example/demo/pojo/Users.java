package com.example.demo.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import java.util.Date;
import com.baomidou.mybatisplus.annotation.Version;
import com.baomidou.mybatisplus.annotation.TableId;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * 用户表
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class Users implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 会员编号
     */
    private String memberNumber;

    /**
     * 姓名
     */
    private String name;

    /**
     * 身份证号
     */
    private String idNumber;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 密码(加密存储)
     */
    private String password;

    /**
     * 头像URL
     */
    private String avatar;

    /**
     * 状态
     */
    private String status;

    /**
     * 角色
     */
    private String role;

    /**
     * 注册时间
     */
    private Date registerDate;

    /**
     * 最后登录时间
     */
    private Date lastLogin;

    private Date createdAt;

    private Date updatedAt;


}
