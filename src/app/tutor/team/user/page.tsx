'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Spin, Alert, Button } from 'antd';
import Link from 'next/link';
import apiService from '@/utils/apiService';

const UserPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const tutorId = searchParams.get("tutorId");
  const ownerId = searchParams.get("ownerId");

  useEffect(() => {
    if (!status || !tutorId || !ownerId) {
      setError("Invalid or missing query parameters.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await apiService.get(`/user/team/${tutorId}/${ownerId}/${status}`);
        console.log(response);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, tutorId, ownerId]); // Added dependencies

  return (
    <div className="lg:w-[40%] mx-auto text-center px-4 py-40">
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <>
          <Alert message="Error" description={error} type="error" showIcon />
          <Link href="/tutor">
            <button className='mt-4 bg-primary text-white p-4 rounded-md'>Go to Dashboard</button>
          </Link>
        </>
      ) : (
        <div>
          <h1 className="text-2xl">
            {status === 'rejected' ? "Invite Rejected Successfully!" : "Invite Accepted Successfully!"}
          </h1>
          <Link href="/tutor">
            <button className='mt-4 bg-primary p-4 rounded-md'>Go Back to Dashboard</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserPage;
