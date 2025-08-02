import React from 'react';
import { Metadata } from 'next';
import { trainingsBaseURL } from '@/lib/utils';

type Props = {
  params: {
    slug: string,
  };
  children: React.ReactNode;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const id = params.slug;

  // Fetch course data
  let course = await fetch(`${trainingsBaseURL}/courses/single-course/${id}`).then((res) => res.json());

  // If the course is not found, fetch event data
  if (!course.course) {
    course = await fetch(`${process.env.NEXT_SERVER_URL}/events/${id}`).then((res) => res.json());
  }

  // Destructure the fetched data
  const { course: courseData } = course;

  return {
    title: courseData?.title || 'Course Title',
    description: courseData?.about || 'Course Description',
    openGraph: {
      images: [{ url: courseData?.thumbnail.url }],
      title: courseData?.title || 'Course Title',
      type: 'website',
      description: courseData?.about || 'Course Description',
      siteName: courseData?.title || 'Course Title',
      url: `https://trainings.experthubllc.com/applicant/${params.slug}?page=${id}`,
    },
    twitter: {
      title: courseData?.title || 'Course Title',
      description: courseData?.about || 'Course Description',
      images: [courseData?.thumbnail],
    },
  };
};

export default function SingleLayout({ children }: Props) {
  return <div>{children}</div>;
}
