"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Circle, ChevronDown, Play, Clock } from "lucide-react"
import { formatTime } from "./video-player"

interface Module {
    _id?: string
    title: string
    videoUrl: string
    duration?: number
    submodules?: {
        _id?: string
        title: string
        videoUrl: string
        duration?: number
    }[]
}

interface ModulesListProps {
    modules: Module[]
    currentModuleIndex: number
    currentSubmoduleIndex: number
    onSelectModule: (moduleIndex: number, submoduleIndex?: number) => void
}

const ModulesList: React.FC<ModulesListProps> = ({
    modules,
    currentModuleIndex,
    currentSubmoduleIndex,
    onSelectModule,
}) => {
    const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({})
    const [moduleDurations, setModuleDurations] = useState<Record<string, number>>({})

    // Initialize expanded state for the current module
    useEffect(() => {
        if (currentModuleIndex >= 0) {
            setExpandedModules((prev) => ({
                ...prev,
                [currentModuleIndex]: true,
            }))
        }
    }, [currentModuleIndex])

    // Get video duration by creating a temporary video element
    const getVideoDuration = (videoUrl: string): Promise<number> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement("video")
            video.preload = "metadata"

            // Add timeout to prevent hanging
            const timeout = setTimeout(() => {
                video.remove()
                resolve(0) // Default to 0 if timeout
            }, 5000)

            video.onloadedmetadata = () => {
                clearTimeout(timeout)
                const duration = isNaN(video.duration) ? 0 : video.duration
                resolve(duration)
                video.remove()
            }

            video.onerror = () => {
                clearTimeout(timeout)
                console.error("Error loading video metadata")
                resolve(0) // Default to 0 on error
                video.remove()
            }

            video.src = videoUrl
        })
    }

    // Calculate durations for modules and submodules that don't have them
    useEffect(() => {
        const calculateDurations = async () => {
            const durations: Record<string, number> = { ...moduleDurations }
            let hasChanges = false

            for (let i = 0; i < modules.length; i++) {
                const module = modules[i]

                // Only calculate if duration is not already provided or cached
                if (!module.duration && module.videoUrl && !durations[`module-${i}`]) {
                    try {
                        const duration = await getVideoDuration(module.videoUrl)
                        durations[`module-${i}`] = duration
                        hasChanges = true
                    } catch (error) {
                        console.error(`Error getting duration for module ${i}:`, error)
                        durations[`module-${i}`] = 0
                        hasChanges = true
                    }
                }

                if (module.submodules) {
                    for (let j = 0; j < module.submodules.length; j++) {
                        const submodule = module.submodules[j]

                        if (!submodule.duration && submodule.videoUrl && !durations[`submodule-${i}-${j}`]) {
                            try {
                                const duration = await getVideoDuration(submodule.videoUrl)
                                durations[`submodule-${i}-${j}`] = duration
                                hasChanges = true
                            } catch (error) {
                                console.error(`Error getting duration for submodule ${i}-${j}:`, error)
                                durations[`submodule-${i}-${j}`] = 0
                                hasChanges = true
                            }
                        }
                    }
                }
            }

            if (hasChanges) {
                setModuleDurations(durations)
            }
        }

        calculateDurations()
    }, [modules])

    const toggleModuleExpand = (index: number) => {
        setExpandedModules((prev) => ({
            ...prev,
            [index]: !prev[index],
        }))
    }

    const handleModuleClick = (moduleIndex: number) => {
        // If this module has submodules and is not expanded, expand it
        if (modules[moduleIndex].submodules?.length && !expandedModules[moduleIndex]) {
            toggleModuleExpand(moduleIndex)
        } else {
            // Otherwise, play the module video
            onSelectModule(moduleIndex, -1)
        }
    }

    const isModuleCompleted = (moduleIndex: number) => {
        return moduleIndex < currentModuleIndex
    }

    const isSubmoduleCompleted = (moduleIndex: number, submoduleIndex: number) => {
        if (moduleIndex < currentModuleIndex) {
            return true
        } else if (moduleIndex === currentModuleIndex && submoduleIndex < currentSubmoduleIndex) {
            return true
        }
        return false
    }

    // Calculate total duration of a module including all submodules
    const calculateTotalModuleDuration = (moduleIndex: number): number => {
        const module = modules[moduleIndex]
        let totalDuration = module.duration || moduleDurations[`module-${moduleIndex}`] || 0

        if (module.submodules) {
            module.submodules.forEach((submodule, subIndex) => {
                totalDuration += submodule.duration || moduleDurations[`submodule-${moduleIndex}-${subIndex}`] || 0
            })
        }

        return totalDuration
    }

    // Get module duration display
    const getModuleDuration = (moduleIndex: number, submoduleIndex = -1): string => {
        if (submoduleIndex === -1) {
            const module = modules[moduleIndex]
            const duration = module.duration || moduleDurations[`module-${moduleIndex}`] || 0
            return formatTime(duration)
        } else {
            const submodule = modules[moduleIndex].submodules?.[submoduleIndex]
            const duration = submodule?.duration || moduleDurations[`submodule-${moduleIndex}-${submoduleIndex}`] || 0
            return formatTime(duration)
        }
    }

    return (
        <div className="p-6 rounded-lg bg-gray-900/60 backdrop-blur-sm border border-gray-800/50">
            <h2 className="text-xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
                Course Content
            </h2>
            <div className="space-y-3">
                {modules.map((module, moduleIndex) => (
                    <div key={module._id || moduleIndex} className="overflow-hidden rounded-lg shadow-md relative group">
                        <div
                            className={`
                flex items-center justify-between p-4 cursor-pointer transition-all duration-200
                ${moduleIndex === currentModuleIndex && currentSubmoduleIndex === -1
                                    ? "bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg"
                                    : "bg-gray-800 hover:bg-gray-700 text-gray-100"
                                }
                ${isModuleCompleted(moduleIndex) && "border-l-4 border-green-500"}
              `}
                            onClick={() => handleModuleClick(moduleIndex)}
                        >
                            <div className="flex items-center space-x-3 flex-grow min-w-0">
                                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                    {moduleIndex === currentModuleIndex && currentSubmoduleIndex === -1 ? (
                                        <Play className="w-4 h-4 text-white animate-pulse" />
                                    ) : isModuleCompleted(moduleIndex) ? (
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <span className="font-medium text-sm block truncate">{module.title}</span>
                                    <div className="flex items-center mt-1 text-xs text-gray-400">
                                        <Clock className="w-3 h-3 mr-1" />
                                        <span>
                                            {module.submodules?.length
                                                ? formatTime(calculateTotalModuleDuration(moduleIndex))
                                                : getModuleDuration(moduleIndex)}
                                        </span>
                                        {module.submodules && module.submodules?.length > 0 && (
                                            <span className="ml-2">{module.submodules.length} lessons</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {module.submodules?.length ? (
                                <button
                                    className={`
                    p-1 rounded-full transition-all duration-200 hover:bg-white/10
                    ${expandedModules[moduleIndex] ? "rotate-180" : "rotate-0"}
                  `}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toggleModuleExpand(moduleIndex)
                                    }}
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            ) : (
                                <div className="flex-shrink-0 text-xs text-gray-400 ml-2">{getModuleDuration(moduleIndex)}</div>
                            )}
                        </div>

                        {/* Submodules */}
                        {module.submodules?.length && (
                            <AnimatePresence>
                                {expandedModules[moduleIndex] && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-gray-900/80 divide-y divide-gray-800/50"
                                    >
                                        {module.submodules.map((submodule, submoduleIndex) => (
                                            <div
                                                key={submodule._id || submoduleIndex}
                                                className={`
                          flex items-center space-x-3 p-3 pl-10 cursor-pointer transition-all duration-200
                          ${moduleIndex === currentModuleIndex && submoduleIndex === currentSubmoduleIndex
                                                        ? "bg-yellow-600/80 text-white"
                                                        : "hover:bg-gray-800/80"
                                                    }
                          ${isSubmoduleCompleted(moduleIndex, submoduleIndex) && "border-l-2 border-green-500/70"}
                        `}
                                                onClick={() => onSelectModule(moduleIndex, submoduleIndex)}
                                            >
                                                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                                    {moduleIndex === currentModuleIndex && submoduleIndex === currentSubmoduleIndex ? (
                                                        <Play className="w-3 h-3 text-white" />
                                                    ) : isSubmoduleCompleted(moduleIndex, submoduleIndex) ? (
                                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                                    ) : (
                                                        <Circle className="w-3 h-3 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <span className="text-xs font-medium opacity-90 group-hover:opacity-100 block truncate">
                                                        {submodule.title}
                                                    </span>
                                                </div>
                                                <div className="flex-shrink-0 text-xs text-gray-400">
                                                    {getModuleDuration(moduleIndex, submoduleIndex)}
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ModulesList
