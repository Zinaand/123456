package com.example.demo.controller;

import com.example.demo.service.VideoHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/stats")
public class drdController {

    private static final Logger logger = LoggerFactory.getLogger(drdController.class);

    @Autowired
    private VideoHistoryService videoHistoryService;

    @GetMapping("/user-watch-time")
    public ResponseEntity<Map<Integer, Long>> getAllUserWatchTime() {
        logger.info("接收到获取所有用户观看时间的请求");
        try {
            Map<Integer, Long> stats = videoHistoryService.getUserTotalWatchTime();
            logger.info("成功获取用户观看时间数据，返回 {} 条记录", stats.size());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("获取用户观看时间时发生错误", e);
            throw e;
        }
    }

    @GetMapping("/video-play-time")
    public ResponseEntity<Map<Integer, Long>> getAllVideoPlayTime() {
        logger.info("接收到获取所有视频播放时间的请求");
        try {
            Map<Integer, Long> stats = videoHistoryService.getVideoTotalPlayTime();
            logger.info("成功获取视频播放时间数据，返回 {} 条记录", stats.size());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("获取视频播放时间时发生错误", e);
            throw e;
        }
    }

    @GetMapping("/user/{userId}/watch-time")
    public ResponseEntity<Long> getUserWatchTime(@PathVariable int userId) {
        logger.info("接收到获取用户ID={}观看时间的请求", userId);
        try {
            Long watchTime = videoHistoryService.getUserWatchTime(userId);
            logger.info("用户ID={} 的观看时间为 {}", userId, watchTime);
            return ResponseEntity.ok(watchTime);
        } catch (Exception e) {
            logger.error("获取用户ID={}观看时间时发生错误", userId, e);
            throw e;
        }
    }

    @GetMapping("/video/{videoId}/play-time")
    public ResponseEntity<Long> getVideoPlayTime(@PathVariable int videoId) {
        logger.info("接收到获取视频ID={}播放时间的请求", videoId);
        try {
            Long playTime = videoHistoryService.getVideoPlayTime(videoId);
            logger.info("视频ID={} 的播放时间为 {}", videoId, playTime);
            return ResponseEntity.ok(playTime);
        } catch (Exception e) {
            logger.error("获取视频ID={}播放时间时发生错误", videoId, e);
            throw e;
        }
    }
}