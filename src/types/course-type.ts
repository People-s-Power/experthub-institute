
// Common interface for shared properties
interface BaseType {
    _id: string
    title: string
    about: string
    fee: number
    strikedFee?: number
    startDate: string
    endDate?: string
    duration: number
    type?: string
    location?: string
    room?: string
    category?: string
    thumbnail: {
        type: string
        url: string
    }
    days?: {
        day: string
        checked: boolean
        startTime?: string
        endTime?: string
    }[]
    enrolledStudents?: any[]
    target?: number
    meetingId?: string
    meetingPassword?: string
    zakToken?: string
    meetingLink?: string
    meetingMode?: "zoom" | "google"
    calendarEventId?: string
    startTime?: string
    endTime?: string
    timeframe?: {
        value: number
        unit: string
    }
}

export interface CourseTypeSingle extends BaseType {
    instructorName?: string
    instructorImage?: string
    instructorId?: string
    file?: string
    privacy?: {
        student: string
    }
    assignedTutors?: string[]
    audience?: string[]
    enrollments?: {
        user: | string
        enrolledOn: string
        status: string
        updatedAt: string
    }[]
    videos?: {
        title: string
        videoUrl: string
    }[]
    approved?: boolean
    modules?: {
        title: string
        description: string
    }[]
    benefits?: string[]
}

export interface EventTypeSingle extends BaseType {
    author?: string
    authorId?: string
    mode?: string
    videoUrl?: string
}
