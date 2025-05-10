"use client"

import { CourseType } from '@/types/CourseType';
import React, { Fragment, useState, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout';
import SinglePage from '@/components/SinglePage';
import { useAppSelector } from '@/store/hooks';
import Login from '@/components/Login';
import SignUpComp from '@/components/SignUpComp';
import apiService from '@/utils/apiService';


export default function SingleCourse() {
  const [repo, setRepo] = useState<CourseType | null>(null)
  const pathname = useSearchParams().get("page")
  const page = usePathname().slice(11)
  const user = useAppSelector((state) => state.value);
  const [auth, setAuth] = useState(false)
  const [action, setAction] = useState("login")

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
    if (!user.fullName) {
      setAuth(true)
    }
    if (pathname === 'event') {
      getEvent()
    } else {
      getData()
    }

  }, [])
  useEffect(() => {
    console.log(repo, "repository");

  }, [repo])



  return (
    <Fragment>
      <DashboardLayout>
        <section className=''>
          {repo && page && <SinglePage pathname={pathname} repo={repo} page={null} />}
          {auth && <div>
            <div className='fixed bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
            <div className='fixed top-5 bottom-5 left-0 overflow-y-auto rounded-md right-0 lg:w-[80%] w-[95%] mx-auto z-20 bg-[#F8F7F4]'>
              <div className='lg:w-[40%] mx-auto shadow-md rounded-md m-3'>
                {(() => {
                  switch (action) {
                    case 'login':
                      return <div className='relative mt-20 p-10'>
                        <h3 className='text-center text-xl my-3'>Login</h3>
                        <Login type='modal' />
                        <div className='text-xs flex justify-center mt-2'>
                          <p className='text-[#052126] mr-2'>Don't have an account? </p>
                          <p onClick={() => setAction("signup")} className='text-[#346771] cursor-pointer'>Sign up</p>
                        </div>
                      </div>
                    case 'signup':
                      return <div className='lg:p-10 p-4'>
                        <h3 className='text-center text-xl my-3'>SignUp</h3>
                        <SignUpComp role='student' action={() => setAction("login")} contact={false} />
                        <div className='text-xs flex justify-center mt-2'>
                          <p className='text-[#052126] mr-2'>Already have an account? </p>
                          <p onClick={() => setAction("login")} className='text-[#346771] cursor-pointer'>Login</p>
                        </div>
                      </div>
                    case 'otp':
                      return <div></div>
                    default:
                      return null
                  }
                })()}

              </div>
            </div>
          </div>}
        </section>
      </DashboardLayout>
    </Fragment >
  );
};


