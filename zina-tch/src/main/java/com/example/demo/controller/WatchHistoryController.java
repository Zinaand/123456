package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.demo.common.ApiResponse;
import com.example.demo.pojo.WatchHistory;
import com.example.demo.service.VideosService;
import com.example.demo.service.WatchHistoryService;
import com.example.demo.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 视频观看记录控制器
 */
@RestController
@RequestMapping("/api/watch-history")
@RequiredArgsConstructor
public class WatchHistoryController {

    private final WatchHistoryService watchHistoryService;
    private final VideosService videosService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ApiResponse<List<WatchHistory>> getHistory(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Integer userId = resolveUserId(authHeader);
        if (userId == null) {
            return ApiResponse.unauthorized("请先登录");
        }

        QueryWrapper<WatchHistory> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId).orderByDesc("last_watched");
        return ApiResponse.success(watchHistoryService.list(queryWrapper));
    }

    @PostMapping
    public ApiResponse<Map<String, Object>> addToHistory(
            @RequestBody Map<String, Object> body,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (body == null || body.get("videoId") == null) {
            return ApiResponse.badRequest("缺少 videoId 参数");
        }

        Integer videoId = ((Number) body.get("videoId")).intValue();
        Integer progress = body.get("progress") != null ? ((Number) body.get("progress")).intValue() : 0;
        Integer userId = resolveUserId(authHeader);

        videosService.recordView(videoId, userId, progress);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        return ApiResponse.success(result);
    }

    @DeleteMapping
    public ApiResponse<Boolean> clearHistory(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Integer userId = resolveUserId(authHeader);
        if (userId == null) {
            return ApiResponse.unauthorized("请先登录");
        }

        QueryWrapper<WatchHistory> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        return ApiResponse.success(watchHistoryService.remove(queryWrapper));
    }

    private Integer resolveUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return null;
        }
        return jwtUtil.getUserIdFromToken(token);
    }
}
