"use client"

import type React from "react"
import { useEffect, useRef } from "react"

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

    return hrs > 0
        ? `${hrs.toString().padStart(2, "0")}:${paddedMins}:${paddedSecs}`
        : `${paddedMins}:${paddedSecs}`
}
const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, initialTime = 0, onTimeUpdate, onEnded }) => {
    const videoRef = useRef<HTMLVideoElement>(null)

    // Set initial time when video loads
    useEffect(() => {
        if (videoRef.current && initialTime > 0) {
            videoRef.current.currentTime = initialTime
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
            }
        }

        video.addEventListener("error", handleError)

        return () => {
            video.removeEventListener("error", handleError)
        }
    }, [])

    return (
        <div className="w-full aspect-video rounded-lg overflow-hidden">
            <video
                ref={videoRef}
                className="w-full h-full"
                src={videoUrl}
                controls
                playsInline
                preload="auto"
                controlsList="nodownload"
                disablePictureInPicture={false}
                muted={false}
                webkit-playsinline="true"
                x5-playsinline="true"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                onError={(e) => console.error("Video error:", e)}
            />
        </div>
    )
}

export default VideoPlayer
