"use client"

import CoursesCard from '@/components/cards/CoursesCard';
import DashboardLayout from '@/components/DashboardLayout';
import RecommendedCard from '@/components/cards/RecommendedCard';
import React, { useState } from 'react';
import Slider from 'react-slick';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import AddResources from '@/components/modals/AddResources';
import AddCourse from '@/components/modals/AddCourse';


const courses = () => {
  const [open, setOpen] = useState(false)
  const [resources, setResources] = useState(false)
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true
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
        <p>Materials</p>

      ),
    },
    {
      key: '3',
      label: (
        <p onClick={() => setResources(true)}>Resources</p>
      ),
    },

  ];

  return (
    <DashboardLayout>
      <link
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css"
      />
      <section>
        <div className='p-4 flex justify-between w-full shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38]'>
          <div className='my-auto'>
            <p className='font-bold'>Assigned Courses</p>
          </div>
          <div className='w-1/2 relative'>
            <input type="text" className='pl-10 p-2 w-full rounded-md border border-[#1E1E1E8A] bg-transparent' placeholder='Search courses, trainer, test etc' />
            <img className='absolute top-2 w-6 left-2' src="/images/icons/search.svg" alt="" />
          </div>
          <div className='flex'>
            {/* <div className='p-3 h-10 w-10 my-auto rounded-full shadow-md'>
              <img src="/images/icons/notification.svg" alt="" />
            </div> */}
            <img className='h-10 w-10 my-auto' src="/images/user.png" alt="" />
          </div>
        </div>
      </section>
      <section>
        <div className='flex p-4'>
          <div>
            <p className='font-medium'>Assigned Courses</p>
            <p className='text-sm'>This is the list of courses and modules you
              are taking</p>
          </div>
          <div className='ml-10'>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <button className='bg-primary p-2 font-medium text-sm rounded-md'>
                + Add training resources
                <DownOutlined />
              </button>
            </Dropdown>
          </div>
        </div>
      </section>
      <section className='m-2 p-3'>
        <p className='font-bold text-sm my-2'>Data Analytics</p>
        <div className='flex flex-wrap justify-between'>
          <CoursesCard />
          <CoursesCard />
          <CoursesCard />
        </div>
      </section>
      <section className='m-4 w-[90%]'>
        <p className='font-bold text-sm my-2'>Training Materials</p>
        <div className='flex justify-between'>
          <div className='w-[62%]'>
            <Slider {...settings}>
              <div className=''>
                <div className='p-3 rounded-md bg-white'>
                  <img className='rounded-md w-full' src="/images/card.png" alt="" />
                </div>
                <div className='p-1'>
                  <p className='text-[#DC9F08] font-medium text-sm'>Course by Peoples power</p>
                  <h4 className='text-xl my-3'>Design Systems for Websites
                    with Figma</h4>
                  <p className='text-sm'>Learn how to build and design websites
                    using Figma...</p>
                </div>
              </div>
              <div className=''>
                <div className='p-3 rounded-md bg-white'>
                  <img className='rounded-md w-full' src="/images/card.png" alt="" />
                </div>
                <div className='p-1'>
                  <p className='text-[#DC9F08] font-medium text-sm'>Course by Peoples power</p>
                  <h4 className='text-xl my-3'>Design Systems for Websites
                    with Figma</h4>
                  <p className='text-sm'>Learn how to build and design websites
                    using Figma...</p>
                </div>
              </div>
              <div className=''>
                <div className='p-3 rounded-md bg-white'>
                  <img className='rounded-md w-full' src="/images/card.png" alt="" />
                </div>
                <div className='p-1'>
                  <p className='text-[#DC9F08] font-medium text-sm'>Course by Peoples power</p>
                  <h4 className='text-xl my-3'>Design Systems for Websites
                    with Figma</h4>
                  <p className='text-sm'>Learn how to build and design websites
                    using Figma...</p>
                </div>
              </div>
            </Slider>
          </div>
          <div className='w-[35%] p-4 rounded-md shadow-[0px_2px_4px_0px_#1E1E1E21]'>
            <div className='flex'>
              <img src="/images/icons/ic_outline-event.svg" alt="" />
              <p className='font-medium ml-2 text-lg text-[#DC9F08]'>Events</p>
            </div>
            <div className='my-3'>
              <p className='font-medium'>Peoples Power Affiliate program</p>
              <p className='text-sm my-2'>Hosted by Evans D</p>
              <p className='text-sm my-2'>27 - Aug - 23 / 12:00 PM</p>
              <button className='p-2 border border-[#1E1E1E] w-full rounded-md'>Visit event</button>
            </div>
            <div className='my-3'>
              <p className='font-medium'>Peoples Power Affiliate program</p>
              <p className='text-sm my-2'>Hosted by Evans D</p>
              <p className='text-sm my-2'>27 - Aug - 23 / 12:00 PM</p>
              <button className='p-2 border border-[#1E1E1E] w-full rounded-md'>Visit event</button>
            </div>
          </div>
        </div>
      </section>
      <section className='mx-4 my-8 relative w-[90%]'>
        <img src="/images/resources-bg.png" alt="" />
        <div className='absolute top-0 left-0 right-0'>
          <div className='p-6'>
            <div className='border-b w-[35%] border-[#1E1E1E52]'>
              <p className='font-medium'>Training Resources</p>
              <p className='text-sm my-2'>Added training resources for further studies</p>
            </div>

            <div className='flex justify-between my-10 flex-wrap w-[70%]'>
              <p className='w-[30%] text-sm font-medium my-2'>Product Management</p>
              <p className='w-[30%] text-sm font-medium my-2'>Social Media Management</p>
              <p className='w-[30%] text-sm font-medium my-2'>Project Management</p>
              <p className='w-[30%] text-sm font-medium my-2'>Software Development</p>
              <p className='w-[30%] text-sm font-medium my-2'>SEO/Video editing</p>
              <p className='w-[30%] text-sm font-medium my-2'>Software Development</p>
              <p className='w-[30%] text-sm font-medium my-2'>Data Analysis</p>
              <p className='w-[30%] text-sm font-medium my-2'>Data Analytics</p>
              <p className='w-[30%] text-sm font-medium my-2'>Data Analytics</p>
            </div>
          </div>
        </div>
        <img className='w-52 h-52 absolute -right-10 top-10' src="/images/image_19.png" alt="" />

      </section>
      <section className='m-2 p-3 shadow-md'>
        <div className='text-sm mb-3 flex justify-between'>
          <p className='font-medium text-lg text-base'>Recommended for you</p>
          <p className='text-[#DC9F08] text-sm'>VIEW ALL</p>
        </div>
        <div className='flex flex-wrap justify-between'>
          <RecommendedCard />
          <RecommendedCard />
          <RecommendedCard />
        </div>
      </section>
      <AddCourse open={open} handleClick={() => setOpen(!open)} />
      <AddResources open={resources} handleClick={() => setResources(!resources)} />
    </DashboardLayout>
  );
};

export default courses;