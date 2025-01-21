'use client'

import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import dayjs from 'dayjs'
import { Calendar, Clock, MapPin, Users, Video, ChevronRight, Star } from 'lucide-react'
import EnrollButton from './enroll-button'
import { CourseTypeSingle, EventTypeSingle } from '@/types/CourseType'

interface CourseDetailProps {
    data: CourseTypeSingle | EventTypeSingle
    type: 'course' | 'event'
}

export default function CourseDetail({ data, type }: CourseDetailProps) {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    })

    const controls = useAnimation()

    useEffect(() => {
        if (inView) {
            controls.start('visible')
        }
    }, [controls, inView])

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    }

    return (
        <div className="min-h-screen">
            <div className='py-2 shadow-[0px_7px_14px_-10px_rgb(0,0,0,0.2)]'>
                <div className="relative gap-3    container mx-auto flex items-center px-4 ">
                    <div className='flex'>
                        <img src="/images/logo.png" alt="" />
                        <h3 className='text-base lg:block hidden font-medium my-auto '>EXPERTHUB INSTITUTE</h3>
                    </div>
                </div>
            </div>
            {/* Hero Section */}


            <div className="relative gap-3   py-8 container mx-auto flex items-center px-4">
                <div className="flex flex-col flex-1 justify-center h-full max-w-4xl">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                    >
                        <div className="flex flex-wrap items-center gap-3 mb-6 ">
                            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                                {type === 'course' ? 'Course' : 'Event'}
                            </span>
                            {data.category && (
                                <>
                                    <ChevronRight className="w-4 h-4" />
                                    <span className="px-3 py-1 rounded-full bg-black/10 text-sm">
                                        {data.category}
                                    </span>
                                </>
                            )}
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-medium  mb-3">
                            {data.title}
                        </h1>

                        <p className="text-lg  mb-8 max-w-2xl line-clamp-4">
                            {data.about}
                        </p>
                        <p className="text-lg  mb-2 max-w-2xl line-clamp-4">
                            Basic Info
                        </p>
                        <div className="flex flex-wrap gap-6  mb-8">
                            <div className="flex items-center gap-2 bg-white shadow-md px-4 py-2 rounded-full">
                                <Calendar className="w-5 h-5 text-primary" />
                                <span>{dayjs(data.startDate).format('MMM D, YYYY')}&nbsp;{data.endDate ? <span> to &nbsp; {dayjs(data.endDate).format('MMM D, YYYY')}</span> : ""}   </span>
                            </div>
                            {data.duration !== 0 && (
                                <div className="flex items-center gap-2 bg-white shadow-md px-4 py-2 rounded-full">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <span>{data.duration} hours</span>
                                </div>
                            )}
                            {data.enrolledStudents?.length > 0 && (
                                <div className="flex items-center gap-2 bg-white shadow-md px-4 py-2 rounded-full">
                                    <Users className="w-5 h-5 text-primary" />
                                    <span>{data.enrolledStudents.length} enrolled</span>
                                </div>
                            )}
                            {data.type && (
                                <div className="flex items-center gap-2 bg-white shadow-md px-4 py-2 rounded-full">
                                    {data.type === 'online' ? (
                                        <Video className="w-5 h-5 text-primary" />
                                    ) : (
                                        <MapPin className="w-5 h-5 text-primary" />
                                    )}
                                    <span className="capitalize">{data.type}</span>
                                </div>
                            )}
                        </div>

                        {data.author && (
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                                    {data.author.charAt(0)}
                                </div>
                                <div className="text-white">
                                    <p className="font-medium">{data.author}</p>
                                    <p className="text-sm text-white/60">Instructor</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
                <div>
                    {data.thumbnail && (
                        <Image
                            src={data.thumbnail.url || data.thumbnail as unknown as string}
                            alt={data.title}
                            width={500}
                            height={500}
                            className=" object-cover w-[700px] p-[4px] bg-gradient-to-br from-primary to-blue-500 rounded-xl  bg-clip-border  h-[400px] "
                        />
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.section
                            ref={ref}
                            initial="hidden"
                            animate={controls}
                            variants={fadeIn}
                            className="bg-white rounded-xl p-8 shadow-sm"
                        >
                            <h2 className="text-2xl font-medium mb-6">Overview</h2>
                            <div className="prose max-w-none">
                                <p className="text-slate-600 whitespace-pre-line">{data.about}</p>


                            </div>
                            {data.benefits && <div className='my-3 flex flex-col gap-2 mt-4'>
                                <p className='font-medium text-xl'> Why you should enroll in this course</p>
                                <div className=' flex flex-col '>
                                    {data.benefits.map((single, index) => <div className='flex gap-3 items-center py-3 border-b border-slate-200 '>
                                        <div className='w-8 h-8  bg-primary/25 border border-primary  flex items-center justify-center font-medium rounded-full'>
                                            {index + 1}
                                        </div>
                                        <div className='flex-1'>{single}</div>
                                    </div>)}



                                </  div>
                            </div>}
                        </motion.section>

                        {data.type !== "pdf" && data.days && data.days.length > 0 && (
                            <motion.section
                                initial="hidden"
                                animate={controls}
                                variants={fadeIn}
                                className="bg-white rounded-xl p-8 shadow-sm"
                            >
                                <h2 className="text-2xl font-medium mb-6">Schedule</h2>
                                <div className="grid gap-4">
                                    {data.days.filter(day => day.checked).map((day, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{day.day}s</p>
                                                    <p className="text-sm text-slate-500">Weekly</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-slate-900">

                                                    {day.startTime ? dayjs(day.startTime, 'HH:mm').format('h:mm A') : "Check Venue"}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {day.endTime ? dayjs(day.endTime, 'HH:mm').format('h:mm A') : "Check Venue"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {data.location && (
                            <motion.section
                                initial="hidden"
                                animate={controls}
                                variants={fadeIn}
                                className="bg-white rounded-xl p-8 shadow-sm"
                            >
                                <h2 className="text-2xl font-medium mb-6">Location</h2>
                                <div className="p-6 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg mb-2">Venue Details</h3>
                                            <p className="text-slate-600 mb-1">{data.location}</p>
                                            {data.room && (
                                                <p className="text-slate-600"><span className='text-black'>Room:</span> {data.room}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.section>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div>
                        <div className="sticky top-4 space-y-6">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeIn}
                                className="bg-white rounded-xl p-6 shadow-sm"
                            >
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        {data.fee > 0 ? (
                                            <div>
                                                <p className="text-3xl font-medium">${data.fee}</p>
                                                {data.strikedFee && (
                                                    <p className="text-slate-400 line-through">
                                                        ${data.strikedFee}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-3xl font-medium text-green-500">Free</p>
                                        )}
                                        {data.target && (
                                            <div className="text-right">
                                                <p className="text-sm text-slate-500">Capacity</p>
                                                <p className="font-medium">{data.target} seats</p>
                                            </div>
                                        )}
                                    </div>
                                    {data.enrolledStudents?.length > 0 && (
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Star className="w-4 h-4 fill-primary text-primary" />
                                            <span>{data.enrolledStudents.length} already enrolled</span>
                                        </div>
                                    )}
                                </div>

                                <EnrollButton
                                    type={type}
                                    data={data}
                                    className="w-full bg-primary text-black font-medium py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors mb-6"
                                />

                                <div className="space-y-4 border-t border-slate-200 pt-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Start Date</p>
                                            <p className="text-sm text-slate-600">
                                                {dayjs(data.startDate).format('MMMM D, YYYY')}
                                            </p>
                                        </div>
                                    </div>
                                    {
                                        data.endDate && <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">End Date</p>
                                                <p className="text-sm text-slate-600">
                                                    {dayjs(data.startDate).format('MMMM D, YYYY')}
                                                </p>
                                            </div>
                                        </div>
                                    }

                                    {data.duration !== 0 && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Duration</p>
                                                <p className="text-sm text-slate-600">
                                                    {data.duration} hours total
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {data.type && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                {data.type === 'online' ? (
                                                    <Video className="w-5 h-5 text-primary" />
                                                ) : (
                                                    <MapPin className="w-5 h-5 text-primary" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">Type</p>
                                                <p className="text-sm text-slate-600 capitalize">
                                                    {data.type} {type}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

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
                                            controls
                                            poster={data.thumbnail?.url}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        >
                                            <source src={data.videoUrl} type="video/mp4" />
                                        </video>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

