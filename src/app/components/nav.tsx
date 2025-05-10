"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"

export function Navigation() {
    return (
        <motion.nav
            className="fixed w-full z-50 bg-white border-b border-gray py-2"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-3 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <Image src={"/images/logo.png"} alt="logo" className="w-[60px] h-[60px] object-cover" width={800} height={800} />
                            <span className="text-2xl fond-medium  text-primary ">
                                Experthub Trainings
                            </span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center justify-center">
                        <div className="flex items-center space-x-8 font-medium duration-300">
                            <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                                Home
                            </Link>
                            <Link href="#courses" className="text-gray-600 hover:text-primary transition-colors">
                                Courses
                            </Link>
                            <Link href="#features" className="text-gray-600 hover:text-primary transition-colors">
                                Features
                            </Link>
                            <Link href="#about" className="text-gray-600 hover:text-primary transition-colors">
                                About
                            </Link>
                            <Link href="#partner" className="text-gray-600 hover:text-primary transition-colors">
                                Partner
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <Link href={"/auth/login"} className="font-medium">Sign In</Link>
                        <Link href={"/auth/signup"} className="duration-300 bg-primary hover:bg-yellow-400 text-white px-6 py-2 rounded-md font-medium">Register</Link>
                    </div>
                </div>
            </div>
        </motion.nav>
    )
}
