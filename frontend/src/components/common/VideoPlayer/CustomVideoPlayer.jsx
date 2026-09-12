import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiSettings, FiCheck } from 'react-icons/fi';
import './CustomVideoPlayer.css';

const CustomVideoPlayer = ({ url, onEnded, onProgress }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
    setMuted(e.target.value === '0');
  };

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  const handleProgress = (state) => {
    setPlayed(state.played);
    if (onProgress) {
      onProgress(state);
    }
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e) => {
    playerRef.current.seekTo(parseFloat(e.target.value));
  };

  const handlePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) {
        setShowControls(false);
        setShowSettings(false);
      }
    }, 2500);
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const duration = playerRef.current ? playerRef.current.getDuration() : 0;
  const currentTime = duration * played;

  return (
    <div 
      className="custom-player-wrapper" 
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        className="react-player"
        url={url}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        playbackRate={playbackRate}
        onProgress={handleProgress}
        onEnded={onEnded}
        onClick={handlePlayPause}
      />
      
      {/* Big Play Button Overlay when paused */}
      {!playing && (
        <div className="player-overlay-center" onClick={handlePlayPause}>
          <div className="big-play-btn">
            <FiPlay size={36} color="white" style={{ marginLeft: '6px' }} />
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`player-controls ${showControls ? 'visible' : 'hidden'}`}>
        
        {/* Progress Bar */}
        <div className="player-progress-container">
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onMouseDown={() => setPlaying(false)}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            className="player-progress-slider"
            style={{ backgroundSize: `${played * 100}% 100%` }}
          />
        </div>

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
                max={1}
                step="any"
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                style={{ backgroundSize: `${(muted ? 0 : volume) * 100}% 100%` }}
              />
            </div>

            <div className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="player-controls-right">
            <div style={{ position: 'relative' }}>
              <button 
                className="control-btn speed-btn" 
                onClick={() => setShowSettings(!showSettings)}
              >
                {playbackRate}x
              </button>
              
              {showSettings && (
                <div className="settings-menu">
                  <div className="settings-header">Tốc độ phát</div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
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
              <FiMaximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
