import { CourseType } from '@/types/CourseType';
import { notification } from 'antd';
import axios from 'axios';
import { error } from 'console';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';

const AddResources = ({ open, handleClick }: { open: boolean, handleClick: any }) => {
  const uploadRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<FileList | null>()
  const [title, setTitle] = useState("")
  const [about, setAbout] = useState("")
  const [privacy, setPrivacy] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [assignedCourse, setAssignedCourse] = useState("")
  const [api, contextHolder] = notification.useNotification();
  const [courses, setCourses] = useState([])

  const getCourses = () => {
    axios.get("courses/all")
      .then(function (response) {
        setCourses(response.data.courses)
        // console.log(response.data)
      })
  }

  useEffect(() => {
    getCourses()
  }, [])
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = e.target.files
    setFile(e.target.files)

    const reader = new FileReader()
    if (files && files.length > 0) {

      reader.readAsDataURL(files[0])
      reader.onloadend = () => {
        if (reader.result) {
          // const type = files[0].name.substr(files[0].name.length - 3)
          setImage(reader.result as string)
        }
      }
    }
  }

  const formattedOptions = courses.map((option: CourseType) => ({ value: option.studentId, label: option.title }));


  const add = () => {
    if (title && about && websiteUrl) {
      setLoading(true)
      const formData = new FormData()
      file && formData.append("image", file[0])
      formData.append("title", title)
      formData.append("aboutCourse", about)
      formData.append("privacy", privacy)
      formData.append("websiteUrl", websiteUrl)
      formData.append("assignedCourse", assignedCourse)


      axios.post(`resources/add-new`,
        formData
      )
        .then(function (response) {
          console.log(response.data)
          setLoading(false)
          handleClick()
        }).catch(error => {
          api.open({
            message: error.response.data.message
          });
          setLoading(false)
        })
    } else {
      api.open({
        message: "Please fill all fields!"
      });
    }
  }

  return (
    open && <div>
      <div onClick={() => handleClick()} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
      <div className='fixed top-10 bottom-10 left-0 rounded-md overflow-y-auto right-0 lg:w-[50%] w-[95%] mx-auto z-20 bg-[#F8F7F4]'>
        <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
          <p className='font-medium'>Add Resources</p>
          <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
        </div>
        <div className='lg:p-10 p-4'>
          {contextHolder}
          <div>
            <p className='text-sm font-medium my-1'>Resource Image</p>
            {image ? <img onClick={() => uploadRef.current?.click()} src={image} className='w-full h-40' alt="" /> :
              <button className='border border-[#1E1E1ED9] p-2 my-1 rounded-md font-medium w-full' onClick={() => uploadRef.current?.click()}>
                <img src="/images/icons/upload.svg" className='w-8 mx-auto' alt="" />
                <p> Add course</p></button>}
          </div>
          <div className='flex my-1'>
          </div>
          <input
            onChange={handleImage}
            type="file"
            name="identification"
            accept="image/*"
            ref={uploadRef}
            hidden
            multiple={false}
          />

          <div className='flex justify-between my-1'>
            <div className='w-full'>
              <label className='text-sm font-medium my-1'>Title of Resources</label>
              <input onChange={e => setTitle(e.target.value)} value={title} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
            </div>
            {/* <div className='w-[48%]'>
              <label className='text-sm font-medium my-1'>Privacy</label>
              <select onChange={e => setPrivacy(e.target.value)} value={privacy} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                <option value=""></option>
              </select>
            </div> */}
          </div>
          <div className='my-1'>
            <label className='text-sm font-medium my-1'>Assign Course</label>
            <Select
              isMulti
              options={formattedOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(e: any) => { setAssignedCourse(e) }}
            />
          </div>
          <div className='my-1'>
            <label className='text-sm font-medium my-1'>Website Url/link</label>
            <input onChange={e => setWebsiteUrl(e.target.value)} value={websiteUrl} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
          </div>
          <div className='my-1'>
            <label className='text-sm font-medium my-1'>About course</label>
            <textarea onChange={e => setAbout(e.target.value)} value={about} className='border rounded-md border-[#1E1E1ED9] w-full h-32 p-2 bg-transparent'></textarea>
          </div>
          <div>
            <p className='text-sm my-4'>By uploading you agree that this course is a product of you
              and not being forged<input className='ml-2' type="checkbox" /></p>
            <div className='flex'>
              <button onClick={() => add()} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'>{loading ? 'loading...' : 'Add Resource'}</button>
              <button onClick={() => handleClick()} className='mx-4'>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddResources;