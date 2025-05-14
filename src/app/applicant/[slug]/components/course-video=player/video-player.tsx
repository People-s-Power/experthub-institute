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

    if (hrs > 0) {
        return `${hrs.toString().padStart(2, "0")}:${paddedMins}:${paddedSecs}`
    } else {
        return `${paddedMins}:${paddedSecs}`
    }
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

    return (
        <div className="w-full aspect-video rounded-lg overflow-hidden">
            <video
                ref={videoRef}
                className="w-full h-full"
                src={videoUrl}
                controls
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
            />
        </div>
    )
}

export default VideoPlayer
