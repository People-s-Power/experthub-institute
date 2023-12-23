import React from 'react';

const AssesmentCard = () => {
  return (
    <div className='border w-[48%] my-4 border-[#1E1E1E59] p-4 rounded-md flex justify-between'>
      <img className='rounded-md w-1/2 shadow-[26px_0px_32.099998474121094px_0px_#FDC3324D]' src="/images/card.png" alt="" />
      <div className='pl-10'>
        <h4 className='text-xl font-medium'>Web design</h4>
        <p className='text-xs my-3'>Gain the basic skills user
          needs, study the basic
          experience</p>
          <button className='p-2 px-6 rounded-sm bg-primary'>Edit</button>
      </div>
    </div>
  );
};

export default AssesmentCard;