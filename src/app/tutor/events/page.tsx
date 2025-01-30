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
        console.log(response.data, 'name of yhem')
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
      {/* <AddResources open={resources} handleClick={() => setResources(!resources)} /> */}
      <AddEvents setShowPremium={setShowPremuim} open={event} handleClick={() => setEvent(!event)} course={null} />
      <GoPremuim show={showPremuim} setShow={setShowPremuim} />

    </DashboardLayout>
  );
};

export default Events;