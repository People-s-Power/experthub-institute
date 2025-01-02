import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { FaRegClock } from "react-icons/fa6";
import { BsCalendar3 } from "react-icons/bs";
import TimeSelector from './TimePicker';
import DateSelector from './DatePicker';

function ScheduledCourse({ days, setDays, conflict, setConflict, startDate, setStartDate, duration, courses, endDate, setEndDate }) {
    const [disabledDays, setDisabledDays] = useState([]);
    const [conflictTimes, setConflictTimes] = useState([]);
    const [showTimePicker, setShowTimePicker] = useState({ day: null, field: null });
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const getWeekdaysInRange = (start, end) => {
        const weekdays = [];

        if (!start || !end) {
            return []
        }
        const startDay = dayjs(start);
        const endDay = dayjs(end);

        let current = startDay;

        while (current.isBefore(endDay) || current.isSame(endDay)) {
            const dayName = current.format('dddd');
            weekdays.push(dayName);
            current = current.add(1, 'day');
        }

        return weekdays;
    };
    const handleDaysInputChange = (index, field, value) => {
        const updatedDays = [...days.filter(day => getWeekdaysInRange(startDate, endDate).includes(day.day))];
        if (field === 'checked' && !value) {
            updatedDays[index].startTime = "";
            updatedDays[index].endTime = "";
        }
        updatedDays[index][field] = value;
        setDays(updatedDays);
    };

    useEffect(() => {
        if (startDate && endDate) {
            const start = dayjs(startDate);
            const end = dayjs(endDate);

            // Step 1: Generate all dates in the range
            const dateRange = [];
            let current = start;
            while (current.isBefore(end) || current.isSame(end)) {
                dateRange.push(current);
                current = current.add(1, 'day');
            }

            // Step 2: Build the schedule map based on courses
            const schedule = dateRange.reduce((acc, date) => {
                const dayOfWeek = date.format('dddd');
                acc[dayOfWeek] = acc[dayOfWeek] || [];

                courses.forEach(course => {
                    // Skip the course if it ends before today
                    if (dayjs(course.endDate).isBefore(dayjs(), 'day')) return;

                    // Only consider dates within the course's duration
                    if (!dayjs(date).isBetween(dayjs(course.startDate), dayjs(course.endDate), 'day', '[]')) {
                        return; // Skip dates outside the course duration
                    }

                    // Handle recurring days
                    course.days
                        .filter(day => day.checked && day.day === dayOfWeek) // Only consider matching days
                        .forEach(day => {
                            const times = getConflictTimes(dayjs(day.startTime, 'HH:mm'), dayjs(day.endTime, 'HH:mm'));
                            acc[dayOfWeek] = acc[dayOfWeek].concat(times);
                        });

                    // Handle single-day events (non-recurring)
                    if (!course.days.some(day => day.checked) && dayjs(course.startDate).isSame(date, 'day')) {
                        const times = getConflictTimes(dayjs(course.startTime, 'HH:mm'), dayjs(course.endTime, 'HH:mm'));
                        acc[dayOfWeek] = acc[dayOfWeek].concat(times);
                    }
                });

                return acc;
            }, {});

            setConflictTimes(schedule);
            console.log(schedule, `schedule with conflicts`);
        }
    }, [startDate, endDate, courses]);



    // Helper function to get conflict times within a specific time range
    function getConflictTimes(startTime, endTime) {
        const conflictTimes = [];
        let currentTime = startTime;

        while (currentTime.isBefore(endTime) || currentTime.isSame(endTime)) {
            conflictTimes.push(currentTime.format('HH:mm'));
            currentTime = currentTime.add(1, 'minute');
        }

        return conflictTimes;
    }

    const handleStartTimeChange = (index, time) => {
        const updatedDays = [...days];
        const startTime = time ? time.format('HH:mm') : "";
        updatedDays[index].startTime = startTime;

        const endTime = time.add(duration || 0, 'minutes').format('HH:mm');
        updatedDays[index].endTime = endTime;

        setDays(updatedDays);
    };


    useEffect(() => {
        const updateEndTimes = () => {
            const updatedDays = days.map(day => {
                if (day.startTime) {
                    const startTime = dayjs(day.startTime, 'HH:mm');
                    const newEndTime = startTime.add(parseFloat(duration || `0`), 'minute').format('HH:mm');
                    return {
                        ...day,
                        endTime: newEndTime
                    };
                }
                return day;
            });
            setDays(updatedDays);
        };

        updateEndTimes();
    }, [duration]);


    useEffect(() => {
        const hasConflict = days.some(day => {
            if (day.checked) {
                const startConflict = conflictTimes[day.day]?.includes(dayjs(day.startTime, 'HH:mm').format('HH:mm'));
                const endConflict = conflictTimes[day.day]?.includes(dayjs(day.endTime, 'HH:mm').format('HH:mm'));
                return startConflict || endConflict;
            }
            return false;
        });

        setConflict(hasConflict);
    }, [conflictTimes, days]);
    return (
        <>
            <div className='grid grid-cols-2 gap-5'>
                {/* Start Date Selector */}
                <div className='relative flex flex-col'>
                    <span className='text-[13px] font-medium'>Start Date</span>
                    <button
                        className='border text-left border-black rounded-md px-4 py-2 flex items-center gap-3'
                        onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                    >
                        {startDate ? dayjs(startDate).format(`YYYY-MM-DD`) : <span className='italic text-slate-400'>YYYY-MM-DD</span>}
                        <span className='text-black'><BsCalendar3 /></span>
                    </button>
                    <DateSelector
                        onChange={(date) => { setStartDate(date); setEndDate(undefined); setShowStartDatePicker(false); }}
                        value={startDate && dayjs(startDate)}
                        showDatePicker={showStartDatePicker}
                        minDate={dayjs()}
                        topGap={`8px`}
                        handleClose={() => setShowStartDatePicker(false)}
                        disabledDays={disabledDays}
                    />
                </div>

                {/* End Date Selector */}
                <div className='relative flex flex-col'>
                    <span className='text-[13px] font-medium'>End Date</span>
                    <button
                        disabled={!startDate}
                        className='border disabled:cursor-not-allowed disabled:opacity-40 text-left border-black rounded-md px-4 py-2 flex items-center gap-3'
                        onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                    >
                        {endDate ? dayjs(endDate).format(`YYYY-MM-DD`) : <span className='italic text-slate-400'>YYYY-MM-DD</span>}
                        <span className='text-black'><BsCalendar3 /></span>
                    </button>
                    <DateSelector
                        onChange={(date) => { setEndDate(date); setShowEndDatePicker(false); }}
                        value={endDate && dayjs(endDate)}
                        showDatePicker={showEndDatePicker}
                        minDate={startDate ? dayjs(startDate) : dayjs()}
                        topGap={`8px`}
                        handleClose={() => setShowEndDatePicker(false)}
                        disabledDays={disabledDays}

                    />
                </div>

            </div>

            {
                getWeekdaysInRange(startDate, endDate).length !== 0 && <>
                    <p className='font-medium mt-5'>Set your weekly hours</p>
                    {days.filter(day => getWeekdaysInRange(startDate, endDate).includes(day.day)).map((day, index) => (
                        <div key={index} className='flex gap-2 '>
                            <input
                                className='cursor-pointer'
                                type="checkbox"
                                checked={day.checked}
                                onChange={(e) => handleDaysInputChange(index, 'checked', e.target.checked)}
                            />
                            <p className='w-24 my-auto py-1.5'>{day.day}</p>

                            {day.checked && (
                                <div className='flex items-center gap-3'>
                                    {/* Start Time */}
                                    <div className='relative flex flex-col'>
                                        <button
                                            className={`border w-[100px] text-center justify-center text-[13px] bg-white rounded-md px-3 py-1 flex items-center gap-3 ${conflictTimes[day.day]?.includes(day.startTime) ? 'border-red-500' : 'border-transparent'}`}
                                            onClick={() => setShowTimePicker({ day: day.day, field: 'startTime' })}
                                        >
                                            {day.startTime ? dayjs(day.startTime, 'HH:mm').format('HH:mm') : <span className='italic'>HH : MM</span>}
                                            <span><FaRegClock /></span>
                                        </button>
                                        {showTimePicker.day === day.day && showTimePicker.field === 'startTime' && (
                                            <TimeSelector
                                                label="Start Time"
                                                value={dayjs(day.startTime, 'HH:mm')}
                                                showTimePicker={true}
                                                handleClose={() => setShowTimePicker({ day: null, field: null })}
                                                onChange={(time) => handleStartTimeChange(index, time)}
                                                conflictTimes={conflictTimes[day.day] || []}
                                                topGap={`-20px`}
                                            />
                                        )}
                                    </div>

                                    <p className='my-auto'>-</p>

                                    <div className='relative flex flex-col'>
                                        <button
                                            disabled
                                            className={`border  w-[100px] text-center justify-center disabled:cursor-not-allowed  text-[13px] bg-white rounded-md px-3 py-1 flex items-center gap-3 ${conflictTimes[day.day]?.includes(day.endTime) ? 'border-red-500' : 'border-transparent'}`}

                                        >
                                            {day.endTime ? dayjs(day.endTime, 'HH:mm').format('HH:mm') : <span className='italic'>HH : MM</span>}
                                            <span><FaRegClock /></span>
                                        </button>

                                    </div>
                                </div>
                            )}
                        </div>
                    ))}


                </>
            }

        </>
    );
}

export default ScheduledCourse;
