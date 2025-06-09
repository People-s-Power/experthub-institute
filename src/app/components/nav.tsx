"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Close mobile menu when screen size changes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false)
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const navLinks = [
        { href: "#", label: "Home" },
        { href: "#courses", label: "Courses" },
        { href: "#features", label: "Features" },
        { href: "#about", label: "About" },
        { href: "#partner", label: "Partner" },
    ]

    return (
        <>
            <motion.nav
                className={`fixed w-full z-50 bg-white border-b ${scrolled ? "shadow-md" : "border-gray"
                    } py-2`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo and Brand */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-2">
                                <div className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] relative">
                                    <Image
                                        src="/images/logo.png"
                                        alt="logo"
                                        className="object-cover"
                                        fill
                                        sizes="(max-width: 640px) 40px, (max-width: 768px) 50px, 60px"
                                    />
                                </div>
                                <span className="text-lg sm:text-xl md:text-2xl font-medium text-primary truncate">
                                    Experthub Trainings
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center justify-center">
                            <div className="flex items-center space-x-4 lg:space-x-8 font-medium">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="text-gray-600 hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden lg:flex items-center space-x-3">
                            <Link href="/auth/login" className="font-medium text-gray-700 hover:text-primary transition-colors">
                                Sign In
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="duration-300 bg-primary hover:bg-yellow-400 text-white px-4 py-2 rounded-md font-medium"
                            >
                                Register
                            </Link>
                        </div>

                        {/* Mobile Auth Button (Only Sign In) */}

                        <div className="flex items-center gap-2">


                            {/* Mobile Menu Button */}
                            <button
                                className="lg:hidden flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsOpen(!isOpen)}
                                aria-label="Toggle menu"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {isOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>

                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            className="fixed right-0 top-0 h-full w-[250px] bg-white z-50 lg:hidden shadow-xl overflow-y-auto"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            <div className="p-5">
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 rounded-full hover:bg-gray-100"
                                        aria-label="Close menu"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                <div className="mt-6 space-y-5">
                                    {navLinks.map((link) => (
                                        <motion.div
                                            key={link.label}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * navLinks.indexOf(link) }}
                                        >
                                            <Link
                                                href={link.href}
                                                className="block py-2 text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {link.label}
                                            </Link>
                                        </motion.div>
                                    ))}

                                    <div className="pt-5 mt-5 border-t flex flex-col gap-4">
                                        <Link
                                            href="/auth/login"
                                            className="block w-full text-center duration-300 border border-primary hover:bg-yellow-400  px-4 py-3 rounded-md font-medium"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/auth/signup"
                                            className="block w-full text-center duration-300 bg-primary hover:bg-yellow-400 text-white px-4 py-3 rounded-md font-medium"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Register
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
