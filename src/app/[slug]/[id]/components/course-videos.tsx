"use client"

import { useRef, useState, useEffect } from "react"
import { Play, Pause } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

const getDuration = (url: string): Promise<number> =>
    new Promise((resolve) => {
        const video = document.createElement("video")
        video.src = url
        video.addEventListener("loadedmetadata", () => resolve(video.duration))
    })

const formatTime = (duration: number) => {
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
}

export const CourseVideoPreview = ({ modules }: { modules: any[] }) => {
    const [durations, setDurations] = useState<{ [key: string]: number }>({})
    const [playingKey, setPlayingKey] = useState<string | null>(null)

    useEffect(() => {
        const loadDurations = async () => {
            const all = await Promise.all(
                modules.flatMap((mod, i) => [
                    getDuration(mod.videoUrl).then((d) => ({ key: `m-${i}`, duration: d })),
                    ...mod.submodules.map((sub: any, j: number) =>
                        getDuration(sub.videoUrl).then((d) => ({ key: `s-${i}-${j}`, duration: d }))
                    ),
                ])
            )

            const map: { [key: string]: number } = {}
            all.forEach((entry) => (map[entry.key] = entry.duration))
            setDurations(map)
        }

        loadDurations()
    }, [modules])

    const handlePlay = (key: string, videoRef: HTMLVideoElement | null) => {
        if (!videoRef) return
        if (playingKey === key) {
            videoRef.pause()
            setPlayingKey(null)
        } else {
            if (playingKey && videoRef) videoRef.pause()
            setPlayingKey(key)
            videoRef.play()
        }
    }

    return (
        <div className="space-y-6 mt-6">
            {modules.map((mod, i) => (
                <div key={`module-${i}`} className="space-y-2 border rounded-lg border-slate-300 p-3">
                    <p className="text-lg font-medium text-gray-800">Module ({i + 1}) : {mod.title}</p>

                    <div className="flex items-center gap-4 bg-white rounded-lg shadow border p-4">

                        <VideoBox
                            videoUrl={mod.videoUrl}
                            title={mod.title}
                            canPlay={i === 0}
                            isPlaying={playingKey === `m-${i}`}
                            duration={durations[`m-${i}`]}
                            onPlay={(ref) => handlePlay(`m-${i}`, ref)}
                        />
                    </div>
                    {mod.submodules?.length > 0 && <div className="pl-8 ml-8 border-l flex flex-col gap-4 py-3 mt-5  border-slate-600">
                        {mod.submodules?.map((sub: any, j: number) => (
                            <div key={`sub-${i}-${j}`} className="m">
                                <VideoBox
                                    videoUrl={sub.videoUrl}
                                    title={sub.title}
                                    canPlay={i === 0 && j === 0}
                                    isPlaying={playingKey === `s-${i}-${j}`}
                                    duration={durations[`s-${i}-${j}`]}
                                    onPlay={(ref) => handlePlay(`s-${i}-${j}`, ref)}
                                />
                            </div>
                        ))}
                    </div>}


                </div>
            ))}
        </div>
    )
}

const VideoBox = ({
    videoUrl,
    title,
    duration,
    canPlay,
    isPlaying,
    onPlay,
}: {
    videoUrl: string
    title: string
    duration?: number
    canPlay: boolean
    isPlaying: boolean
    onPlay: (ref: HTMLVideoElement | null) => void
}) => {
    const ref = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (ref.current) {
            ref.current.currentTime = 0
        }
    }, [videoUrl])

    const handleTimeUpdate = () => {
        if (!canPlay || !ref.current) return
        if (ref.current.currentTime >= 30) {
            ref.current.pause()
        }
    }

    return (
        <div className="flex items-center gap-4">
            <div className="relative w-28 aspect-video rounded overflow-hidden border shadow">
                <video
                    ref={ref}
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                />
                <AnimatePresence>
                    {!isPlaying && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => onPlay(ref.current)}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 text-white"
                        >
                            <Play className="w-6 h-6" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium">{title}</p>
                {duration !== undefined && (
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(duration)}</p>
                )}
            </div>
        </div>
    )
}
