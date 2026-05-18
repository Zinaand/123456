package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    // 获取项目运行目录
    private static final String UPLOAD_BASE_DIR = System.getProperty("user.dir") + "/uploads";

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // CORS 配置已移至 SecurityConfig，这里只配置静态资源
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置静态资源映射，让 /uploads/** 请求映射到实际的文件夹
        String videoPath = "file:" + UPLOAD_BASE_DIR + "/videos/";
        String thumbnailPath = "file:" + UPLOAD_BASE_DIR + "/thumbnails/";

        registry.addResourceHandler("/uploads/videos/**")
                .addResourceLocations(videoPath)
                .setCachePeriod(3600);

        registry.addResourceHandler("/uploads/thumbnails/**")
                .addResourceLocations(thumbnailPath)
                .setCachePeriod(3600);

        // 保留原有的 /videos/** 映射（兼容旧代码）
        registry.addResourceHandler("/videos/**")
                .addResourceLocations(videoPath)
                .setCachePeriod(3600);
    }
}