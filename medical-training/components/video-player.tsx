'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  autoPlay?: boolean;
  className?: string;
  onError?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  allowDownload?: boolean;
}

export function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  autoPlay = false,
  className,
  onError,
  onPlay,
  onPause,
  allowDownload = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);
  
  // 格式化时间显示 (00:00)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 播放暂停切换
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play()
          .catch(error => {
            console.error('播放失败:', error);
            setHasError(true);
            toast({
              title: '播放失败',
              description: '无法播放视频，请检查URL或稍后重试',
              variant: 'destructive',
            });
            if (onError) onError();
          });
      }
    }
  };
  
  // 快进10秒
  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
    }
  };
  
  // 后退10秒
  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };
  
  // 音量控制
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };
  
  // 静音切换
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (isMuted) {
        // 取消静音时恢复之前的音量
        videoRef.current.volume = volume || 0.5;
      }
    }
  };
  
  // 全屏切换
  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(err => {
        toast({
          title: '全屏失败',
          description: `无法进入全屏: ${err.message}`,
          variant: 'destructive',
        });
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  // 处理视频播放状态变化
  const handlePlay = () => {
    setIsPlaying(true);
    if (onPlay) onPlay();
  };
  
  // 处理视频暂停状态变化
  const handlePause = () => {
    setIsPlaying(false);
    if (onPause) onPause();
  };
  
  // 处理视频时间更新
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  // 处理视频时长加载
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };
  
  // 处理视频加载错误
  const handleVideoError = () => {
    setHasError(true);
    setIsLoading(false);
    if (onError) onError();
    toast({
      title: '视频加载失败',
      description: '无法加载视频，请检查视频地址或网络连接',
      variant: 'destructive',
    });
  };
  
  // 处理进度条变化
  const handleProgressChange = (value: number[]) => {
    if (videoRef.current) {
      const newTime = (value[0] / 100) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // 控制栏自动隐藏
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
      
      if (isPlaying) {
        hideControlsTimer.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };
    
    const playerElement = playerRef.current;
    if (playerElement) {
      playerElement.addEventListener('mousemove', handleMouseMove);
      playerElement.addEventListener('mouseleave', () => {
        if (isPlaying) setShowControls(false);
      });
      playerElement.addEventListener('mouseenter', handleMouseMove);
    }
    
    return () => {
      if (playerElement) {
        playerElement.removeEventListener('mousemove', handleMouseMove);
        playerElement.removeEventListener('mouseleave', () => {
          if (isPlaying) setShowControls(false);
        });
        playerElement.removeEventListener('mouseenter', handleMouseMove);
      }
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
    };
  }, [isPlaying]);
  
  return (
    <div 
      ref={playerRef}
      className={cn(
        "relative overflow-hidden bg-black rounded-lg w-full", 
        className
      )}
    >
      {/* 视频元素 */}
      <video
        ref={videoRef}
        className="w-full h-full"
        poster={thumbnailUrl || "/placeholder.svg?height=720&width=1280"}
        autoPlay={autoPlay}
        playsInline
        onClick={togglePlay}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleVideoError}
        controlsList={allowDownload ? "" : "nodownload"}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        您的浏览器不支持视频播放
      </video>
      
      {/* 加载中状态 */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      
      {/* 错误状态 */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">视频加载失败</p>
          <p className="text-sm opacity-70 mt-2">请检查视频地址或网络连接</p>
          <Button 
            variant="outline" 
            className="mt-4 bg-white/10 hover:bg-white/20 text-white"
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
          >
            重试
          </Button>
        </div>
      )}
      
      {/* 播放器控制栏 */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 transition-opacity",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* 进度条 */}
        <div className="w-full mb-2">
          <Slider
            value={[duration ? (currentTime / duration) * 100 : 0]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={handleProgressChange}
            className="cursor-pointer"
          />
        </div>
        
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            {/* 播放/暂停按钮 */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            {/* 后退10秒 */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={skipBackward}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            {/* 前进10秒 */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={skipForward}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
            
            {/* 音量控制 */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost"
                size="icon" 
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <div className="hidden sm:block w-20">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>
            
            {/* 时间显示 */}
            <div className="text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* 全屏按钮 */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={toggleFullscreen}
            >
              <Maximize className="h-5 w-5" />
            </Button>
            
            {title && <span className="hidden md:inline text-sm font-medium truncate max-w-xs">{title}</span>}
          </div>
        </div>
      </div>
    </div>
  );
} 