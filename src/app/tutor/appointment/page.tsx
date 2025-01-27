"use client"

import DashboardLayout from '@/components/DashboardLayout';
import Availability from '@/components/modals/AvailabilityModel';
import AppointmentView from '@/components/View/AppointmentView';
import { useAppSelector } from '@/store/hooks';
import { isActionChecked } from '@/utils/checkPrivilege';
import React, { useState } from 'react';

const appointment = () => {
  const [availability, setAvailability] = useState(false)
  const user = useAppSelector((state) => state.value);

  return (
    <DashboardLayout>
      <main>
        <div className='p-4'>
          <button onClick={() => {
            if (isActionChecked("Create and set appointment", user.privileges)) {
              setAvailability(true);
            }
          }} className='bg-[#FDC332] p-3 px-6 rounded-md'>Update Availability</button>
        </div>
        {
          isActionChecked("Handle appointments", user.privileges) ?
            <AppointmentView /> : <p className='p-4'>You do not have the permission to handle Appointments</p>
        }
        <Availability open={availability} handleClick={() => setAvailability(false)} />
      </main>
    </DashboardLayout>
  );
};

export default appointment;