package com.example.demo.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 视频数据传输对象
 */
@Data
public class VideoDTO {
    
    // 视频ID
    private Integer id;
    
    // 视频标题
    private String title;
    
    // 视频描述
    private String description;
    
    // 分类ID
    private Integer categoryId;
    
    // 分类名称
    private String categoryName;
    
    // 讲师ID
    private Integer instructorId;
    
    // 讲师名称
    private String instructorName;
    
    // 时长(秒)
    private Integer duration;
    
    // 视频URL
    private String videoUrl;
    
    // 缩略图URL
    private String thumbnailUrl;
    
    // 访问类型(external:非会员可观看5分钟,internal:仅会员)
    private String accessType;
    
    // 观看次数
    private Integer views;
    
    // 状态(draft:草稿,published:已发布,archived:已归档)
    private String status;
    
    // 上传日期
    private Date uploadDate;
    
    // 创建时间
    private Date createdAt;
    
    // 更新时间
    private Date updatedAt;
    
    // 视频文件（仅用于上传）
    private transient MultipartFile videoFile;
    
    // 缩略图文件（仅用于上传）
    private transient MultipartFile thumbnailFile;
    
    // 标签（逗号分隔的标签字符串）
    private String tags;
} 