"use client"

import React, { useEffect, useState } from 'react';
import { notification, Spin } from 'antd';
import Select from "react-select";
import { useAppSelector } from '@/store/hooks';
import { UserType } from '@/types/UserType';
import { CourseType } from '@/types/CourseType';
import apiService from '@/utils/apiService';

interface GiveScholarshipProps {
  open: boolean;
  handleClick: () => void;
  courseId?: string;
  selectedCourse?: CourseType | null;
}

const GiveScholarship: React.FC<GiveScholarshipProps> = ({ 
  open, 
  handleClick, 
  courseId,
  selectedCourse 
}) => {
  const user = useAppSelector((state) => state.value);
  const [api, contextHolder] = notification.useNotification();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<{ label: string; value: string }[]>([]);
  const [courses, setCourses] = useState<{ label: string; value: string }[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courseId || "");
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");
  const [durationType, setDurationType] = useState("months");
  const [discountPercentage, setDiscountPercentage] = useState(100);

  // Fetch students from API
  const getStudents = () => {
    apiService
      .get("user/students")
      .then((response) => {
        const formattedStudents = response.data.students.map((student: UserType) => ({
          value: student.studentId,
          label: student.fullname,
        }));
        setStudents(formattedStudents);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        api.open({
          type: "error",
          message: "Failed to load students",
        });
      });
  };

  // Fetch courses from API
  const getCourses = () => {
    apiService
      .get(`courses/instructor-courses/${user.id}`)
      .then((response) => {
        const formattedCourses = response.data.courses.map((course: CourseType) => ({
          value: course._id,
          label: course.title,
        }));
        setCourses(formattedCourses);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        api.open({
          type: "error",
          message: "Failed to load courses",
        });
      });
  };

  // Handle scholarship assignment
  const handleSubmit = async () => {
    if (!selectedCourseId) {
      api.open({
        type: "error",
        message: "Please select a course",
      });
      return;
    }

    if (selectedStudents.length === 0) {
      api.open({
        type: "error",
        message: "Please select at least one student",
      });
      return;
    }

    setLoading(true);

    try {
      const scholarshipData = {
        studentIds: selectedStudents.map((student) => student.value),
      };

      await apiService.post(`courses/give-scholarship/${selectedCourseId}`, scholarshipData);

      api.open({
        type: "success",
        message: `Scholarship granted successfully to ${selectedStudents.length} student(s)`,
      });

      // Reset form
      setSelectedStudents([]);
      setSelectedCourseId(courseId || "");
      
      handleClick();
    } catch (error: any) {
      console.error("Error granting scholarship:", error);
      api.open({
        type: "error",
        message: error.response?.data?.message || "Failed to grant scholarship",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on modal open
  useEffect(() => {
    if (open) {
      getStudents();
      if (!courseId) {
        getCourses();
      }
      
      // Set selected course if provided
      if (selectedCourse) {
        setSelectedCourseId(selectedCourse._id);
      }
    }
  }, [open, courseId, selectedCourse]);

  if (!open) return null;

  return (
    <div>
      {contextHolder}
      <div
        onClick={handleClick}
        className="fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-[999]"
      />
      <div className="fixed top-10 bottom-10 left-0 overflow-y-auto rounded-lg right-0 lg:w-[60%] w-[95%] mx-auto z-[1000] bg-[#F8F7F4] shadow-xl">
        {/* Header */}
        <div className="shadow-md p-4 lg:px-12 flex justify-between items-center bg-white rounded-t-lg">
          <h2 className="font-semibold text-lg">Grant Scholarship</h2>
          <button
            onClick={handleClick}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <img 
              className="w-5 h-5" 
              src="/images/icons/material-symbols_cancel-outline.svg" 
              alt="Close" 
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-12 space-y-6">
          {/* Course Selection */}
          {!courseId && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Select Course <span className="text-red-500">*</span>
              </label>
              <Select
                options={courses}
                value={courses.find(course => course.value === selectedCourseId)}
                onChange={(selected: any) => setSelectedCourseId(selected?.value || "")}
                placeholder="Choose a course for scholarship"
                className="basic-select"
                classNamePrefix="select"
                isSearchable
              />
            </div>
          )}

          {/* Selected Course Display (when courseId is provided) */}
          {courseId && selectedCourse && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-medium text-blue-900">Selected Course</h3>
              <p className="text-blue-700">{selectedCourse.title}</p>
              {selectedCourse.fee > 0 && (
                <p className="text-sm text-blue-600">Course Fee: ₦{selectedCourse.fee.toLocaleString()}</p>
              )}
            </div>
          )}

          {/* Student Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Students <span className="text-red-500">*</span>
            </label>
            <Select
              isMulti
              options={students}
              value={selectedStudents}
              onChange={(selected: any) => setSelectedStudents(selected || [])}
              placeholder="Choose students to grant scholarship"
              className="basic-multi-select"
              classNamePrefix="select"
              isSearchable
            />
            {selectedStudents.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedStudents.length} student(s) selected
              </p>
            )}
          </div>

        
          {/* Action Buttons */}
          <div className="flex items-center space-x-4 pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-black font-medium py-2.5 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <Spin size="small" className="mr-2" />
                  Granting...
                </>
              ) : (
                "Grant Scholarship"
              )}
            </button>
            <button
              onClick={handleClick}
              className="px-6 py-2.5 hover:bg-gray-100 rounded-md transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiveScholarship;