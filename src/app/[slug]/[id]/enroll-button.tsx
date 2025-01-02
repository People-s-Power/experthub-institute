'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CourseTypeSingle, EventTypeSingle } from '@/types/CourseType'

interface EnrollButtonProps {
    type: 'course' | 'event'
    data: CourseTypeSingle | EventTypeSingle
    className?: string
}

export default function EnrollButton({ type, data, className }: EnrollButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleEnroll = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/${type}s/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: data._id }),
            })

            if (!response.ok) {
                throw new Error('Failed to enroll')
            }

            router.refresh()
            // Add success notification here
        } catch (error) {
            console.error(error)
            // Add error notification here
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleEnroll}
            disabled={loading}
            className={className}
        >
            {loading ? 'Processing...' : data.fee > 0
                ? `Enroll for $${data.fee}`
                : type === 'course' ? 'Enroll for Free' : 'Register Now'
            }
        </button>
    )
}

