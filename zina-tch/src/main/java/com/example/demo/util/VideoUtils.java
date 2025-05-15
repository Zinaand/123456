package com.example.demo.util;

import lombok.extern.slf4j.Slf4j;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

/**
 * 视频处理工具类
 */
@Slf4j
public class VideoUtils {
    
    /**
     * 获取视频时长（秒）
     * 注意：实际项目中应使用ffmpeg或其他视频处理库，这里仅为示例
     */
    public static int getDuration(File videoFile) throws IOException {
        // 实际项目中应该使用类似以下代码调用ffmpeg:
        // ProcessBuilder pb = new ProcessBuilder("ffprobe", "-v", "error", "-show_entries",
        //         "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", videoFile.getAbsolutePath());
        // Process p = pb.start();
        // BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));
        // String line = br.readLine();
        // return (int)Math.round(Double.parseDouble(line));
        
        // 由于未集成真实的视频处理库，这里返回模拟时长
        // 根据文件大小模拟时长，实际应使用ffmpeg等库获取
        long fileSizeInBytes = videoFile.length();
        // 假设每MB约对应15秒视频（仅用于模拟）
        int durationInSeconds = (int)(fileSizeInBytes / (1024 * 1024) * 15);
        // 确保至少10秒
        return Math.max(durationInSeconds, 10);
    }
    
    /**
     * 从视频生成缩略图
     * 注意：实际项目中应使用ffmpeg或其他视频处理库，这里仅为示例
     */
    public static void generateThumbnail(File videoFile, File thumbnailFile) throws IOException {
        // 实际项目中应该使用类似以下代码调用ffmpeg:
        // ProcessBuilder pb = new ProcessBuilder("ffmpeg", "-i", videoFile.getAbsolutePath(),
        //         "-ss", "00:00:05", "-vframes", "1", thumbnailFile.getAbsolutePath());
        // pb.start().waitFor();
        
        // 由于未集成真实的视频处理库，这里创建一个简单的空白图片作为缩略图
        // 实际应使用ffmpeg等库从视频中提取图片
        BufferedImage img = new BufferedImage(1280, 720, BufferedImage.TYPE_INT_RGB);
        // 创建一个灰色背景
        for (int x = 0; x < img.getWidth(); x++) {
            for (int y = 0; y < img.getHeight(); y++) {
                img.setRGB(x, y, 0xAAAAAA);
            }
        }
        // 确保目录存在
        thumbnailFile.getParentFile().mkdirs();
        // 保存图片
        ImageIO.write(img, "jpg", thumbnailFile);
        
        log.info("为视频 {} 生成了缩略图 {}", videoFile.getName(), thumbnailFile.getName());
    }
} 