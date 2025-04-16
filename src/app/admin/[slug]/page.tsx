"use client"

import { CourseType } from '@/types/CourseType';
import React, { Fragment, useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout';
import AddCourse from '@/components/modals/AddCourse';
import SinglePage from '@/components/SinglePage';
import apiService from '@/utils/apiService';


const SingleCourse = () => {
  const [repo, setRepo] = useState<CourseType | null>(null)
  const pathname = useSearchParams().get("page")
  const view = useSearchParams().get("view")
  const page = usePathname().slice(7)


  const router = useRouter()
  const [edit, setEdit] = useState(false)

  // console.log(pathname)

  const getData = async () => {
    await apiService.get(`courses/single-course/${page}`)
      .then(function (response) {
        setRepo(response.data.course)
        console.log(response.data)
      })
  }

  const getEvent = async () => {
    await apiService.get(`events/${page}`)
      .then(function (response) {
        setRepo(response.data.course)
        console.log(response.data)
      })
  }

  useEffect(() => {
    if (pathname === 'event') {
      getEvent()
    } else {
      getData()
    }
  }, [])

  const approve = () => {
    apiService.put(`courses/approve/${page}`)
      .then(function (response) {
        // getPendngCourses()
        router.back()
        console.log(response.data)
      }).catch(function (error) {
        console.log(error);
      })
  }

  return (
    <Fragment>
      <DashboardLayout>
        <section className=''>
          {pathname !== 'event' && <div className='flex'>
            {view ? null : <button className='p-4 bg-primary m-6' onClick={() => approve()}>Publish</button>}
            <button className=' m-6' onClick={() => setEdit(true)}>Edit</button>
          </div>}

          {repo && <SinglePage pathname={pathname} repo={repo} page={page} />}
          {repo && <AddCourse course={repo} open={edit} setOpen={setEdit} handleClick={() => setEdit(false)} />}
        </section>
      </DashboardLayout>
    </Fragment>
  );
};

export default SingleCourse;