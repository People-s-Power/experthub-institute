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
import { CourseType } from '@/types/CourseType';
import AddEvents from '@/components/modals/AddEvents';
import CategoryModal from '@/components/modals/CategoryModal';
import Notice from '@/components/modals/Notice';
import apiService from '@/utils/apiService';

const adminDashboard = () => {
  const user = useAppSelector((state) => state.value);
  const [open, setOpen] = useState(false)
  const [event, setEvent] = useState(false)
  const [resources, setResources] = useState(false)
  const [category, setCategory] = useState(false)
  const [notice, setNotice] = useState(false)
  const [graduates, setGraduates] = useState<UserType[]>([])

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <p onClick={() => setOpen(true)} >Courses</p>
      ),
    },
    {
      key: '2',
      label: (
        <p onClick={() => setEvent(true)}>Events</p>
      ),
    },
    // {
    //   key: '3',
    //   label: (
    //     <p onClick={() => setResources(true)}>Resources</p>
    //   ),
    // },
    {
      key: '4',
      label: (
        <p onClick={() => setCategory(true)}>Add Category</p>
      ),
    },
    {
      key: '4',
      label: (
        <p onClick={() => setNotice(true)}>Send Notice</p>
      ),
    },
  ];
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [tutors, setTutors] = useState([])


  const getCourses = async () => {
    apiService.get("courses/all")
      .then(function (response) {
        setCourses(response.data.courses.reverse())
        console.log(response.data)
      })
  }
  const getStudents = () => {
    apiService.get('user/students')
      .then(function (response) {
        setStudents(response.data.students)
        // console.log(response.data)
      })
  }

  const getGraduates = () => {
    apiService.put('user/graduate')
      .then(function (response) {
        setGraduates(response.data.students)
        // console.log(response.data)
      })
  }

  const getTutors = () => {
    apiService.get('user/instructors')
      .then(function (response) {
        setTutors(response.data.instructors)
        // console.log(response.data)
      })
  }

  useEffect(() => {
    getCourses()
    getStudents()
    getTutors()
    getGraduates()
  }, [])
  return (
    <DashboardLayout>
      <section className='p-4 lg:flex justify-between'>
        <StatCard title='Total No. of Courses' count={courses.length} bg='#27C2D6' img='clock-line' />
        <StatCard title='Total No. of Admissions' count={students.length} bg='#DC9F08' img='ic_outline-assessment' />
        <StatCard title='Graduates/Experts' count={graduates.length} bg='#53C48C' img='game-icons_progression' />
        <StatCard title='Training Providers' count={tutors.length} bg='#7E34C9' img='ph_chalkboard-teacher' />
      </section>
      <section className='m-2 p-3 shadow-md'>
        <div className='text-sm lg:flex justify-between'>
          <div className='flex justify-between lg:w-[40%]'>
            <p className='my-auto'>All Courses</p>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <button className='bg-primary p-2 font-medium text-sm rounded-md'>
                + Add training resources
                <DownOutlined />
              </button>
            </Dropdown>
          </div>
          <Link href={'/admin/courses'}><p className='text-[#DC9F08]'>VIEW ALL</p></Link>
        </div>
        <div className='lg:flex flex-wrap justify-between'>
          {
            courses.length >= 1 ?
              courses.slice(0, 6).map((course: CourseType, index) => <div key={index} className='lg:w-[32%]'> <CoursesCard getCourse={() => getCourses()} course={course} /></div>
              ) : <div>No course yet!</div>
          }
        </div>
      </section>
      <AddCourse course={null} open={open} setOpen={setOpen} handleClick={() => setOpen(!open)} />
      {/* <AddResources open={resources} handleClick={() => setResources(!resources)} /> */}
      <AddEvents setOpen={setEvent} open={event} handleClick={() => setEvent(!event)} course={null} />
      <CategoryModal open={category} category={null} handleClick={() => setCategory(false)} />
      <Notice open={notice} handleClick={() => setNotice(false)} />
    </DashboardLayout>
  );
};

export default adminDashboard;