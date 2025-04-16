"use client"

import DashboardLayout from '@/components/DashboardLayout';
import ApplicantCourses from '@/components/cards/ApplicantCourses';
import RecommendedCard from '@/components/cards/RecommendedCard';
import StatCard from '@/components/cards/StatCard';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { CourseType } from '@/types/CourseType';
import { AssesmentType } from '@/types/AssesmentType';
import Link from 'next/link';
import apiService from '@/utils/apiService';
import AddCourseInterests from '@/components/modals/AddCourseInterests';

const applicant = () => {
  const user = useAppSelector((state) => state.value);
  const [reccomended, setReccomended] = useState<CourseType | []>([])
  const [courses, setCourses] = useState<CourseType[]>([])
  const [view, setView] = useState(3)
  const [instructors, setInstructors] = useState([])
  const [active, setActive] = useState("")
  const [assesments, setAssesment] = useState<AssesmentType | []>([])
  const [open, setOpen] = useState(false)

  const getAssesment = async () => {
    await apiService.get(`assessment/my-assessment/${user?.id}`)
      .then(function (response) {
        setAssesment(response.data.myAssesment.reverse())
        // console.log(response.data)
      }).catch(e => {
        setAssesment([])
      })
  }
  const getRecommended = async () => {
    await apiService.get(`courses/recommended-courses/${user?.id}`)
      .then(function (response) {
        setReccomended(response.data.courses)
        // console.log(response.data)
      }).catch(e => {
        setReccomended([])
      })
  }



  const getCourses = async () => {
    await apiService.get(`courses/enrolled-courses/${user?.id}`)
      .then(function (response) {
        // const all: CourseType[] = []
        // response.data.enrolledCourses.map((course: CourseType) => {
        //   if (hasDatePassed(course)) {
        //     all.push(course)
        //   }
        // })
        setCourses(response.data.enrolledCourses)
        console.log(response.data.enrolledCourses)
      }).catch(e => {
        setCourses([])
      })
  }
  const getTutors = () => {
    apiService.put('user/myinstructors', {
      course: user.assignedCourse
    })
      .then(function (response) {
        setInstructors(response.data.instructors)
        // console.log(response.data)
      }).catch(e => {
        setInstructors([])
      })
  }

  useEffect(() => {
    getRecommended()
    getCourses()
    getTutors()
    getAssesment()
  }, [])


  return (
    <DashboardLayout>
      <section className='p-4 lg:flex hidden justify-between'>
        <StatCard title='Total No of Courses' count={courses.length} bg='#27C2D6' img='clock-line' />
        <StatCard title='Module Assessments' count={assesments.length} bg='#DC9F08' img='ic_outline-assessment' />
        <StatCard title='Progress' count={"0%"} bg='#53C48C' img='game-icons_progression' />
        <StatCard title='Training Providers' count={instructors.length} bg='#7E34C9' img='ph_chalkboard-teacher' />
      </section>
      <section className='m-3 p-3 rounded-md shadow-[0px_2px_4px_0px_#1E1E1E21]'>
        <div className='text-sm flex justify-between'>
          <div className=''>
            <div className='flex '>
              <h4 className='text-lg my-auto mr-6 font-medium'>Continue learning</h4>
              {/* <Link href={'/applicant/profile#interests'}> */}
              <button onClick={() => setOpen(true)} className='bg-primary p-3 rounded-md'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              </svg>
              </button>
              {/* </Link> */}
            </div>
            <div className='!flex w-full flex-wrap'>
              <p onClick={() => setActive("")} className='m-2 bg-gray cursor-pointer px-2 text-base'>All</p>
              <p onClick={() => setActive(user.assignedCourse)} className='m-2 bg-gray px-2 cursor-pointer text-base'>{user.assignedCourse}</p>
              {user.otherCourse?.map((single: string, index: any) => single.length === 0 ? null : <p key={index} onClick={() => setActive(single)} className='m-2 bg-gray cursor-pointer px-2 text-base'>{single}</p>)}
            </div>
          </div>

          <p onClick={() => setView(view === 3 ? courses.length : 3)} className='text-[#DC9F08] cursor-pointer mt-auto'>VIEW {view === 3 ? "ALL" : "LESS"}</p>
        </div>
        <div className='flex flex-wrap justify-between'>
          {courses.slice(0, view)
            .filter((course: CourseType) => course.category === active || active === "")
            .map((course: CourseType) => <ApplicantCourses key={course._id} course={course} />)}
          {/* <ApplicantCourses />
          <ApplicantCourses />
          <ApplicantCourses /> */}
        </div>
      </section>
      <section className='m-4'>
        <p className='text-xl font-medium my-3'>Application status</p>
        <p className='text-sm'>You are a part of our Learning Community.
          <br /> <br />
          You can begin your learning journey with some introductory courses in your skill area. Enjoy your journey to becoming an expert and a digital nomad.</p>
      </section>
      <section className='m-2 p-3 shadow-md'>
        <div className='text-sm my-3 flex justify-between'>
          <p className='font-bold text-base'>Recommended for you</p>
          <Link href={'/applicant/feeds'}>
            <p className='text-sm'>Other Courses</p>
          </Link>
          <p className='text-[#DC9F08] text-sm'>VIEW ALL</p>
        </div>
        <div className='flex flex-wrap justify-between'>
          {
            reccomended.length === 0 ? <div>No reccomended courses</div> : reccomended.
              filter((course: CourseType) => course.category === active || active === "")
              .map((course: any) => <RecommendedCard key={course._id} course={course} call={() => getCourses()} />)
          }
        </div>
        <AddCourseInterests open={open} handleClick={() => setOpen(!open)} />
      </section>
    </DashboardLayout>
  );
};

export default applicant;