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
 * 视频分类表
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class VideoCategories implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 分类名称
     */
    private String name;

    /**
     * 分类描述
     */
    private String description;

    /**
     * 父分类ID
     */
    private Integer parentId;

    /**
     * 显示顺序
     */
    private Integer displayOrder;

    private Date createdAt;

    private Date updatedAt;


}
