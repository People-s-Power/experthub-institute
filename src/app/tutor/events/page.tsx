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

const Events = () => {
  const user = useAppSelector((state) => state.value);
  const [events, setEvents] = useState([])

  const [open, setOpen] = useState(false)
  const [resources, setResources] = useState(false)
  const [event, setEvent] = useState(false)
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
    {
      key: '3',
      label: (
        <p onClick={() => setResources(true)}>Resources</p>
      ),
    },

  ];

  const getAllEvents = () => {
    apiService.put(`events/category`, {
      category: user.assignedCourse
    })
      .then(function (response) {
        setEvents(response.data.events)
        console.log(response.data)
      })
  }

  useEffect(() => {
    getAllEvents()
  }, [])
  return (
    <DashboardLayout>
      <div className='p-6'>
        <p className='text-xl mb-3'>Events</p>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <button className='bg-primary p-2 font-medium text-sm rounded-md'>
            + Add training resources
            <DownOutlined />
          </button>
        </Dropdown>
      </div>
      <EventsComp action={() => getAllEvents()} events={events} />

      <AddCourse course={null} open={open} handleClick={() => setOpen(!open)} />
      <AddResources open={resources} handleClick={() => setResources(!resources)} />
      <AddEvents open={event} handleClick={() => setEvent(!event)} course={null} />
    </DashboardLayout>
  );
};

export default Events;