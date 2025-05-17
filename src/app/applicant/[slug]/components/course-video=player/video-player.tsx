"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface VideoPlayerProps {
    videoUrl: string
    title?: string
    initialTime?: number
    onTimeUpdate?: (time: number) => void
    onEnded?: () => void
    onNext?: () => void
}

export function formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    const paddedMins = mins.toString().padStart(2, "0")
    const paddedSecs = secs.toString().padStart(2, "0")

    return hrs > 0 ? `${hrs.toString().padStart(2, "0")}:${paddedMins}:${paddedSecs}` : `${paddedMins}:${paddedSecs}`
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoUrl,
    title,
    initialTime = 0,
    onTimeUpdate,
    onEnded,
    onNext,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Set initial time when video loads
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        setIsLoading(true)
        setError(null)

        // Reset video element when source changes
        video.load()

        const handleCanPlay = () => {
            setIsLoading(false)
            if (initialTime > 0) {
                video.currentTime = initialTime
            }
        }

        video.addEventListener("canplay", handleCanPlay)

        return () => {
            video.removeEventListener("canplay", handleCanPlay)
        }
    }, [videoUrl, initialTime])

    // Handle time update event
    const handleTimeUpdate = () => {
        if (videoRef.current && onTimeUpdate) {
            onTimeUpdate(videoRef.current.currentTime)
        }
    }

    // Handle video ended event
    const handleVideoEnded = () => {
        if (onEnded) {
            onEnded()
        }
    }

    // Add error handling and logging
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleError = (e: Event) => {
            console.error("Video error event:", e)
            if (video.error) {
                console.error("Video error code:", video.error.code)
                console.error("Video error message:", video.error.message)

                let errorMessage = "Error playing video"
                switch (video.error.code) {
                    case 1:
                        errorMessage = "Video loading aborted"
                        break
                    case 2:
                        errorMessage = "Network error occurred"
                        break
                    case 3:
                        errorMessage = "Video decoding failed"
                        break
                    case 4:
                        errorMessage = "Video format not supported"
                        break
                }
                setError(errorMessage)
            }
        }

        video.addEventListener("error", handleError)

        return () => {
            video.removeEventListener("error", handleError)
        }
    }, [])

    return (
        <div className="w-full aspect-video rounded-lg overflow-hidden relative bg-black">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-gray-600 animate-spin"></div>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-red-500 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <p>{error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                        onClick={() => {
                            setError(null)
                            if (videoRef.current) {
                                videoRef.current.load()
                            }
                        }}
                    >
                        Try Again
                    </button>
                </div>
            )}

            <video
                ref={videoRef}
                className="w-full h-full"
                src={videoUrl}
                controls
                preload="metadata"
                controlsList="nodownload"
                disablePictureInPicture={false}
                muted={false}
                playsInline={true}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                onError={(e) => console.error("Video error:", e)}
            />

            {title && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4">
                    <h3 className="text-white font-medium">{title}</h3>
                </div>
            )}

            {onNext && (
                <button
                    onClick={onNext}
                    className="absolute bottom-16 right-4 bg-white/90 hover:bg-white text-black rounded-full p-2 shadow-lg transition-colors"
                    aria-label="Next video"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}
        </div>
    )
}

export default VideoPlayer
