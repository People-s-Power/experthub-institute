"use client"

import { motion } from "framer-motion"

export function AboutUs() {
    return (
        <section id="about" className="relative py-20 overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/images/about.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: "fixed"
                }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-60 z-10"></div>

            {/* Content */}
            <div className="max-w-[1300px] mx-auto px-4 relative z-20">
                <motion.div
                    className="max-w-3xl mx-auto text-center text-white"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl font-bold mb-6 uppercase">About Experthub Trainings</h2>
                    <p className="text-lg mb-8">We are determine to raise the next generation of global leaders and empower youths to harness the immense power of technology to overcome the challenges our planet faces, including its dwindling economy.</p>
                    <p className="text-lg mb-8">Our platform is more than just a website; it's a thriving community of like-minded individuals who share a passion for change. Together, we learn, grow, and collaborate to make a tangible impact on our communities and planet.</p>
                    <p className="text-lg mb-8">By providing resources, knowledge, and support, we uplift individuals, equip communities, and foster long-term positive change. Through collaboration and innovation, we aim to break barriers and create an environment where everyone has a fair chance to thrive.</p>
                    <p className="text-lg mb-8">Guided by a vision of equity and inclusion, our initiatives span education, skill development, and economic empowerment to build stronger communities and a brighter future.</p>
                </motion.div>
            </div>

            {/* Decorative Shapes */}
            <motion.div
                className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full opacity-20 z-10"
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 18,
                    ease: "linear",
                    repeat: Infinity,
                }}
            />
            <motion.div
                className="absolute bottom-10 right-10 w-32 h-32 bg-primary rounded-full opacity-20 z-10"
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [360, 180, 0],
                }}
                transition={{
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity,
                }}
            />
            <motion.div
                className="absolute top-1/2 right-1/4 w-16 h-16 bg-blue-500 rounded-full opacity-20 z-10"
                animate={{
                    y: [0, -30, 0],
                }}
                transition={{
                    duration: 5,
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
            />
        </section>
    )
}
