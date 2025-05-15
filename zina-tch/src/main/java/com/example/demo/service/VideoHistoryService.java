package com.example.demo.service;


import com.example.demo.repository.VideoHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class VideoHistoryService {

    private static final Logger logger = LoggerFactory.getLogger(VideoHistoryService.class);

    @Autowired
    private VideoHistoryRepository videoHistoryRepository;

    /**
     * 获取所有用户的总观看时间统计
     * @return Map<用户ID, 总观看时间>
     */
    public Map<Integer, Long> getUserTotalWatchTime() {
        logger.info("开始获取所有用户的总观看时间");
        List<Object[]> results = videoHistoryRepository.findTotalWatchTimePerUser();
        logger.info("查询结果: {}", results);
        
        Map<Integer, Long> userWatchTimeMap = new HashMap<>();

        // 检查结果是否为空
        if (results != null && !results.isEmpty()) {
            logger.info("查询返回了 {} 条记录", results.size());
            
            for (Object[] result : results) {
                if (result != null && result.length >= 2 && result[0] != null && result[1] != null) {
                    Integer userId = (Integer) result[0];
                    Long totalWatchTime = ((Number) result[1]).longValue(); // 处理不同的数字类型
                    logger.debug("用户ID: {}, 观看时间: {}", userId, totalWatchTime);
                    userWatchTimeMap.put(userId, totalWatchTime);
                } else {
                    logger.warn("跳过无效的记录: {}", result);
                }
            }
        } else {
            logger.warn("未找到用户观看时间记录");
        }

        logger.info("返回用户观看时间映射，包含 {} 个用户", userWatchTimeMap.size());
        return userWatchTimeMap;
    }

    /**
     * 获取所有视频的总播放时间统计
     * @return Map<视频ID, 总播放时间>
     */
    public Map<Integer, Long> getVideoTotalPlayTime() {
        logger.info("开始获取所有视频的总播放时间");
        List<Object[]> results = videoHistoryRepository.findTotalPlayTimePerVideo();
        logger.info("查询结果: {}", results);
        
        Map<Integer, Long> videoPlayTimeMap = new HashMap<>();

        // 检查结果是否为空
        if (results != null && !results.isEmpty()) {
            logger.info("查询返回了 {} 条记录", results.size());
            
            for (Object[] result : results) {
                if (result != null && result.length >= 2 && result[0] != null && result[1] != null) {
                    Integer videoId = (Integer) result[0];
                    Long totalPlayTime = ((Number) result[1]).longValue(); // 处理不同的数字类型
                    logger.debug("视频ID: {}, 播放时间: {}", videoId, totalPlayTime);
                    videoPlayTimeMap.put(videoId, totalPlayTime);
                } else {
                    logger.warn("跳过无效的记录: {}", result);
                }
            }
        } else {
            logger.warn("未找到视频播放时间记录");
        }

        logger.info("返回视频播放时间映射，包含 {} 个视频", videoPlayTimeMap.size());
        return videoPlayTimeMap;
    }

    /**
     * 获取特定用户的总观看时间
     * @param userId 用户ID
     * @return 总观看时间，如果没有记录则返回0
     */
    public Long getUserWatchTime(int userId) {
        Map<Integer, Long> allUserWatchTime = getUserTotalWatchTime();
        return allUserWatchTime.getOrDefault(userId, 0L);
    }

    /**
     * 获取特定视频的总播放时间
     * @param videoId 视频ID
     * @return 总播放时间，如果没有记录则返回0
     */
    public Long getVideoPlayTime(int videoId) {
        Map<Integer, Long> allVideoPlayTime = getVideoTotalPlayTime();
        return allVideoPlayTime.getOrDefault(videoId, 0L);
    }
}