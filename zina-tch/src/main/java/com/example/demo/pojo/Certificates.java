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
 * 证书表
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class Certificates implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 用户ID
     */
    private Integer userId;

    /**
     * 证书标题
     */
    private String title;

    /**
     * 证书描述
     */
    private String description;

    /**
     * 颁发日期
     */
    private Date issueDate;

    /**
     * 过期日期
     */
    private Date expiryDate;

    /**
     * 证书URL
     */
    private String certificateUrl;

    private Date createdAt;

    private Date updatedAt;


}
