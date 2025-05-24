"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function Hero() {
    return (
        <>
            <section className="pt-24 pb-12 overflow-hidden">
                <div className="max-w-[1300px] mx-auto px-4">
                    <div className="flex flex-col py-8 lg:flex-row items-center justify-between">
                        {/* Left Column */}
                        <motion.div
                            className="lg:w-1/2 lg:pr-12 "
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-3xl lg:text-[55px] font-medium leading-tight mb-6">
                                Connecting you to the {" "}
                                <span className="text-primary">the Right </span>
                                {" "}Experts
                            </h1>
                            <p className="text-gray-600 text-lg mb-8">
                                Discover a world of opportunities through expert-led services, training programs and flexible workspace solutions.
                            </p>
                            <div className="flex gap-4">
                                <Link
                                    href={"/auth/signup"}
                                    className="bg-primary hover:bg-yellow-400 duration-300 px-8 py-3 font-medium text-lg text-white rounded-lg"
                                >
                                    Register
                                </Link>
                            </div>
                        </motion.div>

                        {/* Right Column */}
                        <motion.div
                            className="lg:w-1/2 mt-12 lg:mt-0 relative"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {/* Decorative Elements */}
                            <motion.div
                                className="absolute top-0 right-0 w-64 h-64 bg-green-200 rounded-full"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 10, 0]
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <motion.div
                                className="absolute bottom-0 left-30 w-32 h-32 bg-yellow-100 rounded-full"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, -10, 0]
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <div className="relative z-10">
                                <img
                                    src="/images/hero.webp"
                                    alt="Student learning"
                                    className="rounded-full w-[500px] h-[500px] object-cover shadow-xl mx-auto"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats Section */}
                </div>
            </section>
            <section className="bg-[#f5f5f5]">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 mb-14 gap-8 max-w-[1300px] mx-auto mt-16 rounded-2xl p-8"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="text-center">
                        <h3 className="text-4xl font-medium text-primary mb-2">10k+</h3>
                        <p className="text-gray-600 uppercase text-sm tracking-wider">Total Courses</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-4xl font-medium text-primary mb-2">500+</h3>
                        <p className="text-gray-600 uppercase text-sm tracking-wider">Instructors and Mentors</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-4xl font-medium text-primary mb-2">300k+</h3>
                        <p className="text-gray-600 uppercase text-sm tracking-wider">Students Globally</p>
                    </div>
                </motion.div>
            </section>
        </>
    )
}
