import { Metadata } from 'next'
import CourseDetail from './course-details'
import { getCourse, getEvent } from './lib/actions'

interface PageProps {
    params: {
        id: string
        slug: 'courses' | 'events'
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const data = params.slug === 'courses'
        ? await getCourse(params.id)
        : await getEvent(params.id)

    return {
        title: data?.title || 'Not Found',
        description: data?.about || '',
    }
}

export default async function Page({ params }: PageProps) {
    const data = params.slug === 'courses'
        ? await getCourse(params.id)
        : await getEvent(params.id)

    if (!data) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <h1 className="text-2xl font-bold">Not Found</h1>
            </div>
        )
    }

    return <CourseDetail data={data} type={params.slug === 'courses' ? 'course' : 'event'} />
}

