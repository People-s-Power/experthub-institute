import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DateSelector from './DatePicker';
import TimeSelector from './TimePicker';
import { FaRegClock } from "react-icons/fa6";
import { BsCalendar3 } from "react-icons/bs";
function CourseScheduler({ courses, startDate, setEndDate, setConflict, setStartDate, startTime, setStartTime, endTime, setEndTime, duration }) {

    const [disabledDays, setDisabledDays] = useState([]);
    const [conflictTimes, setConflictTimes] = useState([]);
    const [showDayPicker, setShowDayPicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // // Calculate fully booked days
    // useEffect(() => {
    //     const fullyBookedDays = courses
    //         .filter((course) => course.days && course.days.length > 0)
    //         .flatMap((course) => course.days)
    //         .reduce((acc, day) => {
    //             if (day.checked) acc.push(dayjs().day(day.day)); // Convert to `Dayjs` object
    //             return acc;
    //         }, []);
    //     setDisabledDays(fullyBookedDays);
    // }, [courses]);

    // Calculate conflicting time slots for the selected day


    useEffect(() => {
        if (startDate) {
            const conflicts = courses.flatMap((course) => {
                if (course.days.filter(day => day.checked).length !== 0 && course.days.some((d) => d.day === dayjs(startDate).format('dddd'))) {
                    return course.days
                        .filter((d) => d.day === dayjs(startDate).format('dddd') && d.checked)
                        .flatMap((d) => getConflictTimes(dayjs(d.startTime, 'HH:mm'), dayjs(d.endTime, 'HH:mm')));
                } else if (course.days.filter(day => day.checked).length === 0 && dayjs(course.startDate).isSame(dayjs(startDate), 'day')) {
                    return getConflictTimes(dayjs(course.startTime, 'HH:mm'), dayjs(course.endTime, 'HH:mm'));
                }
                return [];
            });
            console.log(conflicts, `conflicting times`)
            setConflictTimes(conflicts);
        }
    }, [startDate, courses]);

    useEffect(() => {
        setConflict(conflictTimes.includes(dayjs(startTime, `HH:mm`).format(`HH:mm`)) || conflictTimes.includes(dayjs(endTime, `HH:mm`).format(`HH:mm`)))
    }, [conflictTimes, endTime, startTime])




    function getConflictTimes(startTime, endTime) {
        const conflictTimes = [];
        let currentTime = startTime;

        while (currentTime.isBefore(endTime) || currentTime.isSame(endTime)) {
            conflictTimes.push(currentTime.format('HH:mm'));
            currentTime = currentTime.add(1, 'minute');
        }

        return conflictTimes;
    }
    useEffect(() => {
        if (startTime) {
            handleStartTimeChange(dayjs(startTime, `HH:mm`))

        }

    }, [duration])
    const handleDayChange = (day) => {
        setStartDate(day.format(`YYYY-MM-DD`));
        setEndDate(day.format(`YYYY-MM-DD`));

        setStartTime(null);
        setEndTime(null);
    };

    const handleStartTimeChange = (time) => {
        setStartTime(dayjs(time).format('HH:mm'));
        const endTimeFormat = dayjs(time).add(duration, 'minute')
        setEndTime(time ? endTimeFormat.format('HH:mm') : null);
    };
    const handleEndTimeChange = (time) => {
        setStartTime(dayjs(time).format('HH:mm'));
        const endTimeFormat = dayjs(time).add(duration, 'minute')
        setEndTime(time ? endTimeFormat.format('HH:mm') : null);
    };
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
                <div className='relative flex flex-col '>
                    <span className='text-[13px] font-medium'>Date of Meeting</span>
                    <button className='border text-left border-black rounded-md px-4 py-2 flex items-center gap-3' onClick={() => setShowDayPicker(!showDayPicker)}>{startDate ? dayjs(dayjs(startDate)).format(`YYYY-MM-DD`) : <span className='italic text-slate-400'>YYYY-MM-DD </span>} <span className='text-black'><BsCalendar3 /> </span></button>
                    <DateSelector
                        onChange={handleDayChange}
                        value={startDate && dayjs(startDate)}
                        showDatePicker={showDayPicker}
                        minDate={dayjs()}
                        topGap={`8px`}
                        handleClose={() => setShowDayPicker(false)}
                        disabledDays={disabledDays}
                    />
                </div>


                {startDate && (
                    <div className='grid grid-cols-2 gap-5 mt-5'>
                        <div className='relative flex flex-col '>
                            <span className='text-[13px] font-medium'>Start Time <span className='text-red-400 text-[12px]'> {conflictTimes.includes(dayjs(startTime, `HH:mm`).format(`HH:mm`)) && ` - Time aleady used`}</span></span>
                            <button className={`border text-left ${conflictTimes.includes(dayjs(startTime, `HH:mm`).format(`HH:mm`)) ? `border-red-500` : ` border-black`} rounded-md px-4 py-2 flex items-center gap-3`} onClick={() => setShowTimePicker(!showDayPicker)}>{startTime ? dayjs(startTime, `HH:mm`).format(`HH:mm`) : <span className='italic text-slate-400'>HH : MM </span>} <span className='text-black'><FaRegClock /> </span></button>
                            <TimeSelector
                                label="Start Time"
                                value={startTime && dayjs(startTime, 'HH:mm')}
                                showTimePicker={showTimePicker}
                                onChange={handleStartTimeChange}
                                handleClose={() => setShowTimePicker(false)}
                                conflictTimes={conflictTimes}
                                topGap={`8px`}
                            />
                        </div>

                        <div className='relative flex flex-col '>
                            <span className='text-[13px] font-medium'>End Time <span className='text-red-400 text-[12px]'> {conflictTimes.includes(dayjs(endTime, `HH:mm`).format(`HH:mm`)) && ` - Time aleady used`}</span></span>
                            <button className={`border text-left ${conflictTimes.includes(dayjs(endTime, `HH:mm`).format(`HH:mm`)) ? `border-red-500` : ` border-slate-400`}  cursor-not-allowed text-slate-400  rounded-md px-4 py-2 flex items-center gap-3`} >{endTime ? dayjs(endTime, `HH:mm`).format(`HH:mm`) : <span className='italic text-slate-400'>HH : MM </span>} <span className='text-slate-400'><FaRegClock />  </span></button>
                            <TimeSelector
                                label="Start Time"
                                value={endTime && dayjs(endTime, 'HH:mm')}
                                showTimePicker={showTimePicker}
                                onChange={handleEndTimeChange}
                                handleClose={() => setShowTimePicker(false)}
                                conflictTimes={conflictTimes}
                                topGap={`5px`}
                            />
                        </div>
                    </div>
                )}
            </div>
        </LocalizationProvider>
    );
}

export default CourseScheduler;
