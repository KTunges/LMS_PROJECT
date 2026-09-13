import { useState, useRef, useEffect, useCallback } from 'react';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiMinimize, FiSettings, FiCheck } from 'react-icons/fi';
import './CustomVideoPlayer.css';
import InteractiveQuestionOverlay from './InteractiveQuestionOverlay';

// ─── Helper: extract YouTube video ID from any YT URL ───
const getYouTubeId = (url) => {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.substring(1).split('/')[0];
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
  } catch (e) { /* ignore */ }
  const match = url.match(/(?:youtube\.com\/(?:embed|v)\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// ─────────────────────────────────────────────────────────
// CustomVideoPlayer
// For YouTube URLs → uses YouTube IFrame Player API directly
// For other URLs   → falls back to <video> element
// ─────────────────────────────────────────────────────────
const CustomVideoPlayer = ({ url, onEnded, onProgress, interactiveQuestions = [] }) => {
  const ytId = getYouTubeId(url);

  // ── Shared state ──
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [maxWatched, setMaxWatched] = useState(0);

  const containerRef = useRef(null);
  const controlsTimer = useRef(null);
  const ytPlayerRef = useRef(null);
  const videoRef = useRef(null);
  const progressInterval = useRef(null);
  const iframeRef = useRef(null);

  // ── YouTube IFrame API loader ──
  useEffect(() => {
    if (currentTime > maxWatched) {
      setMaxWatched(currentTime);
    }
    
    // Calculate played ratio and emit
    if (duration > 0 && onProgress) {
      onProgress(currentTime / duration);
    }
  }, [currentTime]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!ytId) return;

    // Load the IFrame API script if not already present
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    const initPlayer = () => {
      if (ytPlayerRef.current) {
        ytPlayerRef.current.destroy();
      }
      ytPlayerRef.current = new window.YT.Player(iframeRef.current, {
        videoId: ytId,
        playerVars: {
          autoplay: 0,
          controls: 0,       // hide native YT controls
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3, // hide annotations
          disablekb: 1,      // we handle keyboard
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            setDuration(e.target.getDuration());
            e.target.setVolume(volume);
          },
          onStateChange: (e) => {
            const state = e.data;
            if (state === window.YT.PlayerState.PLAYING) {
              setPlaying(true);
              setDuration(e.target.getDuration());
              // start polling current time
              clearInterval(progressInterval.current);
              progressInterval.current = setInterval(() => {
                const t = e.target.getCurrentTime();
                setCurrentTime(t);
                setDuration(prev => prev > 0 ? prev : e.target.getDuration());
              }, 250);
            } else if (state === window.YT.PlayerState.PAUSED) {
              setPlaying(false);
              clearInterval(progressInterval.current);
            } else if (state === window.YT.PlayerState.ENDED) {
              setPlaying(false);
              clearInterval(progressInterval.current);
              if (onEnded) onEnded();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Wait for the API to load
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      clearInterval(progressInterval.current);
      if (ytPlayerRef.current) {
        try { ytPlayerRef.current.destroy(); } catch (e) { /* ignore */ }
      }
    };
  }, [ytId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Interactive Questions ──
  useEffect(() => {
    if (!interactiveQuestions.length || currentQuestion || !playing) return;
    const q = interactiveQuestions.find(
      (q) => currentTime >= q.video_timestamp && !answeredQuestions.has(q.id)
    );
    if (q) {
      handlePause();
      setCurrentQuestion(q);
    }
  }, [currentTime, playing]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCorrectAnswer = (questionId) => {
    setAnsweredQuestions((prev) => new Set([...prev, questionId]));
    setCurrentQuestion(null);
    handlePlay();
  };

  // ── Play / Pause ──
  const handlePlay = useCallback(() => {
    if (ytId && ytPlayerRef.current?.playVideo) {
      ytPlayerRef.current.playVideo();
    } else if (videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
    }
  }, [ytId]);

  const handlePause = useCallback(() => {
    if (ytId && ytPlayerRef.current?.pauseVideo) {
      ytPlayerRef.current.pauseVideo();
    } else if (videoRef.current) {
      videoRef.current.pause();
      setPlaying(false);
    }
  }, [ytId]);

  const handlePlayPause = () => {
    playing ? handlePause() : handlePlay();
  };

  // Seek is disabled based on user request

  // ── Volume ──
  const handleVolumeChange = (e) => {
    const v = parseInt(e.target.value, 10);
    setVolume(v);
    setMuted(v === 0);
    if (ytId && ytPlayerRef.current) {
      ytPlayerRef.current.setVolume(v);
      ytPlayerRef.current.unMute();
    } else if (videoRef.current) {
      videoRef.current.volume = v / 100;
      videoRef.current.muted = v === 0;
    }
  };

  const handleToggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    if (ytId && ytPlayerRef.current) {
      newMuted ? ytPlayerRef.current.mute() : ytPlayerRef.current.unMute();
    } else if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
  };

  // ── Playback Rate ──
  const handlePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    setShowSettings(false);
    if (ytId && ytPlayerRef.current?.setPlaybackRate) {
      ytPlayerRef.current.setPlaybackRate(rate);
    } else if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // ── Fullscreen ──
  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.() || containerRef.current.webkitRequestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // ── Controls auto-hide ──
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    if (playing && !currentQuestion) {
      controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  // ── Native <video> progress handler ──
  const handleNativeTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const played = duration > 0 ? currentTime / duration : 0;

  return (
    <div
      className="custom-player-wrapper"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && !currentQuestion && setShowControls(false)}
    >
      {/* ── Video Layer ── */}
      {ytId ? (
        <div className="yt-player-container">
          <div className="yt-player-inner">
            <div ref={iframeRef} />
          </div>
          {/* Shield: blocks hover so YT title/watermark never appear */}
          <div className="yt-shield" />
        </div>
      ) : (
        <video
          ref={videoRef}
          src={url}
          className="native-video"
          onTimeUpdate={handleNativeTimeUpdate}
          onEnded={onEnded}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        />
      )}

      {/* ── Click-to-play overlay (only when paused) ── */}
      {!playing && !currentQuestion && (
        <div className="player-overlay-center" onClick={handlePlayPause}>
          <div className="big-play-btn">
            <FiPlay size={36} color="white" style={{ marginLeft: '6px' }} />
          </div>
        </div>
      )}

      {/* ── Click area to toggle play/pause ── */}
      {playing && !currentQuestion && (
        <div
          className="player-click-area"
          onClick={handlePlayPause}
        />
      )}

      {/* ── Interactive Question Overlay ── */}
      {currentQuestion && (
        <InteractiveQuestionOverlay
          question={currentQuestion}
          onCorrectAnswer={handleCorrectAnswer}
        />
      )}

      {/* ── Custom Controls ── */}
      <div className={`player-controls ${showControls && !currentQuestion ? 'visible' : 'hidden'}`}>
        {/* Progress Bar */}
        <div className="player-progress-container">
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            readOnly
            className="player-progress-slider disabled-seek"
            style={{ backgroundSize: `${played * 100}% 100%` }}
          />
        </div>

        {/* Bottom Row */}
        <div className="player-controls-bottom">
          <div className="player-controls-left">
            <button onClick={handlePlayPause} className="control-btn">
              {playing ? <FiPause size={22} /> : <FiPlay size={22} />}
            </button>

            <div className="volume-container">
              <button onClick={handleToggleMute} className="control-btn">
                {muted || volume === 0 ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                style={{ backgroundSize: `${muted ? 0 : volume}% 100%` }}
              />
            </div>

            <span className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="player-controls-right">
            {/* Speed */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="control-btn speed-btn"
              >
                {playbackRate}x
              </button>
              {showSettings && (
                <div className="settings-menu">
                  <div className="settings-header">Tốc độ phát</div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <div
                      key={rate}
                      className={`settings-item ${playbackRate === rate ? 'active' : ''}`}
                      onClick={() => handlePlaybackRate(rate)}
                    >
                      {playbackRate === rate && <FiCheck size={14} />}
                      <span style={{ marginLeft: playbackRate === rate ? '8px' : '22px' }}>
                        {rate === 1 ? 'Chuẩn' : `${rate}x`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={toggleFullScreen} className="control-btn">
              {isFullscreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
