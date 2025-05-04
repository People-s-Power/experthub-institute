"use client"

import type React from "react"

import { useEffect, useState, useRef, MutableRefObject, RefObject } from "react"
import { motion, useAnimation, useScroll, useTransform } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { MapPin, ArrowRight, Edit } from "lucide-react"
import EnrollButton from "./components/enroll-button"
import { VideoPreview } from "./components/video-preview"
import { TestimonialsSection } from "./components/testimonials/testimonials-section"
import { CourseStats } from "./components/course-stats"
import { CourseSidebar } from "./components/course-sidebar"
import { CourseHero } from "./components/course-hero"
import { BenefitsSection } from "./components/benefits-section"
import { ScheduleSection } from "./components/schedule-section"
import type { CourseTypeSingle, EventTypeSingle } from "@/types/course-type"
import Image from "next/image"
import { CourseVideoPreview } from "./components/course-videos"
import AddEvents from "@/components/modals/AddEvents"
import AddCourse from "@/components/modals/AddCourse"
import { useAppSelector } from "@/store/hooks"

// Default benefits if none provided
const defaultBenefits = [
    "Master essential concepts and practical applications",
    "Learn from industry experts with real-world experience",
    "Gain hands-on experience through practical exercises",
    "Receive a certificate of completion for your portfolio",
]

interface CourseDetailProps {
    data: any
    type: "course" | "event"
}

