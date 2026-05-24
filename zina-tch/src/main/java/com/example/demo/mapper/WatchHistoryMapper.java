package com.example.demo.mapper;

import com.example.demo.pojo.WatchHistory;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * 视频观看记录表 Mapper 接口
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
public interface WatchHistoryMapper extends BaseMapper<WatchHistory> {

    @Select("SELECT DATE_FORMAT(wh.last_watched, '%Y-%m') AS month, " +
            "COUNT(*) AS total_views, " +
            "SUM(CASE WHEN u.membership_type IS NOT NULL AND u.membership_type <> 'NONE' AND u.membership_type <> '' THEN 1 ELSE 0 END) AS member_views, " +
            "SUM(CASE WHEN u.membership_type IS NULL OR u.membership_type = 'NONE' OR u.membership_type = '' THEN 1 ELSE 0 END) AS non_member_views " +
            "FROM watch_history wh " +
            "JOIN users u ON wh.user_id = u.id " +
            "WHERE wh.last_watched >= #{startDate} AND wh.last_watched IS NOT NULL " +
            "GROUP BY DATE_FORMAT(wh.last_watched, '%Y-%m') " +
            "ORDER BY month ASC")
    List<Map<String, Object>> selectMonthlyViewsByMembership(@Param("startDate") Date startDate);
}
