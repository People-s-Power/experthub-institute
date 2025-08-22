import React, { useState } from 'react';
import { Dropdown, MenuProps } from 'antd';
import { ResourceType } from '@/types/ResourceType';
import AddResources from '../modals/AddResources';
import { useAppSelector } from '@/store/hooks';
import apiService from '@/utils/apiService';

const ResourcesCard = ({ material, getAll }: { material: ResourceType, getAll: any }) => {
  const [edit, setEdit] = useState(false)
  const user = useAppSelector((state) => state.value);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <p onClick={() => setEdit(true)} >Edit Resource</p>
      )
    },
    {
      key: '1',
      label: (
        <p onClick={() => setDelete()} >Delete Resource</p>
      )
    },
  ]



  const setDelete = () => {
    apiService.delete(`resources/delete/${material._id}`)
      .then(function (response) {
        console.log(response.data)
        getAll()
      })
  }
  const formatUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <div className="p-2 lg:w-[32%] w-full">
      <div className="transition-shadow duration-200 shadow-md hover:shadow-xl rounded-lg bg-white">
        <a href={formatUrl(material.websiteUrl)} target="_blank" rel="noopener noreferrer">
          <div className="rounded-t-lg overflow-hidden h-44 flex items-center justify-center bg-gray-100">
            <img className="object-cover w-full h-full" src={material.image} alt={material.title} />
          </div>
        </a>
        <div className="p-4 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-primary mb-1 truncate" title={material.title}>{material.title}</h4>
              <p className="text-sm text-gray-700 mb-2 line-clamp-2">{material.aboutCourse}</p>
              {(user.role === 'admin' || user.role === 'tutor') && material.assignedCourseTitle && (
                <p className="text-xs text-gray-500 font-medium mt-1">Course: <span className="text-gray-800">{material.assignedCourseTitle}</span></p>
              )}
            </div>
            {(user.role === 'admin' || user.role === 'tutor') && (
              <Dropdown menu={{ items }} trigger={["click"]}>
                <button className="bg-transparent p-1 rounded hover:bg-gray-100">
                  <img className="w-5 h-5" src="/images/icons/edit.svg" alt="Edit" />
                </button>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
      <AddResources open={edit} handleClick={() => setEdit(false)} material={material} course={material.assignedCourse} />
    </div>
  );
};

export default ResourcesCard;