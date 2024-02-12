"use client"

import React from 'react';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { usePathname } from 'next/navigation';

// const items: MenuProps['items'] = [
//   {
//     label: 'Send Assessment',
//     key: '1',
//   },
//   {
//     label: 'Send Message',
//     key: '2',
//   },
//   {
//     label: 'Assign Course',
//     key: '3',
//   },
//   {
//     label: 'View Account',
//     key: '4',
//   },
// ];




const AdmissionCard = ({ tutor, role }: { tutor: any, role: string }) => {
  const pathname = usePathname()
  const items: MenuProps['items'] = [
    ...(role === 'students' ? [{
      label: 'Send Assessment',
      key: '1',
    },
    {
      label: 'Send Message',
      key: '2',
    },
    {
      label: 'Assign Course',
      key: '3',
    },
    {
      label: 'View Account',
      key: '4',
    },
    ...(pathname.includes('admin') ? [{
      label: 'Delete user',
      key: '5',
    },
    {
      label: 'Block Student',
      key: '6',
    },
    {
      label: 'Pay Fee',
      key: '7',
    }] : [])] : [
      {
        label: 'View Account',
        key: '1',
      },
      {
        label: 'Make an Expert',
        key: '2',
      },
      {
        label: 'Assign Course',
        key: '3',
      },
      {
        label: 'Delete user',
        key: '4',
      },
      {
        label: 'Block Tutor',
        key: '5',
      },
    ])

  ];

  return (
    <div>
      <div className='flex border border-[#1E1E1E80] p-3 rounded-md my-3 flex justify-between'>
        <img src={tutor.profilePicture ? tutor.profilePicture : "/images/user.png"} className='w-10 h-10 rounded-full object-cover' alt="" />
        <div className='w-52'>
          <p className='font-medium text-sm capitalize'>{tutor.fullname}</p>
          <p className='text-xs'>{tutor.email}</p>
        </div>
        <div className='w-52'>
          <p className='text-xs'>Course</p>
          <p className=' text-sm'>{tutor.course}</p>
        </div>
        <p className='text-sm text-[#0BC01E] my-auto font-medium'>Completed</p>
        {pathname.includes("applicant") ? <button className='text-primary text-sm'>Send Message</button> : <div className='my-auto'>
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
          >
            <img className='w-4 h-4 my-auto cursor-pointer' src="/images/icons/edit-icon.svg" alt="" />
          </Dropdown>
        </div>}

      </div>
    </div>
  );
};

export default AdmissionCard;