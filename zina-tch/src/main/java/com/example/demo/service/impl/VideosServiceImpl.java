package com.example.demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.example.demo.pojo.Videos;
import com.example.demo.pojo.WatchHistory;
import com.example.demo.mapper.VideosMapper;
import com.example.demo.service.VideosService;
import com.example.demo.service.WatchHistoryService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * <p>
 * 视频表 服务实现类
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@Service
public class VideosServiceImpl extends ServiceImpl<VideosMapper, Videos> implements VideosService {

    @Autowired
    private WatchHistoryService watchHistoryService;

    @Override
    public void recordView(Integer videoId, Integer userId, Integer progress) {
        UpdateWrapper<Videos> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", videoId).setSql("views = IFNULL(views, 0) + 1");
        this.update(updateWrapper);

        if (userId == null) {
            return;
        }

        int safeProgress = progress != null ? Math.max(progress, 0) : 0;
        Date now = new Date();

        QueryWrapper<WatchHistory> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId).eq("video_id", videoId);
        WatchHistory existing = watchHistoryService.getOne(queryWrapper);

        if (existing != null) {
            existing.setLastWatched(now);
            existing.setUpdatedAt(now);
            if (safeProgress > 0) {
                int currentProgress = existing.getProgress() != null ? existing.getProgress() : 0;
                existing.setProgress(Math.max(currentProgress, safeProgress));
            }
            watchHistoryService.updateById(existing);
            return;
        }

        WatchHistory history = new WatchHistory();
        history.setUserId(userId);
        history.setVideoId(videoId);
        history.setProgress(safeProgress);
        history.setCompleted(false);
        history.setLastWatched(now);
        history.setCreatedAt(now);
        history.setUpdatedAt(now);
        watchHistoryService.save(history);
    }

    @Override
    public List<Videos> getPopularVideos(int limit, String status) {
        QueryWrapper<Videos> queryWrapper = new QueryWrapper<>();
        if (status != null && !status.trim().isEmpty()) {
            queryWrapper.eq("status", status);
        }
        queryWrapper.orderByDesc("views")
                .last("LIMIT " + Math.min(Math.max(limit, 1), 50));
        return this.list(queryWrapper);
    }
}
