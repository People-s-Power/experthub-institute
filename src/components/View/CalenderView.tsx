"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  momentLocalizer,
  Event as BigCalendarEvent,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import apiService from "@/utils/apiService";
import { useAppSelector } from "@/store/hooks";
const localizer = momentLocalizer(moment);
import { usePathname } from "next/navigation";
import { addDays, isSameDay, isAfter } from "date-fns";
import AppointmentModal from "../modals/AppointmentModal";
import JoinMeeting from "../JoinMeeting";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isBetween from "dayjs/plugin/isBetween";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

dayjs.extend(isSameOrAfter);

const EventComponent = ({ event }: { event: any }) => {
  return (
    <span className="text-xm !h-44">
      <span className="capitalize">{event.title}</span>
      <br />
      {moment(event.start).format("hh:mm A")} -{" "}
      {moment(event.end).format("hh:mm A")}
    </span>
  );
};

const CalendarComponent: React.FC = () => {
  const user = useAppSelector((state) => state.value);
  const [events, setEvents] = useState<BigCalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<any>("month");
  const pathname = usePathname();
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (selectedEvent) {
      if (selectedEvent.type === "appointment") {
        apiService
          .get(`/appointment/single/${selectedEvent.id}`)
          .then(function (response) {
            console.log(response);
            setData(response.data.appointment);
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (selectedEvent.type === "course") {
        apiService
          .get(`courses/single-course/${selectedEvent.id}`)
          .then(function (response) {
            console.log(response);
            setData(response.data.course);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        apiService.get(`events/${selectedEvent.id}`).then(function (response) {
          setData(response.data.course);
          // console.log(response.data)
        });
      }
    }
  }, [selectedEvent]);

  const splitEventIntoDays = (event: any) => {
    const { id, title, start, end, type } = event;
    const events = [];
    let currentDate = new Date(start);

    while (!isAfter(currentDate, new Date(end))) {
      events.push({
        id,
        title,
        type,
        start: new Date(currentDate),
        end: new Date(currentDate), // Use the same date to make it a single-day event
      });
      currentDate = addDays(currentDate, 1); // Move to the next day
    }

    return events;
  };

  const preprocessEvents = (events: any[]) => {
    return events.flatMap((event) => {
      if (isSameDay(event.start, event.end)) {
        return event; // Single-day events remain unchanged
      }
      return splitEventIntoDays(event); // Multi-day events are split
    });
  };
  function generateCourseEvents(course: any) {
    if (!course.days || !Array.isArray(course.days)) {
      return [
        {
          id: course._id,
          title: course.title,
          start: new Date(course.startDate),
          end: new Date(course.endDate),
          description: course.about,
          type: "course",
        },
      ];
    }
    const events: any[] = [];
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);

    // Iterate through each day between startDate and endDate
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
      const dayObj = course.days.find(
        (day: any) => day.checked && day.day === dayName
      );
      if (dayObj) {
        // Create event for this day
        const startTimeParts = dayObj.startTime.split(":");
        const endTimeParts = dayObj.endTime.split(":");
        const eventStart = new Date(d);
        eventStart.setHours(
          Number(startTimeParts[0]),
          Number(startTimeParts[1]),
          0,
          0
        );
        const eventEnd = new Date(d);
        eventEnd.setHours(
          Number(endTimeParts[0]),
          Number(endTimeParts[1]),
          0,
          0
        );

        events.push({
          id: course._id,
          title: course.title,
          start: eventStart,
          end: eventEnd,
          description: course.about,
          type: "course",
        });
      }
    }
    return events;
  }
  useEffect(() => {
    const fetchEvents = async () => {
      let formattedEvents: any[] = [];

      try {
        const [appointmentsResponse, coursesResponse, tutorResponse, events] =
          await Promise.all([
            apiService.get(`/appointment/${user.id}`).catch((error) => {
              console.error("Error fetching appointments:", error);
              return { data: { appointment: [] } }; // Fallback to empty array
            }),
            apiService
              .get(`courses/enrolled-courses/${user.id}`)
              .catch((error) => {
                console.error("Error fetching enrolled courses:", error);
                return { data: { enrolledCourses: [] } }; // Fallback to empty array
              }),
            apiService
              .put(`courses/category/author`, {
                category: user.assignedCourse,
                id: user.id,
              })
              .catch((error) => {
                console.error("Error updating course category:", error);
                return { data: { enrolledCourses: [] } }; // Fallback to empty array
              }),
            apiService.get(`events/my-events/${user.id}`).catch((error) => {
              console.error("Error fetching events:", error);
              return { data: { enrolledCourses: [] } }; // Fallback to empty array
            }),
          ]);

        // Process appointments
        const appointments = appointmentsResponse.data.appointment.map(
          (event: any) => ({
            id: event._id,
            title: `${event.category} with ${event.to?.fullname}`,
            start: new Date(event.date),
            end: new Date(event.date),
            description: event.reason,
            type: "appointment",
          })
        );

        // Process enrolled courses
        // Helper to get day index from string
        const dayNameToIndex = {
          Sunday: 0,
          Monday: 1,
          Tuesday: 2,
          Wednesday: 3,
          Thursday: 4,
          Friday: 5,
          Saturday: 6,
        };

        // Helper function to generate course events based on days and times

        let enrolledCourses: any = [];
        if (pathname.includes("applicant")) {
          enrolledCourses = coursesResponse.data.enrolledCourses
            .filter(
              (event: any) =>
                event.type === "online" || event.type === "offline"
            )
            .flatMap((event: any) => generateCourseEvents(event));
        } else {
          enrolledCourses = tutorResponse.data.courses
            .filter(
              (event: any) =>
                event.type === "online" || event.type === "offline"
            )
            .flatMap((event: any) => generateCourseEvents(event));
        }
        const enrolledevents = events.data.enrolledCourses
          .filter(
            (event: any) => event.type === "online" || event.type === "offline"
          )
          .map((event: any) => ({
            id: event._id,
            title: event.title,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
            description: event.about,
            type: "event",
          }));

        // Combine events into one array
        formattedEvents = [
          ...appointments,
          ...enrolledCourses,
          ...enrolledevents,
        ];

        console.log(formattedEvents);
        const processedEvents = preprocessEvents(formattedEvents);
        setEvents(processedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [currentDate]);

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  async function initClient() {
    try {
      const ZoomMtgEmbedded = (await import("@zoom/meetingsdk/embedded"))
        .default;
      const client: any = ZoomMtgEmbedded.createClient();

      // Retrieve the signature
      const { signature } = await getSignature(
        data?.meetingId,
        user.role === "applicant" ? 0 : 1
      );

      // Select the SDK element and check if it exists
      const meetingSDKElement = document.getElementById("meetingSDKElement");
      if (!meetingSDKElement) {
        console.error("Meeting SDK element not found.");
        return;
      }

      // Initialize the Zoom client with configuration
      client.init({
        leaveUrl: `${window.location.origin}/${user.role}`,
        debug: true,
        zoomAppRoot: meetingSDKElement,
        language: "en-US",
        customize: {
          video: {
            isResizable: true,
            viewSizes: {
              default: {
                width: window.innerWidth > 700 ? 900 : 300,
                height: 500,
              },
              ribbon: {
                width: 300,
                height: 500,
              },
            },
          },
        },
      });

      console.log("Zoom SDK initialized.");
      return { client, signature };
    } catch (error) {
      console.error("Error initializing Zoom client:", error);
    }
  }

  // Function to get the Zoom signature
  async function getSignature(meetingNumber: any, role: number) {
    try {
      const res = await apiService.post(`courses/get-zoom-signature`, {
        meetingNumber,
        role,
      });
      console.log("Signature received:", res.data.signature);
      return res.data;
    } catch (error) {
      console.error("Error fetching signature:", error);
    }
  }

  // Function to start the Zoom meeting
  async function startMeeting() {
    try {
      setLoading(true);

      // Initialize the client and retrieve the signature
      const { client, signature } = (await initClient()) || {};

      // Check if signature or client failed to initialize
      if (!client || !signature) {
        console.error(
          "Client or signature not available. Meeting cannot start."
        );
        setLoading(false);
        return;
      }

      console.log("Starting meeting with:", {
        meetingId: data?.meetingId,
        password: data?.meetingPassword,
        zak: data?.zakToken,
      });

      // Join the meeting
      await client
        .join({
          sdkKey: process.env.NEXT_PUBLIC_CLIENT_ID,
          signature,
          meetingNumber: data?.meetingId,
          userName: user.fullName,
          password: data?.meetingPassword,
          ...(user.role !== "applicant" && user.role !== "student"
            ? { zak: data?.zakToken }
            : {}),
        })
        .then((res: any) => {
          console.log("Meeting joined successfully:", res);
          setInit(true);
          // notifyStudents();
          // handleClick();
          setLoading(false);
        })
        .catch((error: any) => {
          console.error("Error joining meeting:", error);
          // handleClick();
          setLoading(false);
        });
    } catch (error) {
      console.error("Unexpected error in startMeeting:", error);
      setLoading(false);
    }
  }

  const isOn = () => {
    const userTimeZone = dayjs.tz.guess();
    const currentDate = dayjs().tz(userTimeZone);

    const startDate = dayjs(data?.startDate).tz(userTimeZone).startOf("day");
    const endDate = dayjs(data?.endDate).tz(userTimeZone).endOf("day");

    // console.log(currentDate.format(), endDate.format());

    if (currentDate.isAfter(endDate))
      return { on: false, msg: "Meeting period is over" };
    if (!currentDate.isBetween(startDate, endDate))
      return { on: false, msg: "Meeting is out of date range" };

    const activeDays = data?.days.filter((day: any) => day.checked);

    if (activeDays.length === 0) {
      const meetingStartTime = dayjs(
        `${currentDate.format("YYYY-MM-DD")}T${data?.startTime}`
      ).tz(userTimeZone);
      const meetingEndTime = dayjs(
        `${currentDate.format("YYYY-MM-DD")}T${data?.endTime}`
      ).tz(userTimeZone);
      if (currentDate.isBetween(meetingStartTime, meetingEndTime)) {
        return { on: true, msg: "Meeting is ongoing" };
      } else if (currentDate.isBefore(meetingStartTime)) {
        return {
          on: false,
          msg: `Meeting has not started, will start at ${meetingStartTime.format(
            "HH:mm"
          )}`,
        };
      } else {
        return {
          on: false,
          msg: `Meeting has ended, ended at ${meetingEndTime.format("HH:mm")}`,
        };
      }
    }
    const todayMeeting = activeDays.find(
      (day: any) => day.day === currentDate.format("dddd")
    );

    if (todayMeeting) {
      const meetingStartTime = dayjs(
        `${currentDate.format("YYYY-MM-DD")}T${todayMeeting.startTime}`
      ).tz(userTimeZone);
      const meetingEndTime = dayjs(
        `${currentDate.format("YYYY-MM-DD")}T${todayMeeting.endTime}`
      ).tz(userTimeZone);

      if (currentDate.isBetween(meetingStartTime, meetingEndTime)) {
        return { on: true, msg: "Meeting is ongoing" };
      } else if (currentDate.isBefore(meetingStartTime)) {
        return {
          on: false,
          msg: `Meeting has not started, will start at ${meetingStartTime.format(
            "HH:mm"
          )}`,
        };
      }
    }

    const futureMeetingsMain = [
      ...data?.days.filter((day: any) => day.checked),
    ];
    const msg = (
      <div className="flex flex-col  ">
        <div>No meeting now. Check out our schedule below</div>
        {futureMeetingsMain.map((day, i) => (
          <span className="text-slate-400">
            {" "}
            {day.day}s at{" "}
            {dayjs(
              `${dayjs().format("YYYY-MM-DD")} ${day.startTime}`,
              "YYYY-MM-DD HH:mm"
            ).format("hh:mm A")}{" "}
            -{" "}
            {dayjs(
              `${dayjs().format("YYYY-MM-DD")} ${day.endTime}`,
              "YYYY-MM-DD HH:mm"
            ).format("hh:mm A")}
            ,{" "}
          </span>
        ))}
      </div>
    );
    return { on: false, msg };
  };

  return (
    <div className="h-screen p-2">
      <h2 className="text-xl font-bold mb-4">My Calendar</h2>
      <div className="z-0">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          onNavigate={(date: React.SetStateAction<Date>) =>
            setCurrentDate(date)
          } // Update state on navigation
          date={currentDate}
          view={view}
          onView={(newView: React.SetStateAction<string>) => setView(newView)}
          endAccessor="end"
          style={{ height: "80vh" }}
          className="bg-white shadow-lg rounded-lg z-0"
          components={{
            // event: EventComponent,
            month: {
              event: EventComponent, // Explicitly applies to week view
            },
            week: {
              event: EventComponent, // Explicitly applies to week view
            },
            // work_week: {
            //   event: EventComponent, // Explicitly applies to work week view
            // },
            // day:{
            //   event: EventComponent, // Explicitly applies to work week view
            // }
          }}
          onSelectEvent={handleSelectEvent}
          messages={{
            agenda: "Activities",
          }}
        />
      </div>

      {open && (
        <div>
          <div
            onClick={() => setOpen(false)}
            className="fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10"
          ></div>
          <div className="fixed top-10 bottom-10 left-0 rounded-md right-0 lg:w-[30%] h-[55%] w-[90%] overflow-y-scroll mx-auto z-20 bg-[#F8F7F4]">
            <div className="shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between">
              <p className="font-medium capitalize">{selectedEvent.type}</p>
              <img
                onClick={() => setOpen(false)}
                className="w-6 h-6 cursor-pointer"
                src="/images/icons/material-symbols_cancel-outline.svg"
                alt=""
              />
            </div>
            <div className="lg:p-8 p-4">
              {selectedEvent && (
                <div className="bg-white p-4">
                  <h2 className="text-lg capitalize font-bold">
                    {selectedEvent.title}
                  </h2>
                  <p>
                    <strong>Start:</strong>{" "}
                    {moment(selectedEvent.start).format("MMMM Do YYYY, h:mm A")}
                  </p>
                  <p>
                    <strong>End:</strong>{" "}
                    {moment(selectedEvent.end).format("MMMM Do YYYY, h:mm A")}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedEvent.description}
                  </p>
                  {data && (
                    <>
                      <p>
                        <strong>Mode:</strong> {data?.mode || data?.type}
                      </p>
                      {data.mode === "phone" && (
                        <p>
                          <strong>Phone:</strong> {data.phone}
                        </p>
                      )}
                      {data.mode === "in person" && (
                        <>
                          <p>
                            {" "}
                            <strong>Location:</strong> {data.location}
                          </p>
                          <p>
                            <strong>Room:</strong> {data.room}
                          </p>
                        </>
                      )}
                      {data.mode === "online" && (
                        <JoinMeeting appointment={data} />
                      )}

                      {(selectedEvent.type === "course" ||
                        selectedEvent.type === "event") &&
                      data ? (
                        data.type === "online" ? (
                          isOn().on ? (
                            <button
                              onClick={() => startMeeting()}
                              className="bg-primary p-2 my-3 rounded-md px-8 w-[150px]"
                            >
                              {loading ? <Spin /> : "Join Live"}
                            </button>
                          ) : null
                        ) : null
                      ) : null}

                      {(selectedEvent.type === "course" ||
                        selectedEvent.type === "event") &&
                        data.type === "online" && (
                          <div className="flex mt-1 items-center text-sm   text-yellow-600 gap-3">
                            {isOn().msg}
                          </div>
                        )}

                      {(selectedEvent.type === "course" ||
                        selectedEvent.type === "event") &&
                      data?.type === "offline" ? (
                        <div className="text-sm">
                          <p>
                            <span className="font-bold">Location:</span>{" "}
                            {data?.location}
                          </p>
                          <p>
                            <span className="font-bold">Room:</span>{" "}
                            {data?.room}
                          </p>
                        </div>
                      ) : null}

                      {selectedEvent.type === "course" && data.days && (
                        <>
                          <div className="my-3 font-bold">Weekly Hours</div>
                          {data.days.map(
                            (day: any, index: any) =>
                              day.checked && (
                                <div
                                  key={index}
                                  className="flex justify-between"
                                >
                                  <p>{day.day}</p>
                                  <p>{day.startTime}</p>
                                  <p>-</p>
                                  <p>{day.endTime}</p>
                                </div>
                              )
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="text-center">
              {selectedEvent.type === "appointment" && (
                <button
                  onClick={() => {
                    setShow(true);
                    setOpen(false);
                  }}
                  className="bg-primary p-3 w-44 mx-auto"
                >
                  Reschedule
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <AppointmentModal
        open={show}
        handleClick={() => {
          setShow(false);
        }}
        data={data}
      />
    </div>
  );
};

export default CalendarComponent;
