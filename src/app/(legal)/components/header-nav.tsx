"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { X, Menu } from "lucide-react"

const HeaderNav = () => {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    const isActive = (path: string) => {
        return pathname === path ? "text-primary font-medium" : "text-gray-700 hover:text-primary"
    }

    return (
        <header className="shadow-md bg-white sticky top-0">
            <div className="max-w-6xl   mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <img src="/images/logo.png" alt="" className="object-cover h-[50px] w-[50px]" />
                    <h3 className="ml-3 text-xl font-bold text-gray-800">Experthub</h3>
                </div>

                <div className="lg:flex hidden justify-between text-sm w-auto space-x-8">
                    <Link className={`my-auto ${isActive("/")}`} href={"/"}>
                        <p>Home</p>
                    </Link>
                    <Link className={`my-auto ${isActive("/privacy")}`} href={"/privacy"}>
                        <p>Privacy Policy</p>
                    </Link>
                    <Link className={`my-auto ${isActive("/terms")}`} href={"/terms"}>
                        <p>Terms of Service</p>
                    </Link>

                    <Link className={`my-auto ${isActive("/contact")}`} href={"#footer"}>
                        <p>Contact</p>
                    </Link>

                    <div className="flex items-center space-x-3 ml-4">
                        <Link href={"/auth/login"} className="my-auto">
                            <button className="text-sm text-gray-700 hover:text-primary transition-colors">Login</button>
                        </Link>
                        <Link href={"/auth/signup"} className="my-auto">
                            <button className="text-sm bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors">
                                Register
                            </button>
                        </Link>
                    </div>
                </div>

                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center justify-center h-10 w-10 my-auto lg:hidden text-gray-700 hover:text-primary transition-colors"
                    aria-label="Toggle menu"
                >
                    <Menu size={24} />
                </button>

                {open && (
                    <div className="fixed z-50 top-0 right-0 h-full w-[300px] bg-white shadow-xl p-6 text-gray-800 animate-in slide-in-from-right">
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                            aria-label="Close menu"
                        >
                            <X size={24} />
                        </button>

                        <div className="mt-16 flex flex-col space-y-6">
                            <Link href={"/"} className={`font-medium ${isActive("/")}`} onClick={() => setOpen(false)}>
                                Home
                            </Link>
                            <Link
                                href={"/privacy"}
                                className={`font-medium ${isActive("/privacy-policy")}`}
                                onClick={() => setOpen(false)}
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href={"/terms"}
                                className={`font-medium ${isActive("/terms-of-service")}`}
                                onClick={() => setOpen(false)}
                            >
                                Terms of Service
                            </Link>

                            <Link href={"#contact"} className={`font-medium ${isActive("/contact")}`} onClick={() => setOpen(false)}>
                                Contact
                            </Link>

                            <div className="pt-6 border-t border-gray-100 flex flex-col space-y-4">
                                <Link href={"/auth/login"} onClick={() => setOpen(false)}>
                                    <button className="w-full text-center border border-gray-200 text-gray-700 hover:border-primary hover:text-primary px-4 py-2 rounded-md transition-colors">
                                        Login
                                    </button>
                                </Link>
                                <Link href={"/auth/signup"} onClick={() => setOpen(false)}>
                                    <button className="w-full text-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors">
                                        Register
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default HeaderNav
