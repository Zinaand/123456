package com.example.demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.demo.mapper.*;
import com.example.demo.pojo.*;
import com.example.demo.service.StatsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatsServiceImpl implements StatsService {
    
    private static final Logger logger = LoggerFactory.getLogger(StatsServiceImpl.class);

    @Autowired
    private UsersMapper usersMapper;

    @Autowired
    private VideosMapper videosMapper;

    @Autowired
    private WatchHistoryMapper watchHistoryMapper;

    @Autowired
    private VideoCategoriesMapper videoCategoriesMapper;

    /**
     * 将 Number 类型安全转换为 int
     */
    private int toInt(Object obj) {
        if (obj == null) return 0;
        if (obj instanceof Number) {
            return ((Number) obj).intValue();
        }
        return 0;
    }

    /**
     * 将 Number 类型安全转换为 long
     */
    private long toLong(Object obj) {
        if (obj == null) return 0L;
        if (obj instanceof Number) {
            return ((Number) obj).longValue();
        }
        return 0L;
    }

    @Override
    public List<Map<String, Object>> getMonthlyMemberRegistrationTrend() {
        logger.info("开始获取月度会员注册趋势...");
        
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MONTH, -11);
        Date startDate = cal.getTime();
        logger.info("查询起始日期: {}", startDate);
        
        QueryWrapper<Users> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("DATE_FORMAT(register_date, '%Y-%m') as month", "COUNT(*) as count")
                .ge("register_date", startDate)
                .isNotNull("register_date")
                .groupBy("DATE_FORMAT(register_date, '%Y-%m')")
                .orderByAsc("month");
        
        logger.info("SQL: {}", queryWrapper.getSqlSegment());
        List<Map<String, Object>> result = usersMapper.selectMaps(queryWrapper);
        logger.info("查询到 {} 条月度注册记录", result.size());
        
        Map<String, Integer> monthCountMap = new HashMap<>();
        for (Map<String, Object> row : result) {
            String month = row.get("month") != null ? row.get("month").toString() : "unknown";
            int count = toInt(row.get("count"));
            monthCountMap.put(month, count);
            logger.debug("月份: {}, 数量: {}", month, count);
        }
        
        List<Map<String, Object>> trend = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
        SimpleDateFormat displaySdf = new SimpleDateFormat("M月");
        
        for (int i = 11; i >= 0; i--) {
            Calendar tempCal = Calendar.getInstance();
            tempCal.add(Calendar.MONTH, -i);
            String monthKey = sdf.format(tempCal.getTime());
            String displayName = displaySdf.format(tempCal.getTime());
            
            Map<String, Object> item = new HashMap<>();
            item.put("name", displayName);
            item.put("month", monthKey);
            item.put("新会员", monthCountMap.getOrDefault(monthKey, 0));
            trend.add(item);
        }
        
        return trend;
    }

    @Override
    public List<Map<String, Object>> getMonthlyVideoViewStats() {
        logger.info("开始获取月度视频观看统计...");
        
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MONTH, -11);
        Date startDate = cal.getTime();
        
        List<Map<String, Object>> result = watchHistoryMapper.selectMonthlyViewsByMembership(startDate);
        logger.info("查询到 {} 条月度观看记录", result.size());
        
        Map<String, Integer> monthTotalViews = new HashMap<>();
        Map<String, Integer> monthMemberViews = new HashMap<>();
        Map<String, Integer> monthNonMemberViews = new HashMap<>();
        for (Map<String, Object> row : result) {
            String month = row.get("month") != null ? row.get("month").toString() : "unknown";
            monthTotalViews.put(month, toInt(row.get("total_views")));
            monthMemberViews.put(month, toInt(row.get("member_views")));
            monthNonMemberViews.put(month, toInt(row.get("non_member_views")));
        }
        
        List<Map<String, Object>> stats = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
        SimpleDateFormat displaySdf = new SimpleDateFormat("M月");
        
        for (int i = 11; i >= 0; i--) {
            Calendar tempCal = Calendar.getInstance();
            tempCal.add(Calendar.MONTH, -i);
            String monthKey = sdf.format(tempCal.getTime());
            String displayName = displaySdf.format(tempCal.getTime());
            
            Map<String, Object> item = new HashMap<>();
            item.put("name", displayName);
            item.put("month", monthKey);
            item.put("总观看次数", monthTotalViews.getOrDefault(monthKey, 0));
            item.put("会员观看", monthMemberViews.getOrDefault(monthKey, 0));
            item.put("非会员观看", monthNonMemberViews.getOrDefault(monthKey, 0));
            stats.add(item);
        }
        
        return stats;
    }

    @Override
    public List<Map<String, Object>> getVideoCategoryDistribution() {
        logger.info("开始获取视频类型分布...");
        
        QueryWrapper<Videos> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("category_id", "COUNT(*) as count")
                .isNotNull("category_id")
                .groupBy("category_id")
                .orderByDesc("count");
        
        logger.info("SQL: {}", queryWrapper.getSqlSegment());
        List<Map<String, Object>> result = videosMapper.selectMaps(queryWrapper);
        logger.info("查询到 {} 个分类", result.size());
        
        List<VideoCategories> categories = videoCategoriesMapper.selectList(null);
        logger.info("共有 {} 个分类定义", categories.size());
        
        Map<Integer, String> categoryNameMap = categories.stream()
                .collect(Collectors.toMap(VideoCategories::getId, VideoCategories::getName));
        
        List<Map<String, Object>> distribution = new ArrayList<>();
        int totalCount = result.stream()
                .mapToInt(r -> toInt(r.get("count")))
                .sum();
        
        for (Map<String, Object> row : result) {
            Integer categoryId = (Integer) row.get("category_id");
            int count = toInt(row.get("count"));
            
            Map<String, Object> item = new HashMap<>();
            item.put("name", categoryNameMap.getOrDefault(categoryId, "其他"));
            item.put("value", count);
            item.put("categoryId", categoryId);
            if (totalCount > 0) {
                item.put("percentage", Math.round((double) count / totalCount * 100));
            } else {
                item.put("percentage", 0);
            }
            distribution.add(item);
        }
        
        return distribution;
    }

    @Override
    public List<Map<String, Object>> getTopVideos(int limit) {
        logger.info("开始获取热门视频排名...");
        
        QueryWrapper<Videos> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("id", "title", "views", "thumbnail_url", "category_id")
                .eq("status", "published")
                .orderByDesc("views")
                .last("LIMIT " + limit);
        
        List<Videos> videos = videosMapper.selectList(queryWrapper);
        logger.info("查询到 {} 个视频", videos.size());
        
        List<VideoCategories> categories = videoCategoriesMapper.selectList(null);
        Map<Integer, String> categoryNameMap = categories.stream()
                .collect(Collectors.toMap(VideoCategories::getId, VideoCategories::getName));
        
        return videos.stream().map(video -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", video.getId());
            item.put("name", video.getTitle());
            item.put("views", video.getViews() != null ? video.getViews() : 0);
            item.put("thumbnailUrl", video.getThumbnailUrl());
            item.put("categoryName", categoryNameMap.getOrDefault(video.getCategoryId(), "未分类"));
            return item;
        }).collect(Collectors.toList());
    }

    @Override
    public Map<Integer, Long> getAllUserWatchTime() {
        logger.info("开始获取用户观看时间...");
        
        QueryWrapper<WatchHistory> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("user_id", "SUM(progress) as total_progress")
                .isNotNull("progress")
                .groupBy("user_id");
        
        logger.info("SQL: {}", queryWrapper.getSqlSegment());
        List<Map<String, Object>> result = watchHistoryMapper.selectMaps(queryWrapper);
        logger.info("查询到 {} 个用户的观看记录", result.size());
        
        Map<Integer, Long> userWatchTimeMap = new HashMap<>();
        for (Map<String, Object> row : result) {
            Integer userId = (Integer) row.get("user_id");
            long totalProgress = toLong(row.get("total_progress"));
            userWatchTimeMap.put(userId, totalProgress);
        }
        
        return userWatchTimeMap;
    }

    @Override
    public Map<Integer, Long> getAllVideoPlayTime() {
        logger.info("开始获取视频播放时间...");
        
        QueryWrapper<WatchHistory> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("video_id", "SUM(progress) as total_progress")
                .isNotNull("progress")
                .groupBy("video_id");
        
        logger.info("SQL: {}", queryWrapper.getSqlSegment());
        List<Map<String, Object>> result = watchHistoryMapper.selectMaps(queryWrapper);
        logger.info("查询到 {} 个视频的播放记录", result.size());
        
        Map<Integer, Long> videoPlayTimeMap = new HashMap<>();
        for (Map<String, Object> row : result) {
            Integer videoId = (Integer) row.get("video_id");
            long totalProgress = toLong(row.get("total_progress"));
            videoPlayTimeMap.put(videoId, totalProgress);
        }
        
        return videoPlayTimeMap;
    }

    @Override
    public Map<String, Object> getOverviewStats() {
        logger.info("开始获取总览统计数据...");
        Map<String, Object> stats = new HashMap<>();
        
        // 总用户数
        Integer totalUsers = usersMapper.selectCount(null);
        logger.info("总用户数: {}", totalUsers);
        stats.put("totalUsers", totalUsers != null ? totalUsers.longValue() : 0L);
        
        // 总会员数
        QueryWrapper<Users> memberQuery = new QueryWrapper<>();
        memberQuery.isNotNull("membership_type")
                .ne("membership_type", "NONE")
                .ne("membership_type", "");
        Integer totalMembers = usersMapper.selectCount(memberQuery);
        logger.info("SQL会员查询: {}", memberQuery.getSqlSegment());
        logger.info("总会员数: {}", totalMembers);
        stats.put("totalMembers", totalMembers != null ? totalMembers.longValue() : 0L);
        
        // 总视频数
        Integer totalVideos = videosMapper.selectCount(null);
        logger.info("总视频数: {}", totalVideos);
        stats.put("totalVideos", totalVideos != null ? totalVideos.longValue() : 0L);
        
        // 总播放量（各视频 views 字段之和）
        QueryWrapper<Videos> viewsSumQuery = new QueryWrapper<>();
        viewsSumQuery.select("IFNULL(SUM(views), 0) as total_views");
        List<Map<String, Object>> viewsSumResult = videosMapper.selectMaps(viewsSumQuery);
        long totalViews = 0L;
        if (!viewsSumResult.isEmpty() && viewsSumResult.get(0) != null) {
            totalViews = toLong(viewsSumResult.get(0).get("total_views"));
        }
        logger.info("总播放量: {}", totalViews);
        stats.put("totalViews", totalViews);
        
        // 今日新增用户
        Calendar today = Calendar.getInstance();
        today.set(Calendar.HOUR_OF_DAY, 0);
        today.set(Calendar.MINUTE, 0);
        today.set(Calendar.SECOND, 0);
        today.set(Calendar.MILLISECOND, 0);
        
        QueryWrapper<Users> todayUsersQuery = new QueryWrapper<>();
        todayUsersQuery.ge("register_date", today.getTime());
        Integer todayUsers = usersMapper.selectCount(todayUsersQuery);
        logger.info("今日新增用户: {}", todayUsers);
        stats.put("todayUsers", todayUsers != null ? todayUsers.longValue() : 0L);
        
        // 本月新增用户
        Calendar monthStart = Calendar.getInstance();
        monthStart.set(Calendar.DAY_OF_MONTH, 1);
        monthStart.set(Calendar.HOUR_OF_DAY, 0);
        monthStart.set(Calendar.MINUTE, 0);
        monthStart.set(Calendar.SECOND, 0);
        monthStart.set(Calendar.MILLISECOND, 0);
        
        QueryWrapper<Users> monthUsersQuery = new QueryWrapper<>();
        monthUsersQuery.ge("register_date", monthStart.getTime());
        Integer monthUsers = usersMapper.selectCount(monthUsersQuery);
        logger.info("本月新增用户: {}", monthUsers);
        stats.put("monthUsers", monthUsers != null ? monthUsers.longValue() : 0L);
        
        return stats;
    }
}
