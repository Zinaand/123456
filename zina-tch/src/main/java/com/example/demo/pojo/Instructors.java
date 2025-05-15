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
 * 讲师表
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class Instructors implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 讲师姓名
     */
    private String name;

    /**
     * 职称
     */
    private String title;

    /**
     * 所属机构
     */
    private String organization;

    /**
     * 个人简介
     */
    private String bio;

    /**
     * 头像URL
     */
    private String avatar;

    private Date createdAt;

    private Date updatedAt;


}
