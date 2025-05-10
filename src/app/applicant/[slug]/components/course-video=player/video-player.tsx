"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, SkipForward, Volume2, VolumeX, Settings, RotateCcw, RotateCw } from 'lucide-react'

interface VideoPlayerProps {
    videoUrl: string
    title?: string
    initialTime?: number
    onTimeUpdate?: (time: number) => void
    onEnded?: () => void
    onNext?: () => void
}
export function formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const paddedMins = mins.toString().padStart(2, '0');
    const paddedSecs = secs.toString().padStart(2, '0');

    if (hrs > 0) {
        return `${hrs.toString().padStart(2, '0')}:${paddedMins}:${paddedSecs}`;
    } else {
        return `${paddedMins}:${paddedSecs}`;
    }
}
const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoUrl,
    title = "",
    initialTime = 0,
    onTimeUpdate,
    onEnded,
    onNext,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(initialTime)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const [isBuffering, setIsBuffering] = useState(false)
    const [playbackRate, setPlaybackRate] = useState(1)
    const [showSettings, setShowSettings] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [videoEnded, setVideoEnded] = useState(false)
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const hasEndedRef = useRef(false)

    // Reset state when video URL changes
    useEffect(() => {
        setVideoEnded(false)
        hasEndedRef.current = false

        if (videoRef.current) {
            setDuration(0)
            setCurrentTime(initialTime)
        }
    }, [videoUrl, initialTime])

    // Set initial time when video loads
    useEffect(() => {
        if (videoRef.current && initialTime > 0) {
            videoRef.current.currentTime = initialTime
            setCurrentTime(initialTime)
        }
    }, [videoUrl, initialTime])

    // Handle play/pause
    const togglePlay = () => {
        if (videoRef.current) {
            // If video has ended, first seek back to beginning
            if (videoEnded) {
                videoRef.current.currentTime = 0
                setCurrentTime(0)
                setVideoEnded(false)
                hasEndedRef.current = false
            }

            if (isPlaying) {
                videoRef.current.pause()
            } else {
                // Add a preload attribute and promise chain for smoother playback
                videoRef.current.preload = "auto"
                videoRef.current.play()
                    .then(() => {
                        setIsPlaying(true)
                    })
                    .catch((err) => {
                        console.error("Error playing video:", err)
                        // Some browsers require user interaction before playing
                        setIsPlaying(false)
                    })
            }
        }
    }

    // Handle volume change
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number.parseFloat(e.target.value)
        setVolume(newVolume)
        if (videoRef.current) {
            videoRef.current.volume = newVolume
            setIsMuted(newVolume === 0)
        }
    }

    // Toggle mute
    const toggleMute = () => {
        if (videoRef.current) {
            const newMutedState = !isMuted
            videoRef.current.muted = newMutedState
            setIsMuted(newMutedState)
            if (!newMutedState && videoRef.current.volume === 0) {
                videoRef.current.volume = 0.5
                setVolume(0.5)
            }
        }
    }

    // Handle seeking
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressRef.current && videoRef.current && duration > 0) {
            const progressRect = progressRef.current.getBoundingClientRect()
            const seekPosition = Math.max(0, Math.min(1, (e.clientX - progressRect.left) / progressRect.width))
            const seekTime = seekPosition * duration

            // Reset ended state if seeking back from the end
            if (videoEnded || hasEndedRef.current) {
                setVideoEnded(false)
                hasEndedRef.current = false
            }

            videoRef.current.currentTime = seekTime
            setCurrentTime(seekTime)
        }
    }

    // Start progress drag
    const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true)
        handleSeek(e)
        document.addEventListener("mousemove", handleProgressDrag)
        document.addEventListener("mouseup", handleProgressDragEnd)
    }

    // Handle progress drag
    const handleProgressDrag = (e: MouseEvent) => {
        if (progressRef.current && videoRef.current && duration > 0) {
            const progressRect = progressRef.current.getBoundingClientRect()
            const seekPosition = Math.max(0, Math.min(1, (e.clientX - progressRect.left) / progressRect.width))
            const seekTime = seekPosition * duration

            // Reset ended state if seeking back from the end
            if (videoEnded || hasEndedRef.current) {
                setVideoEnded(false)
                hasEndedRef.current = false
            }

            videoRef.current.currentTime = seekTime
            setCurrentTime(seekTime)
        }
    }

    // End progress drag
    const handleProgressDragEnd = () => {
        setIsDragging(false)
        document.removeEventListener("mousemove", handleProgressDrag)
        document.removeEventListener("mouseup", handleProgressDragEnd)
    }

    // Change playback rate
    const changePlaybackRate = (rate: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate
            setPlaybackRate(rate)
        }
        setShowSettings(false)
    }

    // Skip forward/backward
    const skipTime = (seconds: number) => {
        if (videoRef.current) {
            const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds))

            // Reset ended state if seeking back from the end
            if ((videoEnded || hasEndedRef.current) && newTime < duration - 0.5) {
                setVideoEnded(false)
                hasEndedRef.current = false
            }

            videoRef.current.currentTime = newTime
            setCurrentTime(newTime)
        }
    }

    // Toggle fullscreen
    const toggleFullscreen = () => {
        if (!containerRef.current) return

        if (!document.fullscreenElement) {
            containerRef.current
                .requestFullscreen()
                .then(() => {
                    setIsFullscreen(true)
                })
                .catch((err) => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`)
                })
        } else {
            document
                .exitFullscreen()
                .then(() => {
                    setIsFullscreen(false)
                })
                .catch((err) => {
                    console.error(`Error attempting to exit fullscreen: ${err.message}`)
                })
        }
    }

    // Auto-hide controls
    useEffect(() => {
        const resetControlsTimeout = () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current)
                controlsTimeoutRef.current = null
            }

            if (isPlaying && !isHovering && !showSettings) {
                controlsTimeoutRef.current = setTimeout(() => {
                    setShowControls(false)
                }, 3000)
            } else if (!isPlaying || isHovering || showSettings) {
                setShowControls(true)
            }
        }

        resetControlsTimeout()

        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current)
            }
        }
    }, [isPlaying, isHovering, showSettings])

    // Handle fullscreen change
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }

        document.addEventListener("fullscreenchange", handleFullscreenChange)
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange)
        }
    }, [])

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!containerRef.current || !document.activeElement) return

            // Only handle keyboard shortcuts when the video container is focused or fullscreen
            const isVideoFocused =
                containerRef.current.contains(document.activeElement) ||
                document.activeElement === document.body ||
                isFullscreen

            if (!isVideoFocused) return

            switch (e.key.toLowerCase()) {
                case " ":
                case "k":
                    e.preventDefault()
                    togglePlay()
                    break
                case "arrowright":
                    e.preventDefault()
                    skipTime(10)
                    break
                case "arrowleft":
                    e.preventDefault()
                    skipTime(-10)
                    break
                case "m":
                    e.preventDefault()
                    toggleMute()
                    break
                case "f":
                    e.preventDefault()
                    toggleFullscreen()
                    break
                default:
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [isFullscreen, togglePlay, videoEnded])

    // Event handlers
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const currentVideoTime = videoRef.current.currentTime
            setCurrentTime(currentVideoTime)

            // Check if we're at the end of the video
            // Use a threshold slightly before the end to ensure the ended event fires
            if (duration > 0 && currentVideoTime >= duration - 0.2 && !hasEndedRef.current) {
                // This helps prevent edge cases where the video may not trigger the onEnded event
                if (Math.abs(currentVideoTime - duration) < 0.5) {
                    handleVideoEnded()
                }
            }

            if (onTimeUpdate) {
                onTimeUpdate(currentVideoTime)
            }
        }
    }

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const videoDuration = videoRef.current.duration
            setDuration(videoDuration)
            console.log("Video duration loaded:", videoDuration)

            if (initialTime > 0) {
                videoRef.current.currentTime = initialTime
            }
        }
    }

    const handleVideoEnded = () => {
        // Prevent multiple calls to onEnded
        if (hasEndedRef.current) return

        console.log("Video ended")
        hasEndedRef.current = true
        setVideoEnded(true)
        setIsPlaying(false)

        if (onEnded) {
            // Small timeout to ensure UI updates before calling onEnded
            setTimeout(() => onEnded(), 100)
        }
    }

    const handleVideoPlay = () => {
        setIsPlaying(true)
    }

    const handleVideoPause = () => {
        setIsPlaying(false)
    }

    // Handle video playing/buffering states
    const handleWaiting = () => {
        setIsBuffering(true)
    }

    const handlePlaying = () => {
        setIsBuffering(false)
    }

    return (
        <div
            ref={containerRef}
            className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden group ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={() => setShowControls(true)}
            tabIndex={0}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                className="w-full h-full object-contain"
                src={videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onEnded={handleVideoEnded}
                onWaiting={handleWaiting}
                onPlaying={handlePlaying}
                onClick={togglePlay}
                playsInline
                preload="auto"
            />

            {/* Title Overlay */}
            {title && (
                <AnimatePresence>
                    {showControls && (
                        <motion.div
                            className="absolute top-0 left-0 right-0 px-6 py-4 bg-gradient-to-b from-black/80 to-transparent"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-white font-semibold text-lg truncate">{title}</h2>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* Loading Indicator */}
            <AnimatePresence>
                {isBuffering && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-black/25"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="w-16 h-16 border-4 border-gray-400/30 border-t-yellow-500 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Large Play/Pause Button Overlay */}
            <AnimatePresence>
                {(!isPlaying || videoEnded) && !isBuffering && (
                    <motion.button
                        className="absolute inset-0 w-full h-full flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={togglePlay}
                    >
                        <motion.div
                            className="bg-black/40 backdrop-blur-sm rounded-full p-5"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Play className="w-12 h-12 text-white fill-white/20" />
                        </motion.div>

                        {/* Video Ended Indicator */}
                        {videoEnded && (
                            <motion.div
                                className="absolute bottom-28 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <p className="text-white text-sm font-medium">Video ended</p>
                            </motion.div>
                        )}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Video Controls */}
            <AnimatePresence>
                {(showControls || !isPlaying) && (
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-6 pt-12 pb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Progress Bar */}
                        <div className="mb-3 relative">
                            <div
                                ref={progressRef}
                                className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer group"
                                onClick={handleSeek}
                                onMouseDown={handleProgressMouseDown}
                            >
                                {/* Buffered Progress */}
                                {videoRef.current && videoRef.current.buffered.length > 0 && (
                                    <div
                                        className="absolute top-0 left-0 h-full bg-white/40 rounded-full"
                                        style={{
                                            width: `${duration > 0
                                                ? (videoRef.current.buffered.end(videoRef.current.buffered.length - 1) / duration) * 100
                                                : 0
                                                }%`,
                                        }}
                                    />
                                )}

                                {/* Played Progress */}
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-yellow-500 rounded-full"
                                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                                />

                                {/* Hover Effect - Track gets thicker on hover */}
                                <motion.div
                                    className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1.5 -mt-px bg-transparent rounded-full"
                                    whileHover={{ height: "12px", top: "50%" }}
                                />

                                {/* Progress Handle */}
                                <motion.div
                                    className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-500 border-2 border-white rounded-full transform -translate-x-1/2 opacity-0 group-hover:opacity-100 ${isDragging ? "opacity-100" : ""}`}
                                    style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 1 }}
                                />
                            </div>
                        </div>

                        {/* Controls Row */}
                        <div className="flex items-center justify-between gap-4">
                            {/* Left Controls */}
                            <div className="flex items-center space-x-3">
                                <motion.button
                                    className="text-white/90 hover:text-yellow-400 transition-colors p-1.5"
                                    onClick={togglePlay}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    title={isPlaying ? "Pause (k)" : "Play (k)"}
                                >
                                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                </motion.button>

                                {onNext && (
                                    <motion.button
                                        className="text-white/90 hover:text-yellow-400 transition-colors p-1.5"
                                        onClick={onNext}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        title="Next video"
                                    >
                                        <SkipForward className="w-5 h-5" />
                                    </motion.button>
                                )}

                                <motion.button
                                    className="text-white/90 hover:text-yellow-400 transition-colors p-1.5"
                                    onClick={() => skipTime(-10)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Rewind 10s (←)"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                </motion.button>

                                <motion.button
                                    className="text-white/90 hover:text-yellow-400 transition-colors p-1.5"
                                    onClick={() => skipTime(10)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Forward 10s (→)"
                                >
                                    <RotateCw className="w-5 h-5" />
                                </motion.button>

                                <div className="flex items-center space-x-1 group">
                                    <motion.button
                                        className="text-white/90 hover:text-yellow-400 transition-colors p-1.5"
                                        onClick={toggleMute}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        title={isMuted ? "Unmute (m)" : "Mute (m)"}
                                    >
                                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                    </motion.button>

                                    <div className="w-0 overflow-hidden transition-all duration-300 group-hover:w-20">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={isMuted ? 0 : volume}
                                            onChange={handleVolumeChange}
                                            className="w-20 accent-yellow-500"
                                        />
                                    </div>
                                </div>

                                <div className="text-sm text-white/90 font-medium">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </div>
                            </div>

                            {/* Right Controls */}
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <motion.button
                                        className="text-white/90 hover:text-yellow-400 transition-colors p-1.5"
                                        onClick={() => setShowSettings(!showSettings)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        title="Settings"
                                    >
                                        <Settings className="w-5 h-5" />
                                    </motion.button>

                                    {/* Settings Menu */}
                                    <AnimatePresence>
                                        {showSettings && (
                                            <motion.div
                                                className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg overflow-hidden"
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="p-3">
                                                    <div className="text-sm font-medium mb-2 text-white/70">Playback Speed</div>
                                                    <div className="space-y-1">
                                                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                                                            <button
                                                                key={rate}
                                                                className={`flex items-center justify-between w-full px-3 py-1.5 text-sm rounded-md transition-colors ${playbackRate === rate
                                                                    ? "bg-yellow-600/90 text-white"
                                                                    : "text-white/80 hover:bg-white/10"
                                                                    }`}
                                                                onClick={() => changePlaybackRate(rate)}
                                                            >
                                                                <span>{rate === 1 ? "Normal" : `${rate}x`}</span>
                                                                {playbackRate === rate && (
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-white ml-6"></span>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Fullscreen button */}
                                <motion.button
                                    className="text-white/90 hover:text-yellow-400 transition-colors p-1.5"
                                    onClick={toggleFullscreen}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    title={isFullscreen ? "Exit Fullscreen (f)" : "Fullscreen (f)"}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-5 h-5"
                                    >
                                        {isFullscreen ? (
                                            <>
                                                <path d="M8 3v4a1 1 0 0 1-1 1H3" />
                                                <path d="M21 8h-4a1 1 0 0 1-1-1V3" />
                                                <path d="M3 16h4a1 1 0 0 1 1 1v4" />
                                                <path d="M16 21v-4a1 1 0 0 1 1-1h4" />
                                            </>
                                        ) : (
                                            <>
                                                <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                                                <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                                                <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                                                <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                                            </>
                                        )}
                                    </svg>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default VideoPlayer