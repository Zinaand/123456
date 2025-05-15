package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.common.ApiResponse;
import com.example.demo.dto.VideoDTO;
import com.example.demo.pojo.Videos;
import com.example.demo.service.VideoCategoriesService;
import com.example.demo.service.VideosService;
import com.example.demo.util.VideoUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * <p>
 * 视频表 前端控制器
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
@Slf4j
public class VideosController {

    private final VideosService videosService;
    private final VideoCategoriesService videoCategoriesService;
    
    // 视频文件存储路径
    private static final String VIDEO_UPLOAD_DIR = "/uploads/videos/";
    // 缩略图文件存储路径
    private static final String THUMBNAIL_UPLOAD_DIR = "/uploads/thumbnails/";
    
    /**
     * 获取视频列表（分页）
     */
    @GetMapping
    public ApiResponse<Page<Videos>> list(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "accessType", required = false) String accessType,
            @RequestParam(value = "status", required = false) String status) {
        
        QueryWrapper<Videos> queryWrapper = new QueryWrapper<>();
        
        // 关键字搜索（标题或描述）
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.like("title", keyword)
                    .or()
                    .like("description", keyword);
        }
        
        // 按分类筛选
        if (categoryId != null) {
            queryWrapper.eq("category_id", categoryId);
        }
        
        // 按访问类型筛选
        if (accessType != null && !accessType.trim().isEmpty()) {
            queryWrapper.eq("access_type", accessType);
        }
        
        // 按状态筛选
        if (status != null && !status.trim().isEmpty()) {
            queryWrapper.eq("status", status);
        }
        
        // 默认按上传时间倒序排序
        queryWrapper.orderByDesc("upload_date");
        
        log.info("获取视频列表，查询条件：{}", queryWrapper.getTargetSql());
        
        Page<Videos> videoPage = videosService.page(new Page<>(page, size), queryWrapper);
        
        // 打印返回的结果数量，便于调试
        log.info("获取视频列表成功，共返回 {} 条记录", videoPage.getRecords().size());
        
        return ApiResponse.success(videoPage);
    }
    
    /**
     * 获取视频详情
     */
    @GetMapping("/{id}")
    public ApiResponse<Videos> getById(@PathVariable Integer id) {
        Videos video = videosService.getById(id);
        if (video == null) {
            return ApiResponse.badRequest("视频不存在");
        }
        return ApiResponse.success(video);
    }
    
    /**
     * 创建新视频
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Videos> create(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("categoryId") Integer categoryId,
            @RequestParam("instructorId") Integer instructorId,
            @RequestParam("accessType") String accessType,
            @RequestParam("status") String status,
            @RequestParam(value = "duration", required = false) Integer duration,
            @RequestParam(value = "videoFile", required = false) MultipartFile videoFile,
            @RequestParam(value = "thumbnailFile", required = false) MultipartFile thumbnailFile) {
        
        try {
            // 验证分类是否存在
            if (videoCategoriesService.getById(categoryId) == null) {
                return ApiResponse.badRequest("所选分类不存在");
            }
            
            Videos video = new Videos();
            video.setTitle(title);
            video.setDescription(description);
            video.setCategoryId(categoryId);
            video.setInstructorId(instructorId);
            video.setAccessType(accessType);
            video.setStatus(status);
            video.setViews(0);
            video.setUploadDate(new Date());
            
            // 处理视频文件上传
            if (videoFile != null && !videoFile.isEmpty()) {
                String videoFileName = handleFileUpload(videoFile, VIDEO_UPLOAD_DIR);
                video.setVideoUrl(VIDEO_UPLOAD_DIR + videoFileName);
                
                // 如果未提供时长，尝试从视频文件获取
                if (duration == null) {
                    try {
                        duration = VideoUtils.getDuration(new File(VIDEO_UPLOAD_DIR + videoFileName));
                    } catch (Exception e) {
                        log.warn("无法从视频文件获取时长", e);
                    }
                }
                
                // 如果未提供缩略图，尝试从视频生成
                if (thumbnailFile == null || thumbnailFile.isEmpty()) {
                    try {
                        String thumbnailFileName = UUID.randomUUID().toString() + ".jpg";
                        File thumbnailFile1 = new File(THUMBNAIL_UPLOAD_DIR + thumbnailFileName);
                        VideoUtils.generateThumbnail(new File(VIDEO_UPLOAD_DIR + videoFileName), thumbnailFile1);
                        video.setThumbnailUrl(THUMBNAIL_UPLOAD_DIR + thumbnailFileName);
                    } catch (Exception e) {
                        log.warn("无法从视频生成缩略图", e);
                    }
                }
            }
            
            // 处理缩略图文件上传
            if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
                String thumbnailFileName = handleFileUpload(thumbnailFile, THUMBNAIL_UPLOAD_DIR);
                video.setThumbnailUrl(THUMBNAIL_UPLOAD_DIR + thumbnailFileName);
            }
            
            // 设置时长
            video.setDuration(duration != null ? duration : 0);
            
            // 保存视频信息到数据库
            videosService.save(video);
            
            return ApiResponse.success(video);
        } catch (Exception e) {
            log.error("创建视频失败", e);
            return ApiResponse.internalError("创建视频失败: " + e.getMessage());
        }
    }
    
    /**
     * 更新视频信息
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Videos> update(
            @PathVariable Integer id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("categoryId") Integer categoryId,
            @RequestParam("instructorId") Integer instructorId,
            @RequestParam("accessType") String accessType,
            @RequestParam("status") String status,
            @RequestParam(value = "duration", required = false) Integer duration,
            @RequestParam(value = "videoFile", required = false) MultipartFile videoFile,
            @RequestParam(value = "thumbnailFile", required = false) MultipartFile thumbnailFile) {
        
        try {
            // 验证视频是否存在
            Videos video = videosService.getById(id);
            if (video == null) {
                return ApiResponse.badRequest("视频不存在");
            }
            
            // 验证分类是否存在
            if (videoCategoriesService.getById(categoryId) == null) {
                return ApiResponse.badRequest("所选分类不存在");
            }
            
            // 更新基本信息
            video.setTitle(title);
            video.setDescription(description);
            video.setCategoryId(categoryId);
            video.setInstructorId(instructorId);
            video.setAccessType(accessType);
            video.setStatus(status);
            
            // 处理视频文件更新
            if (videoFile != null && !videoFile.isEmpty()) {
                // 如果之前有视频文件，删除
                if (video.getVideoUrl() != null) {
                    try {
                        Files.deleteIfExists(Paths.get(video.getVideoUrl()));
                    } catch (Exception e) {
                        log.warn("删除旧视频文件失败", e);
                    }
                }
                
                String videoFileName = handleFileUpload(videoFile, VIDEO_UPLOAD_DIR);
                video.setVideoUrl(VIDEO_UPLOAD_DIR + videoFileName);
                
                // 如果未提供时长，尝试从视频文件获取
                if (duration == null) {
                    try {
                        duration = VideoUtils.getDuration(new File(VIDEO_UPLOAD_DIR + videoFileName));
                    } catch (Exception e) {
                        log.warn("无法从视频文件获取时长", e);
                    }
                }
            }
            
            // 处理缩略图文件更新
            if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
                // 如果之前有缩略图文件，删除
                if (video.getThumbnailUrl() != null) {
                    try {
                        Files.deleteIfExists(Paths.get(video.getThumbnailUrl()));
                    } catch (Exception e) {
                        log.warn("删除旧缩略图文件失败", e);
                    }
                }
                
                String thumbnailFileName = handleFileUpload(thumbnailFile, THUMBNAIL_UPLOAD_DIR);
                video.setThumbnailUrl(THUMBNAIL_UPLOAD_DIR + thumbnailFileName);
            }
            
            // 更新时长（如果提供）
            if (duration != null) {
                video.setDuration(duration);
            }
            
            // 更新视频信息到数据库
            videosService.updateById(video);
            
            return ApiResponse.success(video);
        } catch (Exception e) {
            log.error("更新视频失败", e);
            return ApiResponse.internalError("更新视频失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除视频
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> delete(@PathVariable Integer id) {
        try {
            // 验证视频是否存在
            Videos video = videosService.getById(id);
            if (video == null) {
                return ApiResponse.badRequest("视频不存在");
            }
            
            // 删除视频文件
            if (video.getVideoUrl() != null) {
                try {
                    Files.deleteIfExists(Paths.get(video.getVideoUrl()));
                } catch (Exception e) {
                    log.warn("删除视频文件失败", e);
                }
            }
            
            // 删除缩略图文件
            if (video.getThumbnailUrl() != null) {
                try {
                    Files.deleteIfExists(Paths.get(video.getThumbnailUrl()));
                } catch (Exception e) {
                    log.warn("删除缩略图文件失败", e);
                }
            }
            
            // 从数据库删除视频记录
            boolean result = videosService.removeById(id);
            
            return ApiResponse.success(result);
        } catch (Exception e) {
            log.error("删除视频失败", e);
            return ApiResponse.internalError("删除视频失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取视频观看信息
     */
    @GetMapping("/{id}/stats")
    public ApiResponse<Map<String, Object>> getStats(@PathVariable Integer id) {
        // 验证视频是否存在
        Videos video = videosService.getById(id);
        if (video == null) {
            return ApiResponse.badRequest("视频不存在");
        }
        
        // 这里可以根据实际需求获取更多统计数据
        Map<String, Object> stats = new HashMap<>();
        stats.put("views", video.getViews());
        stats.put("averageWatchTime", "15:32"); // 模拟数据
        stats.put("completionRate", "76%"); // 模拟数据
        
        return ApiResponse.success(stats);
    }
    
    /**
     * 处理文件上传，返回生成的文件名
     */
    private String handleFileUpload(MultipartFile file, String uploadDir) throws Exception {
        // 确保目录存在
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        
        // 生成唯一文件名
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = UUID.randomUUID().toString() + extension;
        
        // 保存文件
        Path targetPath = Paths.get(uploadDir).resolve(newFilename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        
        return newFilename;
    }
}

