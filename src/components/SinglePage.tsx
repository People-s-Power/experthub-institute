import { CourseType } from '@/types/CourseType';
import React, { useEffect, useState } from 'react';
import FileDownload from '@/components/FileDownload'
import { useAppSelector } from '@/store/hooks';
import UploadVideo from './modals/UploadVideo';
import { ResourceType } from '@/types/ResourceType';
import ImageViewer from './ImageViewer';
import ResourcesCard from './cards/ResourcesCard';
import apiService from '@/utils/apiService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const SinglePage = ({ repo, pathname, page }: { repo: CourseType, pathname: any, page: any }) => {
  const [indexCount, setIndexCount] = useState(0)
  const [videos, setVideos] = useState(repo.videos)
  const [resources, setResources] = useState([])
  const user = useAppSelector((state) => state.value);

  const setNext = () => {
    if (videos.length - 1 === indexCount) {
      return
    }
    const count = indexCount
    setIndexCount(count + 1)

  }

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }

  const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(new Date);


  const handleDownload = () => {
    // setLoading(true);

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1000, 700]
    });

    // Add background image
    doc.addImage('/images/cert.png', 'JPEG', 0, 0, 1000, 700);

    // Add Certificate Title
    // doc.setFontSize(48);
    // doc.setTextColor('#333');
    // doc.text('Certificate of Completion', 500, 150, { align: 'center' });

    // Add Recipient's Name
    // doc.setFontSize(36);
    // doc.text(`This is to certify that`, 500, 0, { align: 'center' });

    doc.setFontSize(70);
    doc.setTextColor('#FDC332');
    doc.text(String(user.fullName.toLocaleUpperCase()), 600, 360, { align: 'center' });

    // Add Course Name
    // doc.setFontSize(36);
    // doc.setTextColor('#333');
    // doc.text(`has successfully completed the`, 500, 350, { align: 'center' });

    doc.setFontSize(30);
    doc.setTextColor('#2F2F2F');
    doc.text(repo.title, 600, 455, { align: 'center' });

    // Add Date
    doc.setFontSize(25);
    doc.setTextColor('#2F2F2F');
    doc.text(` ${formattedDate}.`, 650, 255);



    doc.setFontSize(25);
    doc.setTextColor('#2F2F2F');
    doc.text(` ${repo.instructorName}.`, 715, 635);

    // Add Signature Image (optional)
    // doc.addImage('/path/to/signature-image.png', 'PNG', 400, 500, 200, 100);

    // Add Issuer's Name (optional)
    // doc.setFontSize(24);
    // doc.text('Issuer Name', 500, 650, { align: 'center' });

    // Save the PDF
    doc.save(`${user.fullName}_certificate.pdf`);

    // setLoading(false);
  };

  const getAssigned = () => {
    apiService.get(`resources/all/${repo._id}`)
      .then(function (response) {
        console.log(response.data)
        setResources(response.data.resource)
      })
  }

  useEffect(() => {
    getAssigned()
  }, [])

  return (
    <div>
      {/* <button className='p-3 rounded-md bg-[#FDC332]' onClick={() => handleDownload()}>Download</button> */}
      {(() => {
        switch (pathname) {
          case 'video':
            return <div className='p-6 lg:flex'>
              <div className='w-full'>
                {videos.map((video, index) => <div>
                  {index === indexCount ? <video key={index} controls className="w-full">
                    <source src={video.videoUrl} type="video/mp4" />
                  </video> : null}
                </div>)}


                <div className='lg:flex my-4 justify-between'>
                  <div className='flex'>
                    <img className='w-6 h-6 my-auto rounded-full' src={repo?.instructorImage || "/images/user.png"} alt="" />
                    <p className='my-auto ml-3'>A course by {repo?.instructorName}</p>
                  </div>

                  {indexCount === videos.length - 1 ? <button className='p-3 rounded-md bg-[#FDC332]' onClick={() => handleDownload()}>Download Certificate</button> : <button onClick={() => setNext()} className='text-[#DC9F08] sm:my-3 border border-[#DC9F08] rounded-sm p-1 px-4'>Next Chapter</button>}
                </div>
                <div>
                  <p className='text-lg lg:hidden sm:block font-medium mb-2'>Title: {repo?.title}</p>
                  <p className='my-2'>{repo?.about}</p>
                </div>
              </div>
              <div className=' lg:w-[40%] lg:px-4 '>
                <p className='text-lg sm:hidden lg:block font-medium mb-2'>Title: {repo?.title}</p>
                <div className='p-2 border border-[#1E1E1E82] rounded-md'>
                  {repo?.videos.map((video, index) => <div key={video._id} className='flex my-3'>
                    {
                      indexCount === index ? <img src="/images/icon-2.png" alt="" /> : indexCount > index ?
                        <img src="/images/icon-1.png" alt="" /> : <img className='cursor-pointer' onClick={() => setIndexCount(index)} src="/images/icon-3.png" alt="" />
                    }
                    <p className='font-medium my-auto ml-3'>{video.title}</p>
                  </div>)}
                </div>
                {/* {user.role !== "student" && <button className='bg-primary px-4 p-2 rounded-md my-4'>Add Videos</button>} */}
                {page !== null && <UploadVideo id={page} />}
              </div>
            </div>;
          case 'pdf':
            return <div className='p-6 lg:w-[60%] mx-auto'>
              {repo.thumbnail && <ImageViewer control={true} image={repo.thumbnail} />}
              <h1 className='font-bold text-2xl my-2'>{repo?.title}</h1>
              <p>{repo?.about}</p>
              <FileDownload file={repo?.file} />
            </div>;
          case 'offline':
            return <div className='p-6 lg:w-[60%] mx-auto'>
              {repo.thumbnail && <ImageViewer control={true} image={repo.thumbnail} />}
              <h1 className='font-bold text-2xl my-2'>{repo?.title}</h1>
              <p>{repo?.about}</p>
              <p><span className='font-bold'>Location:</span> {repo?.location}</p>
              <p> <span className='font-bold'>Room:</span> {repo?.room}</p>
              {repo?.days && <>
                <div className='my-3 font-bold'>Weekly Hours</div>
                {repo?.days.map((day: any) => day.checked && <div className='flex w-1/2 justify-between'>
                  <p>{day.day}</p>
                  <p>{day.startTime}</p>
                  <p>-</p>
                  <p>{day.endTime}</p>
                </div>)}</>}
            </div>;
          case 'online':
            return <div className='p-6 lg:w-[60%] mx-auto'>
              {repo.thumbnail && <ImageViewer control={true} image={repo.thumbnail} />}
              <h1 className='font-bold text-2xl my-2'>{repo?.title}</h1>
              <p>{repo?.about}</p>
            </div>;
          case 'event':
            return <div className='p-6 lg:w-[60%] mx-auto'>
              {repo.thumbnail && <ImageViewer control={true} image={repo.thumbnail} />}
              <h1 className='font-bold text-2xl mt-2'>{repo?.title}</h1>
              <p>{repo?.about}</p>
              {
                repo.room && <>
                  <p><span className='font-bold'>Location:</span> {repo?.location}</p>
                  <p> <span className='font-bold'>Room:</span> {repo?.room}</p>
                </>
              }

              {
                repo.type === "webinar" && <div className='w-full flex flex-col mt-3'>
                  <h3 className='font-medium text-lg my-2'>Webinar Details</h3>
                  <video controls className="w-full">
                    <source src={repo.videoUrl} type="video/mp4" />
                  </video>
                </div>
              }
            </div>
          default:
            return <div></div>;
        }
      })()}

      {
        resources.length >= 1 && <div className='p-4'>
          <p className='text-xl font-medium'>Related Learning Resources</p>
          <div className='flex flex-wrap justify-between'>
            {
              resources.map((material: ResourceType) => <ResourcesCard material={material} getAll={() => getAssigned()} />)
            }
          </div>
        </div>
      }
    </div >
  );
};

export default SinglePage;