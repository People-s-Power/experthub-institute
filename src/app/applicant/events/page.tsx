"use client"

import DashboardLayout from '@/components/DashboardLayout';
import EventsComp from '@/components/EventsComp';
import UserEvent from '@/components/cards/UserEvent';
import { useAppSelector } from '@/store/hooks';
import { CourseType } from '@/types/CourseType';
import apiService from '@/utils/apiService';
import { MenuProps, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

const Events = () => {
  const user = useAppSelector((state) => state.value);
  const [active, setActive] = useState("all")
  const [events, setEvents] = useState<CourseType[]>([])
  const [allEvents, setAll] = useState<CourseType[]>([])
  const [filteredEvents, setFilteredEvents] = useState<CourseType[]>([])
  const [myEvent, setMyEvent] = useState<CourseType[]>([])
  const [pastEvent, setPastEvent] = useState<CourseType[]>([])
  const [selectedType, setSelectedType] = useState("all")

  const getAllEvents = () => {
    apiService.get(`events/category/${user.id}`)
      .then(function (response) {
        console.log(response.data, 'cat events')
        setAll(response.data.events)
        setFilteredEvents(response.data.events)
      })
  }

  const getCategories = () => {
    // Removed category filtering functionality
  }

  const filterByType = (typeName: string) => {
    setSelectedType(typeName)
    if (typeName === "all") {
      setFilteredEvents(allEvents)
    } else {
      const filtered = allEvents.filter((event: CourseType) => 
        event.type?.toLowerCase() === typeName.toLowerCase()
      )
      setFilteredEvents(filtered)
    }
  }

  const typeFilterItems: MenuProps['items'] = [
    {
      key: 'all',
      label: (
        <p onClick={() => filterByType("all")}>All Types</p>
      ),
    },
    {
      key: 'conference',
      label: (
        <p onClick={() => filterByType("conference")}>Conference</p>
      ),
    },
    {
      key: 'seminar',
      label: (
        <p onClick={() => filterByType("seminar")}>Seminar</p>
      ),
    },
    {
      key: 'workshop',
      label: (
        <p onClick={() => filterByType("workshop")}>Workshop</p>
      ),
    },
    {
      key: 'webinar',
      label: (
        <p onClick={() => filterByType("webinar")}>Webinar</p>
      ),
    },
  ];

  const getMyEvents = () => {
    apiService.get(`events/my-events/${user.id}`)
      .then(function (response) {
        // console.log(response.data)
        setMyEvent(response.data.enrolledCourses.reverse())
      }).catch(e => {
        console.log(e);

      })
  }

  const isEnrolled = (enroll: any) => {
    if (enroll.id === user.id) {
      return true
    }
    return false
  }


  function hasDatePassed(course: CourseType) {
    if (course.type === "online" || course.type === "offline") {
      const currentDate = new Date();
      const compareDate = new Date(course.startDate);
      // console.log(currentDate, compareDate)

      // Compare the target date with the current date
      if (currentDate > compareDate) {
        return true
      }
      return false;
    }
    return true
  }

  useEffect(() => {
    getAllEvents()
    getMyEvents()
  }, [])
  return (
    <DashboardLayout>
      <div className='flex px-4 gap-5 justify-between w-[40%] text-lg'>
        <div onClick={() => setActive("all")} className={`${active === "all" ? 'border-b-2 border-primary' : 'cursor-pointer'} whitespace-nowrap`}>Recommended for you</div>
        <div onClick={() => setActive("my")} className={`${active === "my" ? 'border-b-2 border-primary' : 'cursor-pointer'} whitespace-nowrap`}>My Events</div>
        {/* <div onClick={() => setActive("past")} className={active === 'past' ? "border-b-2 border-primary" : "cursor-pointer"}>Past Events</div> */}
        {/* <div>ALl</div> */}

      </div>
      {active === "all" && (
        <div className='p-4 flex justify-end lg:-mt-10'>
          <Dropdown menu={{ items: typeFilterItems }} trigger={["click"]}>
            <button className='bg-gray-100 border border-gray-300 p-2 font-medium text-sm rounded-md flex items-center gap-2'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-tag"
                viewBox="0 0 16 16"
              >
                <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0"/>
                <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1m0 5.586 7 7L13.586 9l-7-7H2z"/>
              </svg>
              Filter: {selectedType === "all" ? "All Types" : selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
              <DownOutlined />
            </button>
          </Dropdown>
        </div>
      )}
      <div className='p-6'>

        {(() => {
          switch (active) {
            case 'all':
              return <div className='flex flex-wrap justify-between mt-3'>
                {filteredEvents.length > 0 ? filteredEvents.filter((event: CourseType) => !event.enrolledStudents.some(userIn => userIn._id === user.id)).map((event: CourseType) => event.enrolledStudents.map(single => (single)) ? <UserEvent handleSwitch={() => { getAllEvents(); getMyEvents(); setActive("my") }} type="enroll" key={event._id} event={event} /> : null) : <div className=''>No recommended events!</div>}
              </div>
            case 'my':
              return <div className='flex flex-wrap justify-between mt-3'>
                {myEvent.map((event: CourseType) => <UserEvent type='view' key={event._id} event={event} />)}
              </div>
            case 'past':
              return <div className='flex flex-wrap justify-between mt-3'>
                {pastEvent.map((event: CourseType) => <UserEvent key={event._id} event={event} />)}
              </div>
            case 'lost':
              return <div></div>
            default:
              return null
          }
        })()}
      </div>
      {/* <EventsComp events={events} /> */}
    </DashboardLayout>
  );
};

export default Events;