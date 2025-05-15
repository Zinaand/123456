package com.example.demo.repository;

import com.example.demo.pojo.VideoHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VideoHistoryRepository extends JpaRepository<VideoHistory, Integer> {

    // 查询每个用户的总观看时间
    @Query(value = "SELECT user_id, SUM(progress) as total_watch_time FROM watch_history GROUP BY user_id", nativeQuery = true)
    List<Object[]> findTotalWatchTimePerUser();

    // 查询每个视频的总播放时间
    @Query(value = "SELECT video_id, SUM(progress) as total_play_time FROM watch_history GROUP BY video_id", nativeQuery = true)
    List<Object[]> findTotalPlayTimePerVideo();
}