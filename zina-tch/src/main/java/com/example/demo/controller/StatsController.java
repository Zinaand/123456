package com.example.demo.controller;

import com.example.demo.common.ApiResponse;
import com.example.demo.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class StatsController {

    @Autowired
    private StatsService statsService;

    /**
     * 获取总览统计数据
     */
    @GetMapping("/overview")
    public ApiResponse<Map<String, Object>> getOverview() {
        try {
            Map<String, Object> stats = statsService.getOverviewStats();
            return ApiResponse.success(stats);
        } catch (Exception e) {
            return ApiResponse.badRequest("获取统计数据失败: " + e.getMessage());
        }
    }

    /**
     * 获取每月会员注册趋势
     */
    @GetMapping("/monthly-registration")
    public ApiResponse<List<Map<String, Object>>> getMonthlyRegistrationTrend() {
        try {
            List<Map<String, Object>> trend = statsService.getMonthlyMemberRegistrationTrend();
            return ApiResponse.success(trend);
        } catch (Exception e) {
            return ApiResponse.badRequest("获取会员注册趋势失败: " + e.getMessage());
        }
    }

    /**
     * 获取每月视频观看统计
     */
    @GetMapping("/monthly-views")
    public ApiResponse<List<Map<String, Object>>> getMonthlyVideoViewStats() {
        try {
            List<Map<String, Object>> stats = statsService.getMonthlyVideoViewStats();
            return ApiResponse.success(stats);
        } catch (Exception e) {
            return ApiResponse.badRequest("获取视频观看统计失败: " + e.getMessage());
        }
    }

    /**
     * 获取视频类型分布
     */
    @GetMapping("/category-distribution")
    public ApiResponse<List<Map<String, Object>>> getCategoryDistribution() {
        try {
            List<Map<String, Object>> distribution = statsService.getVideoCategoryDistribution();
            return ApiResponse.success(distribution);
        } catch (Exception e) {
            return ApiResponse.badRequest("获取视频类型分布失败: " + e.getMessage());
        }
    }

    /**
     * 获取热门视频排名
     */
    @GetMapping("/top-videos")
    public ApiResponse<List<Map<String, Object>>> getTopVideos(
            @RequestParam(value = "limit", defaultValue = "10") int limit) {
        try {
            List<Map<String, Object>> topVideos = statsService.getTopVideos(limit);
            return ApiResponse.success(topVideos);
        } catch (Exception e) {
            return ApiResponse.badRequest("获取热门视频失败: " + e.getMessage());
        }
    }

    /**
     * 获取所有用户的观看时间
     */
    @GetMapping("/user-watch-time")
    public ApiResponse<Map<Integer, Long>> getAllUserWatchTime() {
        try {
            Map<Integer, Long> userWatchTime = statsService.getAllUserWatchTime();
            return ApiResponse.success(userWatchTime);
        } catch (Exception e) {
            return ApiResponse.badRequest("获取用户观看时间失败: " + e.getMessage());
        }
    }

    /**
     * 获取特定用户的观看时间
     */
    @GetMapping("/user/{userId}/watch-time")
    public ApiResponse<Long> getUserWatchTime(@PathVariable Integer userId) {
        try {
            Map<Integer, Long> userWatchTime = statsService.getAllUserWatchTime();
            Long totalTime = userWatchTime.getOrDefault(userId, 0L);
            return ApiResponse.success(totalTime);
        } catch (Exception e) {
            return ApiResponse.badRequest("获取用户观看时间失败: " + e.getMessage());
        }
    }

    /**
     * 获取所有视频的播放时间
     */
    @GetMapping("/video-play-time")
    public ApiResponse<Map<Integer, Long>> getAllVideoPlayTime() {
        try {
            Map<Integer, Long> videoPlayTime = statsService.getAllVideoPlayTime();
            return ApiResponse.success(videoPlayTime);
        } catch (Exception e) {
            return ApiResponse.badRequest("获取视频播放时间失败: " + e.getMessage());
        }
    }

    /**
     * 获取特定视频的播放时间
     */
    @GetMapping("/video/{videoId}/play-time")
    public ApiResponse<Long> getVideoPlayTime(@PathVariable Integer videoId) {
        try {
            Map<Integer, Long> videoPlayTime = statsService.getAllVideoPlayTime();
            Long totalTime = videoPlayTime.getOrDefault(videoId, 0L);
            return ApiResponse.success(totalTime);
        } catch (Exception e) {
            return ApiResponse.badRequest("获取视频播放时间失败: " + e.getMessage());
        }
    }

    /**
     * 获取完整统计数据（所有图表数据）
     */
    @GetMapping("/full")
    public ApiResponse<Map<String, Object>> getFullStats(
            @RequestParam(value = "topVideosLimit", defaultValue = "10") int topVideosLimit) {
        try {
            Map<String, Object> fullStats = new HashMap<>();
            
            // 总览数据
            fullStats.put("overview", statsService.getOverviewStats());
            
            // 月度趋势数据
            fullStats.put("monthlyRegistration", statsService.getMonthlyMemberRegistrationTrend());
            fullStats.put("monthlyViews", statsService.getMonthlyVideoViewStats());
            
            // 分布数据
            fullStats.put("categoryDistribution", statsService.getVideoCategoryDistribution());
            fullStats.put("topVideos", statsService.getTopVideos(topVideosLimit));
            
            // 观看时间数据
            fullStats.put("userWatchTime", statsService.getAllUserWatchTime());
            fullStats.put("videoPlayTime", statsService.getAllVideoPlayTime());
            
            return ApiResponse.success(fullStats);
        } catch (Exception e) {
            return ApiResponse.badRequest("获取完整统计数据失败: " + e.getMessage());
        }
    }
}
