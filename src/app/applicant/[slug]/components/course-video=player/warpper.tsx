"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import VideoPlayer from "./video-player"
import ModulesList from "./module-list"
import ProgressBar from "./progress-bar"
import CourseOverview from "./course-overview"
import type { CourseType } from "@/types/CourseType"
import { Menu, X } from "lucide-react"

interface VideoCoursePlayerProps {
    course: CourseType
}

const VideoCoursePlayer: React.FC<VideoCoursePlayerProps> = ({ course }) => {
    // State for tracking current module and submodule
    const [currentModuleIndex, setCurrentModuleIndex] = useState<number | null>(null)
    const [currentSubmoduleIndex, setCurrentSubmoduleIndex] = useState<number | null>(null)
    const [isModuleListOpen, setIsModuleListOpen] = useState(true)
    const [progress, setProgress] = useState(0)
    const [videoTime, setVideoTime] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    // Calculate total videos (modules + submodules)
    const totalVideos = course.videos.reduce((total, module) => total + 1 + (module.submodules?.length || 0), 0)

    // Calculate completed videos
    const calculateCompletedVideos = () => {
        let completed = 0

        if (currentModuleIndex === null) return 0

        // Count completed main modules
        for (let i = 0; i < currentModuleIndex; i++) {
            completed++
            completed += course.videos[i].submodules?.length || 0
        }

        // Add current module if we're in a submodule
        if (currentModuleIndex < course.videos.length) {
            if (currentSubmoduleIndex !== null && currentSubmoduleIndex >= 0) {
                completed++
                // Count completed submodules
                for (let i = 0; i < currentSubmoduleIndex; i++) {
                    completed++
                }
            }
        }

        return completed
    }

    // Get current video URL
    const getCurrentVideoUrl = () => {
        if (currentModuleIndex === null) return ""

        if (currentSubmoduleIndex === null || currentSubmoduleIndex === -1) {
            return course.videos[currentModuleIndex]?.videoUrl || ""
        } else {
            return course.videos[currentModuleIndex]?.submodules?.[currentSubmoduleIndex]?.videoUrl || ""
        }
    }

    // Get current video title
    const getCurrentVideoTitle = () => {
        if (currentModuleIndex === null) return ""

        if (currentSubmoduleIndex === null || currentSubmoduleIndex === -1) {
            return course.videos[currentModuleIndex]?.title || ""
        } else {
            return course.videos[currentModuleIndex]?.submodules?.[currentSubmoduleIndex]?.title || ""
        }
    }

    // Handle next video
    const handleNextVideo = () => {
        if (currentModuleIndex === null) {
            // If no video is playing, start with the first one
            setCurrentModuleIndex(0)
            setCurrentSubmoduleIndex(-1)
            return
        }

        // If we're in a module with submodules and not at the last submodule
        if (
            currentSubmoduleIndex !== null &&
            currentSubmoduleIndex !== -1 &&
            currentSubmoduleIndex < (course.videos[currentModuleIndex]?.submodules?.length || 0) - 1
        ) {
            setCurrentSubmoduleIndex(currentSubmoduleIndex + 1)
        }
        // If we're at the last submodule or in a main module, go to next module
        else if (currentModuleIndex < course.videos.length - 1) {
            setCurrentModuleIndex(currentModuleIndex + 1)
            setCurrentSubmoduleIndex(-1)
        }

        // Reset video time
        setVideoTime(0)
        saveProgress()
    }

    // Handle selecting a specific module/submodule
    const handleSelectModule = (moduleIndex: number, submoduleIndex = -1) => {
        setCurrentModuleIndex(moduleIndex)
        setCurrentSubmoduleIndex(submoduleIndex)
        setVideoTime(0)
        saveProgress()
    }

    // Save progress to localStorage
    const saveProgress = () => {
        if (currentModuleIndex === null) return

        // Don't save progress if we're at the end of the course
        const isLastVideo =
            currentModuleIndex === course.videos.length - 1 &&
            (currentSubmoduleIndex === -1 ||
                currentSubmoduleIndex === (course.videos[currentModuleIndex]?.submodules?.length || 0) - 1)

        const isVideoComplete =
            videoTime > 0 &&
            ((currentSubmoduleIndex === -1 && videoTime >= (course.videos[currentModuleIndex]?.duration || 0) - 1) ||
                (currentSubmoduleIndex !== -1 &&
                    videoTime >= (course.videos[currentModuleIndex]?.submodules?.[currentSubmoduleIndex as number]?.duration || 0) - 1))

        const progressData = {
            courseId: course._id,
            moduleIndex: currentModuleIndex,
            submoduleIndex: currentSubmoduleIndex,
            videoTime: isVideoComplete ? 0 : videoTime,
            lastUpdated: new Date().toISOString(),
            isComplete: isLastVideo && isVideoComplete,
        }

        localStorage.setItem(`course-progress-${course._id}`, JSON.stringify(progressData))
    }

    // Add a function to check if the course is complete
    const isCourseComplete = () => {
        const savedProgress = localStorage.getItem(`course-progress-${course._id}`)
        if (savedProgress) {
            try {
                const { isComplete } = JSON.parse(savedProgress)
                return isComplete === true
            } catch (error) {
                return false
            }
        }
        return false
    }

    // Load progress from localStorage
    const loadProgress = () => {
        const savedProgress = localStorage.getItem(`course-progress-${course._id}`)
        if (savedProgress) {
            try {
                const { moduleIndex, submoduleIndex, videoTime: savedTime } = JSON.parse(savedProgress)
                setCurrentModuleIndex(moduleIndex)
                setCurrentSubmoduleIndex(submoduleIndex)
                setVideoTime(savedTime)
            } catch (error) {
                console.error("Error loading saved progress:", error)
            }
        }
    }

    // Update progress percentage
    useEffect(() => {
        if (totalVideos > 0) {
            const completedVideos = calculateCompletedVideos()
            const newProgress = Math.min(100, Math.round((completedVideos / totalVideos) * 100))
            setProgress(newProgress)
        }
    }, [currentModuleIndex, currentSubmoduleIndex, totalVideos])

    // Load saved progress on component mount
    useEffect(() => {
        loadProgress()

        // Save progress when user leaves the page
        const handleBeforeUnload = () => {
            saveProgress()
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
            saveProgress()
        }
    }, [])

    // Save progress periodically
    useEffect(() => {
        const saveInterval = setInterval(() => {
            saveProgress()
        }, 30000) // Save every 30 seconds

        return () => clearInterval(saveInterval)
    }, [currentModuleIndex, currentSubmoduleIndex, videoTime])

    return (
        <div ref={containerRef} className="relative w-full bg-gray-900  overflow-hidden">
            {/* Progress Bar */}
            <ProgressBar progress={progress} />

            {/* Course Header */}
            <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center">
                    <img
                        src={course.instructorImage || "/images/user.png"}
                        alt={course.instructorName}
                        className="w-10 h-10 rounded-full mr-3 border-2 border-yellow-500"
                    />
                    <div>
                        <h1 className="text-xl font-bold ">{course.title}</h1>
                        <p className="text-sm text-gray-300">by {course.instructorName}</p>
                    </div>
                </div>

                <button
                    className="md:hidden flex items-center space-x-2 bg-gray-700 hover:bg-gray-600  px-4 py-2 rounded-md transition-colors"
                    onClick={() => setIsModuleListOpen(!isModuleListOpen)}
                >
                    {isModuleListOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            <div className="flex flex-col md:flex-row">
                {/* Main Content Area */}
                <motion.div className="flex-grow md:w-2/3" layout transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                    {currentModuleIndex !== null ? (
                        <>
                            {/* Video Player */}
                            <VideoPlayer
                                videoUrl={getCurrentVideoUrl()}
                                title={getCurrentVideoTitle()}
                                onTimeUpdate={(time) => setVideoTime(time)}
                                initialTime={videoTime}
                                onEnded={handleNextVideo}
                                onNext={handleNextVideo}
                            />

                            {/* Video Info */}
                            <motion.div
                                className="p-4 bg-gray-800"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-xl font-bold mb-2">{getCurrentVideoTitle()}</h2>
                                <div className="flex items-center">
                                    <img
                                        src={course.instructorImage || "/images/user.png"}
                                        alt={course.instructorName}
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <p className="text-gray-300">A course by {course.instructorName}</p>
                                </div>
                            </motion.div>
                        </>
                    ) : (
                        <CourseOverview course={course} onStartCourse={() => handleSelectModule(0)} />
                    )}
                </motion.div>

                {/* Module List Sidebar - Always visible on desktop, toggleable on mobile */}
                <AnimatePresence>
                    {(isModuleListOpen || window.innerWidth >= 768) && (
                        <motion.div
                            className="md:w-1/3 bg-gray-800 border-l border-gray-700 overflow-y-auto md:min-h-[600px] max-h-[600px]"
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <ModulesList
                                modules={course.videos}
                                currentModuleIndex={currentModuleIndex !== null ? currentModuleIndex : -1}
                                currentSubmoduleIndex={currentSubmoduleIndex !== null ? currentSubmoduleIndex : -1}
                                onSelectModule={handleSelectModule}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Toggle Button (fixed at bottom right) */}
            <div className="md:hidden fixed bottom-4 right-4 z-10">
                <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-black p-3 rounded-full shadow-lg"
                    onClick={() => setIsModuleListOpen(!isModuleListOpen)}
                >
                    {isModuleListOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>
        </div>
    )
}

export default VideoCoursePlayer
