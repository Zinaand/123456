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
 * 视频观看记录表
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class WatchHistory implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 用户ID
     */
    private Integer userId;

    /**
     * 视频ID
     */
    private Integer videoId;

    /**
     * 观看进度(秒)
     */
    private Integer progress;

    /**
     * 是否完成观看
     */
    private Boolean completed;

    /**
     * 最后观看时间
     */
    private Date lastWatched;

    private Date createdAt;

    private Date updatedAt;


}
