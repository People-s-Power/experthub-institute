"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

export function formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    const paddedMins = mins.toString().padStart(2, "0")
    const paddedSecs = secs.toString().padStart(2, "0")

    return hrs > 0 ? `${hrs.toString().padStart(2, "0")}:${paddedMins}:${paddedSecs}` : `${paddedMins}:${paddedSecs}`
}

interface VideoPlayerProps {
    videoUrl: string
    poster?: string
    className?: string,
    onEnded?: () => void
}

export default function ReliableVideoPlayer({ videoUrl, onEnded,
    poster, className = "" }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        const videoElement = videoRef.current
        if (!videoElement) return

        // Reset state when source changes
        setIsLoading(true)
        setError(null)
        setIsPlaying(false)

        const onLoadStart = () => {
            setIsLoading(true)
            setError(null)
        }

        const onCanPlay = () => {
            setIsLoading(false)
        }

        const onError = () => {
            setIsLoading(false)
            setError("Failed to load video. Please try again.")
            console.error("Video error:", videoElement.error)
        }

        const onPlay = () => {
            setIsPlaying(true)
        }

        const onPause = () => {
            setIsPlaying(false)
        }

        // Add event listeners
        videoElement.addEventListener("loadstart", onLoadStart)
        videoElement.addEventListener("canplay", onCanPlay)
        videoElement.addEventListener("error", onError)
        videoElement.addEventListener("play", onPlay)
        videoElement.addEventListener("pause", onPause)

        // Clean up
        return () => {
            videoElement.removeEventListener("loadstart", onLoadStart)
            videoElement.removeEventListener("canplay", onCanPlay)
            videoElement.removeEventListener("error", onError)
            videoElement.removeEventListener("play", onPlay)
            videoElement.removeEventListener("pause", onPause)
        }
    }, [videoUrl])


    const handleVideoEnded = () => {
        if (onEnded) {
            onEnded()
        }
    }
    return (
        <div className={`relative overflow-hidden rounded-lg ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4 z-10">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-12 h-12 text-red-500 mb-2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p>{error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => {
                            if (videoRef.current) {
                                videoRef.current.load()
                                setError(null)
                            }
                        }}
                    >
                        Retry
                    </button>
                </div>
            )}

            <video
                ref={videoRef}
                className="w-full h-full object-contain bg-black"
                src={videoUrl}
                poster={poster}
                playsInline
                controls
                onEnded={handleVideoEnded}
                controlsList="nodownload"
                preload="auto"
            />
        </div>
    )
}