export default function CourseDetail({ data, type }: CourseDetailProps) {
    const [activeSection, setActiveSection] = useState("overview")
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)

    const overviewRef = useRef<HTMLDivElement | null>(null)
    const benefitsRef = useRef<HTMLDivElement | null>(null)
    const scheduleRef = useRef<HTMLDivElement | null>(null)
    const instructorRef = useRef<HTMLDivElement | null>(null)
    const user = useAppSelector((state) => state.value);

    // Parallax and scroll effects
    const { scrollYProgress } = useScroll()
    const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95])

    // Intersection observers for animations
    const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })
    const [overviewInViewRef, overviewInView] = useInView({ threshold: 0.1 })
    const [benefitsInViewRef, benefitsInView] = useInView({ threshold: 0.1 })
    const [scheduleInViewRef, scheduleInView] = useInView({ threshold: 0.1 })
    const [ctaRef, ctaInView] = useInView({ threshold: 0.1 })

    // Animation controls
    const heroControls = useAnimation()
    const overviewControls = useAnimation()
    const benefitsControls = useAnimation()
    const scheduleControls = useAnimation()
    const ctaControls = useAnimation()

    // Handle scroll-based section activation
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100

            const sections = [
                { id: "overview", ref: overviewRef },
                { id: "benefits", ref: benefitsRef },
                { id: "schedule", ref: scheduleRef },
                { id: "instructor", ref: instructorRef },
            ].filter((section) => section.ref.current)

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i]
                if (section.ref.current && scrollPosition >= section.ref.current.offsetTop) {
                    setActiveSection(section.id)
                    break
                }
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Start animations when sections come into view
    useEffect(() => {
        if (heroInView) heroControls.start("visible")
        if (overviewInView) overviewControls.start("visible")
        if (benefitsInView) benefitsControls.start("visible")
        if (scheduleInView) scheduleControls.start("visible")
        if (ctaInView) ctaControls.start("visible")
    }, [
        heroControls,
        heroInView,
        overviewControls,
        overviewInView,
        benefitsControls,
        benefitsInView,
        scheduleControls,
        scheduleInView,
        ctaControls,
        ctaInView,
    ])

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
                delay: i * 0.1,
            },
        }),
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }
    const [open, setOpen] = useState(false)
    const [event, setEvent] = useState(false)



    // Get benefits with fallback to default if empty
    const displayBenefits = data.benefits && data.benefits.length > 0 ? data.benefits : defaultBenefits

    return (
        <>


            <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
                {/* Navbar */}
                <header className="fixed top-0 left-0 right-0 z-10 t backdrop-blur-md bg-[#f9f9f990] border-b border-[#d9d9d9]">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex w-1/3 items-center gap-3">

                            {data.instructor?.profilePicture || data.instructor?.image ? (
                                <Image
                                    src={data.instructor.profilePicture || data.instructor.image}
                                    alt={data.instructor.fullname || data.instructor.name || "Instructor"}
                                    width={120}
                                    height={120}
                                    className=" border  object-cover w-[50px] h-[50px] shadow-[0px_0px_20px_0px_rgba(200,200,150,0.4)] rounded-full"
                                />
                            ) : (
                                <div className="w-[50px] h-[50px] shadow-[0px_0px_20px_0px_rgba(200,200,150,0.4)] rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold">
                                    {(
                                        data.instructor?.fullname ||
                                        data.instructor?.name ||
                                        data.instructorName ||
                                        data.author ||
                                        ""
                                    ).charAt(0)}
                                </div>
                            )}
                            <h3 className="text-lg font-medium hidden md:block whitespace-nowrap text-ellipsis max-w-[200px] overflow-hidden">  {data.instructor?.fullname || data.instructor?.name || data.instructorName || data.author} </h3>
                        </div>

                        <nav className="hidden w-1/3 md:flex items-center justify-center gap-8">
                            <button
                                onClick={() => scrollToSection(overviewRef)}
                                className={`text-sm font-medium transition-colors relative ${activeSection === "overview" ? "text-primary" : "text-zinc-600 hover:text-primary"}`}
                            >
                                Overview
                                {activeSection === "overview" && (
                                    <motion.div
                                        layoutId="activeSection"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                                    />
                                )}
                            </button>
                            {displayBenefits.length > 0 && (
                                <button
                                    onClick={() => scrollToSection(benefitsRef)}
                                    className={`text-sm font-medium transition-colors relative ${activeSection === "benefits" ? "text-primary" : "text-zinc-600 hover:text-primary"}`}
                                >
                                    Benefits
                                    {activeSection === "benefits" && (
                                        <motion.div
                                            layoutId="activeSection"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                                        />
                                    )}
                                </button>
                            )}
                            {data.days && data.days.length > 0 && (
                                <button
                                    onClick={() => scrollToSection(scheduleRef)}
                                    className={`text-sm font-medium transition-colors relative ${activeSection === "schedule" ? "text-primary" : "text-zinc-600 hover:text-primary"}`}
                                >
                                    Schedule
                                    {activeSection === "schedule" && (
                                        <motion.div
                                            layoutId="activeSection"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                                        />
                                    )}
                                </button>
                            )}
                            {(data.author || data.instructorName) && (
                                <button
                                    onClick={() => scrollToSection(instructorRef)}
                                    className={`text-sm font-medium transition-colors relative ${activeSection === "instructor" ? "text-primary" : "text-zinc-600 hover:text-primary"}`}
                                >
                                    Instructor
                                    {activeSection === "instructor" && (
                                        <motion.div
                                            layoutId="activeSection"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                                        />
                                    )}
                                </button>
                            )}
                        </nav>
                        <div className="w-1/3 flex gap-4 justify-end">
                            {
                                (user.role === "tutor" || user.role === "admin") && <button
                                    onClick={() => type === "event" ? setEvent(!event) : setOpen(!open)}
                                    className="  border border-slate-300 hover:border-primary  gap-1.5    flex font-medium py-2 px-4 rounded-lg transition-all text-sm"
                                >
                                    Edit <Edit className="text-primary h-5 w-5" />
                                </button>
                            }


                            <EnrollButton
                                buttonText={"Enroll"}
                                type={type}
                                data={data}
                                id="enroll-1"
                                className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-7 rounded-lg transition-all text-sm"
                            />
                        </div>
                    </div>

                </header>

                {/* Hero Section */}
                <CourseHero
                    data={data}
                    type={type}
                    onPlayVideo={() => {
                        setIsVideoPlaying(true)
                        document.getElementById("preview-video")?.scrollIntoView({ behavior: "smooth" })
                    }}
                />

                {/* Stats Section */}
                <CourseStats data={data} benefits={displayBenefits} />

                {/* Main Content */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Content */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Overview Section */}
                            <motion.section
                                ref={(el) => {
                                    overviewRef.current = el as HTMLDivElement
                                    overviewInViewRef(el)
                                }}
                                variants={staggerContainer}
                                initial="hidden"
                                animate={overviewControls}
                                id="overview"
                                className="scroll-mt-24"
                            >
                                <motion.h2 variants={fadeIn} custom={0} className="text-2xl font-bold mb-2 text-zinc-900">
                                    Overview
                                </motion.h2>

                                <motion.div variants={fadeIn} custom={1} className="w-16 h-1 bg-primary rounded-full mb-6" />

                                <motion.div variants={fadeIn} custom={2} className="prose max-w-none text-zinc-700">
                                    <p className="whitespace-pre-line">{data.about}</p>
                                </motion.div>

                                {data.videoUrl && (
                                    <motion.div variants={fadeIn} custom={3} id="preview-video" className="mt-8">
                                        <VideoPreview
                                            data={{
                                                videos: data.videos,
                                                videoUrl: data.videoUrl,
                                                thumbnail: data.thumbnail,
                                                title: data.title,
                                            }}
                                            isPlaying={isVideoPlaying}
                                            onPlay={() => setIsVideoPlaying(true)}
                                        />
                                    </motion.div>
                                )}

                                {
                                    data.videos && data.videos.length > 0 && (
                                        <CourseVideoPreview modules={data.videos} />
                                    )
                                }
                            </motion.section>

                            {/* Benefits Section */}
                            <BenefitsSection
                                benefits={displayBenefits}
                                benefitsRef={(el: RefObject<HTMLDivElement>) => {
                                    benefitsRef.current = el as any
                                    benefitsInViewRef(el as unknown as Element)
                                }}
                                benefitsControls={benefitsControls}
                            />

                            {/* Schedule Section */}
                            <ScheduleSection
                                data={data}
                                scheduleRef={(el: RefObject<HTMLDivElement>) => {
                                    scheduleRef.current = el as any
                                    scheduleInViewRef(el as unknown as Element)
                                }}
                                scheduleControls={scheduleControls}
                            />

                            {/* Location Section */}
                            {data.location && (
                                <motion.section
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate={scheduleControls}
                                    className="scroll-mt-24"
                                >
                                    <motion.h2 variants={fadeIn} custom={0} className="text-2xl font-bold mb-2 text-zinc-900">
                                        Location
                                    </motion.h2>

                                    <motion.div variants={fadeIn} custom={1} className="w-16 h-1 bg-primary rounded-full mb-6" />

                                    <motion.div
                                        variants={fadeIn}
                                        custom={2}
                                        whileHover={{ scale: 1.03 }}
                                        className="p-6 rounded-lg bg-white border border-zinc-100 shadow-sm"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <MapPin className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-lg mb-2 text-zinc-900">Venue Details</h3>
                                                <p className="text-zinc-700 mb-1">{data.location}</p>
                                                {data.room && (
                                                    <p className="text-zinc-700">
                                                        <span className="font-medium">Room:</span> {data.room}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.section>
                            )}

                            {/* Instructor Section */}
                            {(data.instructor || data.author || data.instructorName) && (
                                <motion.section
                                    ref={instructorRef}
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate={scheduleControls}
                                    id="instructor"
                                    className="scroll-mt-24"
                                >
                                    <motion.h2 variants={fadeIn} custom={0} className="text-2xl font-bold mb-2 text-zinc-900">
                                        Meet Your Instructor
                                    </motion.h2>

                                    <motion.div variants={fadeIn} custom={1} className="w-16 h-1 bg-primary rounded-full mb-6" />

                                    <motion.div
                                        variants={fadeIn}
                                        custom={2}
                                        whileHover={{ scale: 1.01 }}
                                        className="p-6 duration-300 rounded-lg bg-white border border-zinc-100 shadow-sm"
                                    >
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Instructor Image/Avatar */}
                                            <div className="flex items-center  rounded-full">
                                                {data.instructor?.profilePicture || data.instructor?.image ? (
                                                    <Image
                                                        src={data.instructor.profilePicture || data.instructor.image}
                                                        alt={data.instructor.fullname || data.instructor.name || "Instructor"}
                                                        width={120}
                                                        height={120}
                                                        className=" border  object-cover w-[120px] h-[120px] shadow-[0px_0px_20px_0px_rgba(200,200,150,0.7)] rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-[120px] h-[120px] shadow-[0px_0px_20px_0px_rgba(200,200,150,0.7)] rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold">
                                                        {(
                                                            data.instructor?.fullname ||
                                                            data.instructor?.name ||
                                                            data.instructorName ||
                                                            data.author ||
                                                            ""
                                                        ).charAt(0)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Instructor Details */}
                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <h3 className="font-bold text-xl text-zinc-900">
                                                        {data.instructor?.fullname || data.instructor?.name || data.instructorName || data.author}
                                                    </h3>
                                                    <p className="text-primary font-medium">
                                                        {data.instructor?.role === "tutor" ? "Expert Instructor" : "Course Instructor"}
                                                    </p>

                                                    <p className="mt-4 text-[#707070]">An experienced and passionate educator on Experthub, {data.instructor?.fullname || data.instructor?.name || data.instructorName || data.author} brings expert knowledge and a commitment to helping learners grow. With a focus on practical skills and student success, also  delivers engaging, high-quality content tailored for today's learners.</p>
                                                </div>


                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.section>
                            )}
                            {/* Testimonials Section */}
                            <TestimonialsSection />
                        </div>

                        {/* Right Sidebar */}
                        <CourseSidebar data={data} type={type} />
                    </div>
                </div>

                {/* CTA Section */}
                <motion.section
                    ref={ctaRef}
                    variants={staggerContainer}
                    initial="hidden"
                    animate={ctaControls}
                    className="py-16 bg-gradient-to-r from-primary/90 to-blue-600 text-white"
                >
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl mx-auto text-center">
                            <motion.h2 variants={fadeIn} custom={0} className="text-3xl font-bold mb-4">
                                Ready to Transform Your Skills?
                            </motion.h2>

                            <motion.p variants={fadeIn} custom={1} className="text-white/90 mb-8">
                                Join thousands of satisfied students and take the next step in your learning journey.
                            </motion.p>

                            <div className="flex flex-wrap justify-center gap-4">
                                <div  >
                                    <EnrollButton
                                        type={type}
                                        id="enroll-2"
                                        data={data}
                                        className="bg-white text-primary hover:bg-white/90 font-medium py-3 px-6 rounded-lg transition-all"
                                    />
                                </div>

                                <motion.button
                                    onClick={() => document.getElementById("overview")?.scrollIntoView({ behavior: "smooth" })}
                                    className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center gap-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Learn More <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Footer */}
                <footer className="bg-zinc-900 text-white py-8">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center mb-4 md:mb-0">
                                <Image src={"/images/logo.png"} className="w-[50px] object-cover h-[50px]" alt="logo " width={50} height={50} />

                                <span className="ml-2 text-lg font-bold">Experthub</span>
                            </div>

                            <div className="text-sm text-zinc-400">© {new Date().getFullYear()} Experthub. All rights reserved.</div>
                        </div>
                    </div>
                </footer>
            </div>
            <AddCourse course={data} open={open} setOpen={setOpen} handleClick={() => { setOpen(!open); window.location.reload() }} />
            {/* <AddResources open={resources} handleClick={() => setResources(!resources)} /> */}
            <AddEvents setOpen={setEvent} open={event} handleClick={() => { setEvent(!event); window.location.reload() }} course={data} />
        </>
    )
}
