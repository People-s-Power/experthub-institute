'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import apiService from '@/utils/apiService';
import { notification, Spin } from 'antd';
import { jwtDecode } from 'jwt-decode';
import { setUser } from "@/store/slices/userSlice"

type Props = {
    user: {
        id: string;
        role: string;
        gMail?: string;
        isGoogleLinked: boolean;
    };
};

export default function ThirdPartyManagement({ user }: Props) {
    const localUser = useAppSelector((state) => state.value);
    const searchParams = useSearchParams()
    const dispatch = useAppDispatch()
    const [api, contextHolder] = notification.useNotification()

    const pathname = usePathname();
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleGoogleLogin = () => {
        setGoogleLoading(true);
        const redirectUrl = `${apiService.getUri()}auth/google?link=${localUser.id}&role=${localUser.role}&redirectUrl=${pathname}`;
        window.location.href = redirectUrl;
    };

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
                            isGoogleLinked: true, // Make sure this is set to true
                        }),
                    )

                    const newUrl = window.location.pathname
                    window.history.replaceState({}, "", newUrl)

                    api.open({
                        message: "Google account linked successfully, Continue adding course",
                        type: "success",
                    })
                }
            } catch (error) {
                console.error("Invalid user data", error)
            }
        }
    }

    return (
        <div className="mt-4 border-t border-gray py-7">
            <h3 className="text-sm font-semibold mb-2">Third-Party Account Management</h3>

            {/* Google Section */}
            <div className="my-2 text-xs">
                {localUser.isGoogleLinked ? (
                    <div className="flex flex-col gap-2">
                        <div className="text-sm text-gray-700">
                            <strong>Google:</strong> {user?.gMail || 'Connected'}
                        </div>
                        <button
                            onClick={handleGoogleLogin}
                            disabled={googleLoading}
                            className="w-fit border border-gray-300 bg-white px-4 py-2 rounded-sm font-medium flex items-center hover:bg-gray-50 transition-colors"
                        >
                            {googleLoading ? (
                                <Spin />
                            ) : (
                                <>
                                    <img
                                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                                        alt="Google"
                                        className="w-4 h-4 mr-2"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg';
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
                        className="w-full border border-gray-300 bg-white p-2 rounded-sm font-medium flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                        {googleLoading ? (
                            <Spin />
                        ) : (
                            <>
                                <img
                                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                                    alt="Google"
                                    className="w-4 h-4 mr-2"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg';
                                    }}
                                />
                                Login with Google
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
