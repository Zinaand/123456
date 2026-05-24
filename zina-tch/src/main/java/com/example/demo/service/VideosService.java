package com.example.demo.service;

import com.example.demo.pojo.Videos;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * 视频表 服务类
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
public interface VideosService extends IService<Videos> {

    /**
     * 记录视频观看：累加播放量，登录用户同步更新观看历史
     */
    void recordView(Integer videoId, Integer userId, Integer progress);

    /**
     * 获取热门视频列表（按播放量降序）
     */
    java.util.List<Videos> getPopularVideos(int limit, String status);
}
