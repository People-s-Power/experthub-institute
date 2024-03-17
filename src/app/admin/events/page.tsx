"use client"

import DashboardLayout from '@/components/DashboardLayout';
import EventsComp from '@/components/EventsComp';
import { useAppSelector } from '@/store/hooks';
import { MenuProps, Dropdown } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import AddCourse from '@/components/modals/AddCourse';
import AddEvents from '@/components/modals/AddEvents';
import AddResources from '@/components/modals/AddResources';

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
    axios.get(`events/all`)
      .then(function (response) {
        setEvents(response.data.events.reverse())
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
      <EventsComp events={events} />

      <AddCourse course={null} open={open} handleClick={() => setOpen(!open)} />
      <AddResources open={resources} handleClick={() => setResources(!resources)} />
      <AddEvents open={event} handleClick={() => setEvent(!event)} course={null} />
    </DashboardLayout>
  );
};

export default Events;