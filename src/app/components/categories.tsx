'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { CourseType } from '@/types/CourseType'
import Image from 'next/image'
import { fetchCourses } from '../lib/actions'
import CourseDetails from '@/components/modals/CourseDetails'
import { useAppSelector } from '@/store/hooks'


export default function CourseCategories() {
    const [courses, setCourses] = useState<CourseType[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const user = useAppSelector((state) => state.value);

    const [course, setCourse] = useState<CourseType | null>(null)
    const coursesSectionRef = useRef<HTMLElement | null>(null);
    const [shouldScroll, setShouldScroll] = useState(false)

    useEffect(() => {
        const hash = window.location.hash
        if (hash === '#courses') {
            setShouldScroll(true)
        }
    }, [])

    useEffect(() => {
        if (shouldScroll && coursesSectionRef.current) {
            coursesSectionRef.current.scrollIntoView({ behavior: 'instant' })
            setShouldScroll(false)
        }
    }, [shouldScroll, courses])

    useEffect(() => {
        async function loadCourses() {
            const result = await fetchCourses()
            if (result.success) {
                console.log(result.courses, 'Hmmer');
                setCourses(result.courses)
            }
            setIsLoading(false)
        }
        loadCourses()
    }, [])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    const getCourses = async () => {
        const result = await fetchCourses()
        if (result.success) {
            setCourses(result.courses)
        }
    }

    return (
        <>
            <section ref={coursesSectionRef} id='courses' className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase">Course Catalog</h2>
                        <p className="mt-2 text-3xl leading-8 font-medium tracking-tight text-gray-900 sm:text-4xl">
                            Explore Our Courses
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                            Experthub Trainings is a training provider that specialises in accredited and
                            bespoke training courses. We crush the barriers to getting a degree.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, index) => (
                            <motion.div
                                key={course._id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-[0_0_15px_-2px_rgb(0,0,0,0.3)] overflow-hidden flex flex-col h-full group"
                            >
                                <div className="relative pb-0">
                                    <div className="relative h-56 w-full border-b border-gray mb-4">
                                        <Image
                                            src={typeof course.thumbnail === 'string' ? course.thumbnail : course.thumbnail.url}
                                            alt={course.title}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-t-lg"
                                        />
                                    </div>
                                    <span className="absolute top-2 right-2 bg-[#f5f5f5] shadow-md text-xs font-medium rounded-[8px] px-3 py-1.5">
                                        {course.category}
                                    </span>
                                    <div className="px-6 py-4">
                                        <h3 className="text-xl font-medium text-gray-900 mb-2">{course.title}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3">{course.about}</p>

                                        {course.instructorName && (
                                            <div className="flex items-center mb-4">
                                                <img
                                                    className="w-6 h-6 rounded-full mr-2"
                                                    src={course.instructorImage || "/images/user.png"}
                                                    alt={course.instructorName}
                                                />
                                                <p className="text-sm font-medium">{course.instructorName}</p>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => { setCourse(course); setOpen(true) }}
                                            className="mt-4 inline-flex items-center px-5 py-2.5 border border-transparent text-sm leading-4 hover:scale-105 hover:-translate-y-1 font-medium duration-300 rounded-md text-white bg-primary"
                                        >
                                            Enroll Now
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <button className="bg-primary text-white font-medium px-10 py-3 rounded-md hover:bg-yellow-400 transition-colors">
                            View More Courses
                        </button>
                    </div>
                </div>
            </section>
            {
                course && <CourseDetails course={course} open={open} action={"Course"} type='enroll' call={getCourses} handleClick={() => setOpen(false)} />
            }
        </>
    )
}
