"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import apiService from "@/utils/apiService"
import { jwtDecode } from "jwt-decode"
import { setUser } from "@/store/slices/userSlice"

type Props = {
    user: {
        id: string
        role: string
        gMail?: string
        isGoogleLinked: boolean
    }
}

export default function ThirdPartyManagement({ user }: Props) {
    const localUser = useAppSelector((state) => state.value)
    const searchParams = useSearchParams()
    const dispatch = useAppDispatch()
    const pathname = usePathname()

    const [googleLoading, setGoogleLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGoogleLogin = () => {
        setGoogleLoading(true)
        try {
            const redirectUrl = `${apiService.getUri()}auth/google?link=${localUser.id}&role=${localUser.role}&redirectUrl=${pathname}`
            window.location.href = redirectUrl
        } catch (err) {
            setError("Failed to redirect to Google login")
            setGoogleLoading(false)
        }
    }

    useEffect(() => {
        handleGoogleLink()
    }, [])

    const handleGoogleLink = () => {
        // Handle auth redirect with JWT data
        const encodedData = searchParams.get("data")

        if (encodedData) {
            try {
                const decoded: any = jwtDecode(encodedData)

                if (decoded) {
                    dispatch(
                        setUser({
                            ...localUser,
                            isGoogleLinked: true,
                        }),
                    )

                    const newUrl = window.location.pathname
                    window.history.replaceState({}, "", newUrl)

                    // Success notification is handled in the parent component
                }
            } catch (error) {
                setError("Invalid user data")
                console.error("Invalid user data", error)
            }
        }
    }

    return (
        <div className="mt-6 border-t border-gray-200 py-6">
            <h3 className="text-base font-semibold mb-4 text-gray-800">Third-Party Account Management</h3>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                    <button onClick={() => setError(null)} className="ml-2 text-red-700 hover:text-red-900">
                        ✕
                    </button>
                </div>
            )}

            {/* Google Section */}
            <div className="my-3">
                {localUser.isGoogleLinked ? (
                    <div className="flex flex-col gap-3">
                        <div className="text-sm text-gray-700 flex items-center">
                            <span className="font-medium mr-2">Google:</span>
                            <span className="text-gray-600">{user?.gMail || "Connected"}</span>
                        </div>
                        <button
                            onClick={handleGoogleLogin}
                            disabled={googleLoading}
                            className="w-fit flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md 
                                      text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
                                      transition-colors duration-200 ease-in-out shadow-sm
                                      disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {googleLoading ? (
                                <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                            ) : (
                                <>
                                    <img
                                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                                        alt="Google"
                                        className="w-4 h-4 mr-2"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                                        }}
                                    />
                                    Change Google Account
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md 
                                  text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
                                  transition-colors duration-200 ease-in-out shadow-sm
                                  disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {googleLoading ? (
                            <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                        ) : (
                            <>
                                <img
                                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                                    alt="Google"
                                    className="w-4 h-4 mr-2"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                                    }}
                                />
                                Login with Google
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}
