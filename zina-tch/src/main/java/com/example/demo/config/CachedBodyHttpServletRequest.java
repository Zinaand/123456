package com.example.demo.config;

import org.springframework.util.StreamUtils;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.*;

/**
 * 缓存请求体的HttpServletRequest包装类
 * 使请求体可以多次读取
 */
public class CachedBodyHttpServletRequest extends HttpServletRequestWrapper {
    
    private byte[] cachedBody;
    
    public CachedBodyHttpServletRequest(HttpServletRequest request) throws IOException {
        super(request);
        // 缓存请求体
        InputStream requestInputStream = request.getInputStream();
        this.cachedBody = StreamUtils.copyToByteArray(requestInputStream);
    }
    
    @Override
    public ServletInputStream getInputStream() throws IOException {
        return new CachedBodyServletInputStream(this.cachedBody);
    }
    
    @Override
    public BufferedReader getReader() throws IOException {
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(this.cachedBody);
        return new BufferedReader(new InputStreamReader(byteArrayInputStream));
    }
    
    /**
     * 缓存请求体的ServletInputStream实现
     */
    private static class CachedBodyServletInputStream extends ServletInputStream {
        
        private final ByteArrayInputStream byteArrayInputStream;
        
        public CachedBodyServletInputStream(byte[] cachedBody) {
            this.byteArrayInputStream = new ByteArrayInputStream(cachedBody);
        }
        
        @Override
        public int read() throws IOException {
            return byteArrayInputStream.read();
        }
        
        @Override
        public boolean isFinished() {
            return byteArrayInputStream.available() == 0;
        }
        
        @Override
        public boolean isReady() {
            return true;
        }
        
        @Override
        public void setReadListener(javax.servlet.ReadListener readListener) {
            throw new UnsupportedOperationException("setReadListener is not supported");
        }
    }
} 