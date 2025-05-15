package com.example.demo.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.TimeZone;

/**
 * Jackson全局配置
 */
@Configuration
public class JacksonConfig {
    
    /**
     * 自定义BigDecimal反序列化器
     */
    public static class BigDecimalDeserializer extends JsonDeserializer<BigDecimal> {
        @Override
        public BigDecimal deserialize(JsonParser jp, DeserializationContext ctxt) 
                throws IOException, JsonProcessingException {
            String value = jp.getValueAsString();
            if (value == null || value.isEmpty()) {
                return null;
            }
            try {
                return new BigDecimal(value);
            } catch (NumberFormatException e) {
                throw new IOException("Failed to parse BigDecimal value: " + value, e);
            }
        }
    }
    
    @Bean("customObjectMapper")
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        ObjectMapper objectMapper = builder.createXmlMapper(false).build();
        
        // 设置时区
        objectMapper.setTimeZone(TimeZone.getTimeZone("GMT+8"));
        // 设置日期格式
        objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
        
        // 忽略未知属性
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        
        // 添加Java 8时间模块
        objectMapper.registerModule(new JavaTimeModule());
        
        // 创建自定义模块
        SimpleModule simpleModule = new SimpleModule();
        
        // 添加BigDecimal的字符串序列化配置
        // 这样会将BigDecimal转换为字符串输出，避免前端精度丢失
        simpleModule.addSerializer(BigDecimal.class, ToStringSerializer.instance);
        
        // 添加BigDecimal的反序列化配置
        // 允许从String转换为BigDecimal
        objectMapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
        objectMapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
        objectMapper.configure(DeserializationFeature.USE_BIG_DECIMAL_FOR_FLOATS, true);
        
        // 添加自定义的BigDecimal反序列化器
        simpleModule.addDeserializer(BigDecimal.class, new BigDecimalDeserializer());
        
        // 注册模块
        objectMapper.registerModule(simpleModule);
        
        return objectMapper;
    }
} 