"use client"

import CoursesCard from '@/components/cards/CoursesCard';
import DashboardLayout from '@/components/DashboardLayout';
import RecommendedCard from '@/components/cards/RecommendedCard';
import StatCard from '@/components/cards/StatCard';
import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import AddCourse from '@/components/modals/AddCourse';
import AddResources from '@/components/modals/AddResources';
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import { UserType } from '@/types/UserType';
import AddEvents from '@/components/modals/AddEvents';
import apiService from '@/utils/apiService';
import AddCourseInterests from '@/components/modals/AddCourseInterests';
import GoPremuim from '@/components/modals/GoPremuium';
import { CourseType } from '@/types/CourseType';
import { isActionChecked } from '@/utils/checkPrivilege';


const tutor = () => {
  const user = useAppSelector((state) => state.value);
  const [open, setOpen] = useState(false)
  const [resources, setResources] = useState(false)
  const [event, setEvent] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
  const [showPremuim, setShowPremuim] = useState(false)

  const [students, setStudents] = useState([])
  const [graduates, setGraduates] = useState<UserType[]>([])
  const [active, setActive] = useState("")


  // console.log(user)

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <p onClick={() => {
          if (isActionChecked("Create course", user.privileges)) {
            setOpen(true);
          }
        }} >Courses</p>
      ),
    },
    {
      key: '2',
      label: (
        <p onClick={() => {
          if (isActionChecked("Create Event", user.privileges)) {
            setEvent(true);
          }
        }}>Events</p>
      ),
    },
    // {
    //   key: '3',
    //   label: (
    //     <p onClick={() => setResources(true)}>Resources</p>
    //   ),
    // },

  ];
  const [courses, setCourses] = useState([])

  const getStudents = () => {
    apiService.put('user/mystudents', {
      course: user.assignedCourse
    })
      .then(function (response) {
        setStudents(response.data.students)
        // console.log(response.data)
      })
  }

  const getGraduates = () => {
    apiService.put('user/mygraduate', {
      course: user.assignedCourse
    })
      .then(function (response) {
        setGraduates(response.data.students)
        // console.log(response.data)
      })
  }

  const getCourses = async () => {
    apiService.put(`courses/category/author`, {
      category: user.assignedCourse,
      id: user.id
    })
      .then(function (response) {
        setCourses(response.data.courses)
        console.log(response.data)
      })
  }


  useEffect(() => {
    getCourses()
    getGraduates()
    getStudents()
  }, [])


  return (
    <DashboardLayout>
      {/* <section>
        <div className='p-4 flex justify-between w-full shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38]'>
          <div>
            <p className='font-medium'>Welcome</p>
            <p className='font-bold capitalize'>{user.fullName}</p>
          </div>
          <div className='w-1/2 relative'>
            <input type="text" className='pl-10 p-2 w-full rounded-md border border-[#1E1E1E8A] bg-transparent' placeholder='Search courses, trainer, test etc' />
            <img className='absolute top-2 w-6 left-2' src="/images/icons/search.svg" alt="" />
          </div>
          <div className='flex w-28 justify-between'>
            <div className='p-3 h-10 w-10 my-auto rounded-full shadow-md'>
              <img src="/images/icons/notification.svg" alt="" />
            </div>
            <img className='h-10 w-10 my-auto rounded-full' src={user.profilePicture} alt="" />
          </div>
        </div>
      </section> */}
      <section className='p-4 lg:flex justify-between'>
        <StatCard title='Total No. of Courses' count={courses.length} bg='#27C2D6' img='clock-line' />
        <StatCard title='My Students' count={students.length} bg='#DC9F08' img='ic_outline-assessment' />
        <StatCard title='My Graduates' count={graduates.length} bg='#53C48C' img='game-icons_progression' />
        <StatCard title='My Mentees' count={students.length} bg='#7E34C9' img='ph_chalkboard-teacher' />
      </section>
      <section className='m-2 p-3 shadow-md'>
        <div className='text-sm lg:flex justify-between'>
          <div className='flex justify-between lg:w-[40%]'>
            <p className='my-auto'>Assigned Courses</p>

            <Dropdown menu={{ items }} trigger={["click"]}>
              <button className='bg-primary p-2 font-medium text-sm rounded-md'>
                + Add training resources
                <DownOutlined />
              </button>
            </Dropdown>
          </div>
          <Link href={'/tutor/courses'}><p className='text-[#DC9F08]'>VIEW ALL</p></Link>
        </div>
        <div className='flex'>
          <button onClick={() => setOpenAdd(true)} className='bg-primary p-3 rounded-md'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
          </button>
          <div className='!flex w-full flex-wrap'>
            <p onClick={() => setActive("")} className='m-2 bg-gray cursor-pointer px-2 text-base'>All</p>
            <p onClick={() => setActive(user.assignedCourse)} className='m-2 bg-gray px-2 cursor-pointer text-base'>{user.assignedCourse}</p>
            {user.otherCourse?.map((single: string, index: any) => single.length === 0 ? null : <p key={index} onClick={() => setActive(single)} className='m-2 bg-gray cursor-pointer px-2 text-base'>{single}</p>)}
          </div>
        </div>
        <div className='lg:flex flex-wrap justify-between'>
          {courses.length >= 1 ? courses.slice(0, 6)
            .filter((course: CourseType) => course.category === active || active === "")
            .map((course: CourseType) => <div key={course._id} className='lg:w-[32%]'> <CoursesCard getCourse={() => getCourses()} course={course} /></div>) : <div>No Assigned course!</div>}

        </div>
      </section>
      <AddCourse course={null} setShowPremium={setShowPremuim} open={open} handleClick={() => setOpen(!open)} />
      <GoPremuim show={showPremuim} setShow={setShowPremuim} />

      {/* <AddResources open={resources} handleClick={() => setResources(!resources)} /> */}
      <AddEvents open={event} handleClick={() => setEvent(!event)} course={null} />
      <AddCourseInterests open={openAdd} handleClick={() => setOpenAdd(false)} />
    </DashboardLayout>
  );
};

export default tutor;