package com.example.demo.service;

import java.util.List;
import java.util.Map;

public interface StatsService {
    
    /**
     * 获取每月会员注册数量趋势
     * @return 每月新会员数量列表
     */
    List<Map<String, Object>> getMonthlyMemberRegistrationTrend();
    
    /**
     * 获取每月视频观看统计（会员/非会员）
     * @return 每月观看统计列表
     */
    List<Map<String, Object>> getMonthlyVideoViewStats();
    
    /**
     * 获取视频类型分布
     * @return 各类别视频数量
     */
    List<Map<String, Object>> getVideoCategoryDistribution();
    
    /**
     * 获取热门视频排名
     * @param limit 返回数量限制
     * @return 热门视频列表
     */
    List<Map<String, Object>> getTopVideos(int limit);
    
    /**
     * 获取所有用户的总观看时间
     * @return 用户ID -> 总观看时间（秒）的映射
     */
    Map<Integer, Long> getAllUserWatchTime();
    
    /**
     * 获取所有视频的总播放时间
     * @return 视频ID -> 总播放时间（秒）的映射
     */
    Map<Integer, Long> getAllVideoPlayTime();
    
    /**
     * 获取总统计概览
     * @return 包含各种统计数据的Map
     */
    Map<String, Object> getOverviewStats();
}
