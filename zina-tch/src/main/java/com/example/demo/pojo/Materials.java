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
 * 学习资料表
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class Materials implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 关联的视频ID
     */
    private Integer videoId;

    /**
     * 资料名称
     */
    private String name;

    /**
     * 资料描述
     */
    private String description;

    /**
     * 文件URL
     */
    private String fileUrl;

    /**
     * 文件类型
     */
    private String fileType;

    /**
     * 文件大小(KB)
     */
    private Integer fileSize;

    /**
     * 访问类型(external:公开,internal:仅会员)
     */
    private String accessType;

    /**
     * 下载次数
     */
    private Integer downloadCount;

    private Date createdAt;

    private Date updatedAt;


}
