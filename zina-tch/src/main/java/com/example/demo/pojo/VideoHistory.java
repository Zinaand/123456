package com.example.demo.pojo;

import javax.persistence.*;

@Entity
@Table(name = "watch_history")
public class VideoHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "video_id")
    private int videoId;

    @Column(name = "progress")
    private int progress;
    
    @Column(name = "completed")
    private boolean completed;
    
    // 其他数据库中的字段也可以添加，如 last_watched, created_at, updated_at 等

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getVideoId() {
        return videoId;
    }

    public void setVideoId(int videoId) {
        this.videoId = videoId;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }
    
    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
    
    @Override
    public String toString() {
        return "VideoHistory{" +
                "id=" + id +
                ", userId=" + userId +
                ", videoId=" + videoId +
                ", progress=" + progress +
                ", completed=" + completed +
                '}';
    }
}