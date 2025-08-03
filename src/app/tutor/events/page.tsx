"use client"

import DashboardLayout from '@/components/DashboardLayout';
import EventsComp from '@/components/EventsComp';
import { useAppSelector } from '@/store/hooks';
import { MenuProps, Dropdown } from 'antd';
import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import AddCourse from '@/components/modals/AddCourse';
import AddEvents from '@/components/modals/AddEvents';
import AddResources from '@/components/modals/AddResources';
import apiService from '@/utils/apiService';
import GoPremuim from '@/components/modals/GoPremuium';
import { isActionChecked } from '@/utils/checkPrivilege';

const Events = () => {
  const user = useAppSelector((state) => state.value);
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [showPremuim, setShowPremuim] = useState(false)

  const [open, setOpen] = useState(false)
  const [resources, setResources] = useState(false)
  const [event, setEvent] = useState(false)
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

  const getAllEvents = () => {
    apiService.get(`events/author/${user.id}`)
      .then(function (response) {
        setEvents(response.data.events)
        setFilteredEvents(response.data.events)
        console.log(response.data, 'name of yhem')
      })
  }

  const filterEvents = (filterType: string) => {
    setSelectedFilter(filterType)
    if (filterType === "all") {
      setFilteredEvents(events)
    } else {
      const filtered = events.filter((event: any) => 
        event.type?.toLowerCase() === filterType.toLowerCase() || 
        event.mode?.toLowerCase() === filterType.toLowerCase()
      )
      setFilteredEvents(filtered)
    }
  }

  const filterItems: MenuProps['items'] = [
    {
      key: 'all',
      label: (
        <p onClick={() => filterEvents("all")}>All Events</p>
      ),
    },
    {
      key: 'conference',
      label: (
        <p onClick={() => filterEvents("conference")}>Conference</p>
      ),
    },
    {
      key: 'seminar',
      label: (
        <p onClick={() => filterEvents("seminar")}>Seminar</p>
      ),
    },
    {
      key: 'workshop',
      label: (
        <p onClick={() => filterEvents("workshop")}>Workshop</p>
      ),
    },
    {
      key: 'webinar',
      label: (
        <p onClick={() => filterEvents("webinar")}>Webinar</p>
      ),
    },
  ];

  useEffect(() => {
    getAllEvents()
  }, [])
  return (
    <DashboardLayout>
      <div className='p-6'>
        <div className='flex justify-between items-center mb-3'>
          <p className='text-xl'>Events</p>
          <div className='flex gap-3'>
            <Dropdown menu={{ items: filterItems }} trigger={["click"]}>
              <button className='bg-gray-100 border border-gray-300 p-2 font-medium text-sm rounded-md flex items-center gap-2'>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-funnel"
                  viewBox="0 0 16 16"
                >
                  <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
                </svg>
                Filter by: {selectedFilter === "all" ? "All Events" : selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
                <DownOutlined />
              </button>
            </Dropdown>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <button className='bg-primary p-2 font-medium text-sm rounded-md'>
                + Add training resources
                <DownOutlined />
              </button>
            </Dropdown>
          </div>
        </div>
      </div>
      <EventsComp action={() => getAllEvents()} events={filteredEvents} />

      <AddCourse course={null} setOpen={setOpen} open={open} handleClick={() => setOpen(!open)} />
      {/* <AddResources open={resources} handleClick={() => setResources(!resources)} /> */}
      <AddEvents setOpen={setEvent} setShowPremium={setShowPremuim} open={event} handleClick={() => setEvent(!event)} course={null} />
      <GoPremuim show={showPremuim} setShow={setShowPremuim} />

    </DashboardLayout>
  );
};

export default Events;