package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.common.ApiResponse;
import com.example.demo.dto.VideoDTO;
import com.example.demo.pojo.Users;
import com.example.demo.pojo.Videos;
import com.example.demo.pojo.WatchHistory;
import com.example.demo.service.UserService;
import com.example.demo.service.UsersService;
import com.example.demo.service.VideoCategoriesService;
import com.example.demo.service.VideosService;
import com.example.demo.service.WatchHistoryService;
import com.example.demo.util.VideoUtils;
import com.example.demo.utils.JwtUtil;
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
import java.util.List;
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
    private final UsersService usersService;
    private final UserService userService;
    private final WatchHistoryService watchHistoryService;
    private final JwtUtil jwtUtil;

    // 后端视频文件存储路径
    private static final String BACKEND_BASE_DIR = System.getProperty("user.dir") + "/uploads";
    private static final String VIDEO_UPLOAD_DIR = BACKEND_BASE_DIR + "/videos/";

    // 前端 public 目录下的缩略图存储路径
    private static final String FRONTEND_PUBLIC_DIR = "D:/Zina/在线课程项目/medical-training/public/uploads";
    private static final String THUMBNAIL_UPLOAD_DIR = FRONTEND_PUBLIC_DIR + "/thumbnails/";
    
    /**
     * 获取热门视频（按播放量排序）
     */
    @GetMapping("/popular")
    public ApiResponse<List<Videos>> getPopular(
            @RequestParam(value = "limit", defaultValue = "4") int limit,
            @RequestParam(value = "status", defaultValue = "published") String status) {

        List<Videos> videos = videosService.getPopularVideos(limit, status);
        for (Videos video : videos) {
            convertVideoUrls(video);
        }

        log.info("获取热门视频成功，共返回 {} 条记录", videos.size());
        return ApiResponse.success(videos);
    }

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
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "sort", required = false) String sort) {
        
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
        
        // 排序：支持 views,desc / views,asc，默认按上传时间倒序
        if (sort != null && sort.toLowerCase().contains("views")) {
            if (sort.toLowerCase().contains("asc")) {
                queryWrapper.orderByAsc("views");
            } else {
                queryWrapper.orderByDesc("views");
            }
        } else {
            queryWrapper.orderByDesc("upload_date");
        }
        
        log.info("获取视频列表，查询条件：{}", queryWrapper.getTargetSql());
        
        Page<Videos> videoPage = videosService.page(new Page<>(page, size), queryWrapper);

        // 转换所有视频的URL为HTTP可访问路径
        for (Videos video : videoPage.getRecords()) {
            convertVideoUrls(video);
        }

        // 打印返回的结果数量，便于调试
        log.info("获取视频列表成功，共返回 {} 条记录", videoPage.getRecords().size());

        return ApiResponse.success(videoPage);
    }
    
    /**
     * 获取视频详情
     */
    @GetMapping("/{id}")
    public ApiResponse<Videos> getById(@PathVariable Integer id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Videos video = videosService.getById(id);
        if (video == null) {
            return ApiResponse.badRequest("视频不存在");
        }
        // 转换视频URL为HTTP可访问路径
        convertVideoUrls(video);
        // 公开视频直接返回
        if (!"internal".equals(video.getAccessType())) {
            return ApiResponse.success(video);
        }
        // 会员视频，校验token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ApiResponse.unauthorized("请先登录");
        }
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return ApiResponse.unauthorized("登录已过期，请重新登录");
        }
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Users user = usersService.getById(userId);
        // admin/super_admin 始终可访问；member 角色需检查会员是否未过期
        boolean hasAccess = userService.isValidMember(user);
        if (!hasAccess) {
            return ApiResponse.forbidden("仅会员可观看该视频，请先开通会员");
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
                // 保存为HTTP可访问的路径
                video.setVideoUrl("/uploads/videos/" + videoFileName);

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
                        // 保存为HTTP可访问的路径
                        video.setThumbnailUrl("/uploads/thumbnails/" + thumbnailFileName);
                    } catch (Exception e) {
                        log.warn("无法从视频生成缩略图", e);
                    }
                }
            }

            // 处理缩略图文件上传
            if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
                String thumbnailFileName = handleFileUpload(thumbnailFile, THUMBNAIL_UPLOAD_DIR);
                // 保存为HTTP可访问的路径
                video.setThumbnailUrl("/uploads/thumbnails/" + thumbnailFileName);
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
                        // 从URL中提取文件名
                        String oldFileName = video.getVideoUrl().substring(video.getVideoUrl().lastIndexOf("/") + 1);
                        Files.deleteIfExists(Paths.get(VIDEO_UPLOAD_DIR + oldFileName));
                    } catch (Exception e) {
                        log.warn("删除旧视频文件失败", e);
                    }
                }

                String videoFileName = handleFileUpload(videoFile, VIDEO_UPLOAD_DIR);
                // 保存为HTTP可访问的路径
                video.setVideoUrl("/uploads/videos/" + videoFileName);

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
                        // 从URL中提取文件名
                        String oldFileName = video.getThumbnailUrl().substring(video.getThumbnailUrl().lastIndexOf("/") + 1);
                        Files.deleteIfExists(Paths.get(THUMBNAIL_UPLOAD_DIR + oldFileName));
                    } catch (Exception e) {
                        log.warn("删除旧缩略图文件失败", e);
                    }
                }

                String thumbnailFileName = handleFileUpload(thumbnailFile, THUMBNAIL_UPLOAD_DIR);
                // 保存为HTTP可访问的路径
                video.setThumbnailUrl("/uploads/thumbnails/" + thumbnailFileName);
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
            if (video.getVideoUrl() != null && video.getVideoUrl().startsWith("/uploads/")) {
                try {
                    String fileName = video.getVideoUrl().substring(video.getVideoUrl().lastIndexOf("/") + 1);
                    Files.deleteIfExists(Paths.get(VIDEO_UPLOAD_DIR + fileName));
                } catch (Exception e) {
                    log.warn("删除视频文件失败", e);
                }
            }

            // 删除缩略图文件
            if (video.getThumbnailUrl() != null && video.getThumbnailUrl().startsWith("/uploads/")) {
                try {
                    String fileName = video.getThumbnailUrl().substring(video.getThumbnailUrl().lastIndexOf("/") + 1);
                    Files.deleteIfExists(Paths.get(THUMBNAIL_UPLOAD_DIR + fileName));
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
     * 记录视频观看（累加播放量）
     */
    @PostMapping("/{id}/view")
    public ApiResponse<Map<String, Object>> recordView(
            @PathVariable Integer id,
            @RequestBody(required = false) Map<String, Object> body,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        Videos video = videosService.getById(id);
        if (video == null) {
            return ApiResponse.badRequest("视频不存在");
        }

        Integer userId = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                userId = jwtUtil.getUserIdFromToken(token);
            }
        }

        Integer progress = 0;
        if (body != null && body.get("progress") != null) {
            progress = ((Number) body.get("progress")).intValue();
        }

        videosService.recordView(id, userId, progress);

        Videos updatedVideo = videosService.getById(id);
        Map<String, Object> result = new HashMap<>();
        result.put("views", updatedVideo != null ? updatedVideo.getViews() : 0);
        return ApiResponse.success(result);
    }

    /**
     * 获取视频观看信息
     */
    @GetMapping("/{id}/stats")
    public ApiResponse<Map<String, Object>> getStats(@PathVariable Integer id) {
        Videos video = videosService.getById(id);
        if (video == null) {
            return ApiResponse.badRequest("视频不存在");
        }

        QueryWrapper<WatchHistory> historyQuery = new QueryWrapper<>();
        historyQuery.eq("video_id", id);
        List<WatchHistory> histories = watchHistoryService.list(historyQuery);

        int totalRecords = histories.size();
        long completedCount = histories.stream()
                .filter(h -> Boolean.TRUE.equals(h.getCompleted()))
                .count();
        String completionRate = totalRecords > 0
                ? Math.round(completedCount * 100.0 / totalRecords) + "%"
                : "0%";

        long avgSeconds = 0;
        if (totalRecords > 0) {
            avgSeconds = histories.stream()
                    .mapToInt(h -> h.getProgress() != null ? h.getProgress() : 0)
                    .sum() / totalRecords;
        }
        String averageWatchTime = formatSeconds(avgSeconds);

        Map<String, Object> stats = new HashMap<>();
        stats.put("views", video.getViews() != null ? video.getViews() : 0);
        stats.put("averageWatchTime", averageWatchTime);
        stats.put("completionRate", completionRate);

        return ApiResponse.success(stats);
    }

    private String formatSeconds(long totalSeconds) {
        long minutes = totalSeconds / 60;
        long seconds = totalSeconds % 60;
        return String.format("%d:%02d", minutes, seconds);
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

    /**
     * 将视频和缩略图URL转换为HTTP可访问路径
     * 处理旧数据中保存的绝对路径或相对路径
     */
    private void convertVideoUrls(Videos video) {
        // 处理视频URL
        String videoUrl = video.getVideoUrl();
        if (videoUrl != null && !videoUrl.isEmpty()) {
            video.setVideoUrl(convertUrl(videoUrl, "videos"));
        }

        // 处理缩略图URL
        String thumbnailUrl = video.getThumbnailUrl();
        if (thumbnailUrl != null && !thumbnailUrl.isEmpty()) {
            video.setThumbnailUrl(convertUrl(thumbnailUrl, "thumbnails"));
        }
    }

    /**
     * 转换单个URL为HTTP可访问路径
     */
    private String convertUrl(String url, String defaultFolder) {
        if (url == null || url.isEmpty()) {
            return url;
        }

        // 已经是 /uploads/ 开头，直接返回
        if (url.startsWith("/uploads/")) {
            return url;
        }

        // 外部URL
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }

        // 替换反斜杠为正斜杠
        String normalizedUrl = url.replace("\\", "/");

        // 处理绝对路径（如 D:/xxx/uploads/thumbnails/xxx.png）
        if (normalizedUrl.contains(":") || normalizedUrl.startsWith("/")) {
            String fileName = extractFileName(normalizedUrl);
            if (fileName != null && !fileName.isEmpty()) {
                log.info("转换URL: {} -> /uploads/{}/{}", normalizedUrl, defaultFolder, fileName);
                return "/uploads/" + defaultFolder + "/" + fileName;
            }
        }

        // 包含 uploads/videos 或 uploads/thumbnails
        if (normalizedUrl.contains("uploads/videos") || normalizedUrl.contains("uploads/thumbnails")) {
            String fileName = extractFileName(normalizedUrl);
            if (fileName != null && !fileName.isEmpty()) {
                if (normalizedUrl.contains("videos")) {
                    return "/uploads/videos/" + fileName;
                } else {
                    return "/uploads/thumbnails/" + fileName;
                }
            }
        }

        // 其他情况，假设是文件名
        return "/uploads/" + defaultFolder + "/" + url;
    }

    /**
     * 从路径中提取文件名
     */
    private String extractFileName(String path) {
        if (path == null || path.isEmpty()) {
            return null;
        }

        // 替换反斜杠为正斜杠
        String normalizedPath = path.replace("\\", "/");

        // 找到最后一个斜杠
        int lastSlashIndex = normalizedPath.lastIndexOf('/');
        if (lastSlashIndex >= 0 && lastSlashIndex < normalizedPath.length() - 1) {
            return normalizedPath.substring(lastSlashIndex + 1);
        }

        return path;
    }

    @GetMapping("/secure/{id}")
    public ApiResponse<Videos> getByIdWithAuth(@PathVariable Integer id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Videos video = videosService.getById(id);
        if (video == null) {
            return ApiResponse.badRequest("视频不存在");
        }
        // 转换视频URL为HTTP可访问路径
        convertVideoUrls(video);
        // 公开视频直接返回
        if (!"internal".equals(video.getAccessType())) {
            return ApiResponse.success(video);
        }
        // 会员视频，校验token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ApiResponse.unauthorized("请先登录");
        }
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return ApiResponse.unauthorized("登录已过期，请重新登录");
        }
        Integer userId = jwtUtil.getUserIdFromToken(token);
        Users user = usersService.getById(userId);
        boolean hasAccess = userService.isValidMember(user);
        if (!hasAccess) {
            return ApiResponse.forbidden("仅会员可观看该视频，请先开通会员");
        }
        return ApiResponse.success(video);
    }
}

