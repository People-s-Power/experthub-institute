"use client"

import DashboardLayout from '@/components/DashboardLayout';
import React, { useState, useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import AddCourse from '@/components/modals/AddCourse';
import AddResources from '@/components/modals/AddResources';
import CoursesCard from '@/components/cards/CoursesCard';
import Slider from 'react-slick';
import { CourseType } from '@/types/CourseType';
import Link from 'next/link';
import AddEvents from '@/components/modals/AddEvents';
import CategoryModal from '@/components/modals/CategoryModal';
import apiService from '@/utils/apiService';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const courses = () => {
  const [courses, setCourses] = useState<CourseType | []>([])
  const [all, setAll] = useState<CourseType | []>([])
  const [pending, setPending] = useState<CourseType | []>([])
  const [open, setOpen] = useState(false)
  const [resources, setResources] = useState(false)
  const [event, setEvent] = useState(false)
  const [category, setCategory] = useState(false)

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
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
  ];

  const getCourses = async () => {
    apiService.get("courses/all/category")
      .then(function (response) {
        setCourses(response.data.allCourse)
        setAll(response.data.allCourse)
        console.log(response.data)
      })
  }

  const getPendngCourses = () => {
    apiService.get("courses/unapproved")
      .then(function (response) {
        setPending(response.data.courses)
        console.log(response.data)
      })
  }


  useEffect(() => {
    // getPendngCourses()
    getCourses()
  }, [])

  const search = (value: string) => {
    const results = all.filter((obj: CourseType) => obj.category.toLowerCase().includes(value.toLowerCase()));
    setCourses(results)
  }

  return (
    <DashboardLayout>
      <section className='p-4'>
        <div className='flex justify-between'>
          <div>
            <p className='text-xl'>All Course</p>
            <p className='text-sm'>You will never go wrong with our course</p>
          </div>
          <div className=''>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <button className='bg-primary p-2 font-medium text-sm rounded-md'>
                + Add training resources
                <DownOutlined />
              </button>
            </Dropdown>
          </div>
          <div></div>
        </div>
        <div className='lg:w-[55%] w-full flex relative mb-4'>
          <input onChange={e => search(e.target.value)} type="text" className='pl-10 p-2 w-full rounded-md border border-[#1E1E1E8A] bg-transparent' placeholder='Search' />
          <img className='absolute top-2 w-6 left-2' src="/images/icons/search.svg" alt="" />
        </div>
        <div className='lg:w-[97%] mx-auto'>
          {
            courses.map((course: { category: string; courses: CourseType; }, index: number) => <div key={index}>
              <p className='font-bold mt-4'>{course.category}</p>
              <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] my-2'>
                <Slider {...settings}>
                  {course.courses.reverse().map((item: CourseType) => <div key={item._id} className='p-1 w-full'>
                    <CoursesCard getCourse={() => getCourses()} course={item} />
                  </div>)}
                </Slider>
              </div>
            </div>)
          }
        </div>
        {/* <div className='my-6'>
          <p className='text-xl'>Courses Under Review</p>
          {pending.length >= 1 ? <div>
            <Slider {...settings}>
              {pending.map((item: CourseType, index: React.Key | null | undefined) => <div key={index} className='p-1 w-full'>
                <div className='border my-4 border-[#1E1E1E59] p-4 rounded-md flex justify-between'>
                  {typeof item.thumbnail === 'string' ? '' : item.thumbnail.type === 'image' ? <img className='rounded-md w-1/2 h-32 object-cover shadow-[26px_0px_32.099998474121094px_0px_#FDC3324D]' src={item.thumbnail.url} alt="" /> :
                    <div className='rounded-md w-1/2 h-32 object-cover shadow-[26px_0px_32.099998474121094px_0px_#FDC3324D]'>
                      <video
                        src={item.thumbnail.url}
                        width="100"
                        autoPlay muted
                        className="embed-responsive-item w-full object-cover h-full"
                      >
                        <source src={item.thumbnail.url} type="video/mp4" />
                      </video>
                    </div>}
                  <div className='pl-10 w-full'>
                    <h4 className='text-xl my-2 font-medium'>{item.title}</h4>
                    <p className='text-xs my-3'>{item.about.substring(0, 30)}</p>
                    <Link href={`/admin/${item._id}?page=${item.type}`}>
                      <button className='p-2 px-6 rounded-sm bg-primary'>Publish</button>
                    </Link>
                  </div>
                </div>
              </div>)}
            </Slider>
          </div> : <div>No courses to review</div>}
        </div> */}
        <AddCourse course={null} open={open} setOpen={setOpen} handleClick={() => setOpen(!open)} />
        {/* <AddResources open={resources} handleClick={() => setResources(!resources)} /> */}
        <AddEvents setOpen={setEvent} open={event} handleClick={() => setEvent(!event)} course={null} />
        <CategoryModal open={category} category={null} handleClick={() => setCategory(false)} />

      </section >
    </DashboardLayout >
  );
};

export default courses;
