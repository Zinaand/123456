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
 * 视频表
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class Videos implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 视频标题
     */
    private String title;

    /**
     * 视频描述
     */
    private String description;

    /**
     * 分类ID
     */
    private Integer categoryId;

    /**
     * 讲师ID
     */
    private Integer instructorId;

    /**
     * 时长(秒)
     */
    private Integer duration;

    /**
     * 视频URL
     */
    private String videoUrl;

    /**
     * 缩略图URL
     */
    private String thumbnailUrl;

    /**
     * 访问类型(external:非会员可观看5分钟,internal:仅会员)
     */
    private String accessType;

    /**
     * 观看次数
     */
    private Integer views;

    /**
     * 状态
     */
    private String status;

    /**
     * 上传时间
     */
    private Date uploadDate;

    private Date createdAt;

    private Date updatedAt;


}
