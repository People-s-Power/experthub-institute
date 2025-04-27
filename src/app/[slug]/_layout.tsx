import React from 'react';
import { Metadata } from 'next';
import apiService from '@/utils/apiService';


type Props = {
  params: {
    slug: string,
  }
  children: React.ReactNode

}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const id = params.slug
  // // fetch data
  let { data: course } = await apiService.get(`/courses/single-course/${id}`)

  return {
    title: `${course.course?.title}`,
    description: course.course?.about,
    openGraph: {
      images: {
        url: course.course?.thumbnail,
      },
      title: course.course?.title,
      type: "website",
      description: course.course?.about,
      siteName: course.course?.title,
      url: `${process.env.NEXT_SERVER_URL}/applicant/${params.slug}?page=${id}`
    },
    twitter: {
      title: course.course?.title,
      description: course.course?.about,
      images: course.course?.thumbnail,
    }
  }
}

export default function singleLayout({
  children, params
}: Props) {
  return (
    <div>
      {children}
    </div>
  );
};

