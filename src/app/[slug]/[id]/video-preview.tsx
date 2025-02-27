import React from 'react';
import { motion } from 'framer-motion';

interface VideoPreviewProps {
    data: {
        videoUrl: string;
        thumbnail?: {
            url: string;
        };
    };
}

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
};

export const VideoPreview: React.FC<VideoPreviewProps> = ({ data }) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current && videoRef.current.currentTime >= 5) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <>
            {data.videoUrl && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="bg-white rounded-xl p-6 shadow-sm"
                >
                    <h3 className="font-medium text-lg mb-4">Preview Video</h3>
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                        <video
                            ref={videoRef}
                            controls
                            poster={data.thumbnail?.url}
                            className="absolute inset-0 w-full h-full object-cover"
                            onLoadedMetadata={handleLoadedMetadata}
                            onTimeUpdate={handleTimeUpdate}
                        >
                            <source src={data.videoUrl} type="video/mp4" />
                        </video>
                    </div>
                </motion.div>
            )}
        </>
    );
};