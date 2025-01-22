"use client"


import FooterNav from "@/components/FooterNav";
import HeaderNav from "@/components/HeaderNav";
import SliderComp from "@/components/SliderComp";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import { CourseType } from "@/types/CourseType";
import apiService from "@/utils/apiService";
import Loader from "@/components/Loader";
import CourseDetails from "@/components/modals/CourseDetails";

export default function Home() {
  const text = `Ans: We are determine to raise the next generation of Global leaders and empower youths to harness the immense potential of technology to overcome the challenges our planet faces, including its dwindling economy.
`;
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: <p className="font-bold">Are the courses worth paying that much for it?      </p>,
      children: <p className="font-medium"><strong>YES</strong> <br /> When you pay for Our Course, Experthub will: <br />

        <ul>
          <li>Provide comprehensive training programs that cover a wide spectrum of tech skills, ensuring that you receive a well-rounded education in your chosen field.</li>
          <li>Provide insights, guidance, and practical expertise based on real world experience from experienced and knowledgeable instructors.</li>
          <li>Highly increase your confidence level to undertake bolder projects in your industry and even in others.</li>
          <li>Tailor their training programs to suit your individual learning needs ensuring that you receive a personalized education that matches your pace and style.</li>
          <li>Offer career placement services, helping you secure employment or internships.</li>
          <li>Teach you hands-on projects and exercises to reinforce your learning</li>
        </ul>
      </p>,
    },
    // {
    //   key: '2',
    //   label: <p className="font-bold">Is it worth paying that much for it?</p>,
    //   children: <p className="font-medium">{text}</p>,
    // },
    {
      key: '2',
      label: <p className="font-bold">Can Experthub cover all my training?</p>,
      children: <p className="font-medium"><strong>YES</strong> <br />
        Our Instructors are seasoned expert in their fields who have a track record of delivering high-quality educational content.
      </p>,
    },
    {
      key: '3',
      label: <p className="font-bold">How can I signup and get started?</p>,
      children: <p className="font-medium">To sign-up, click on the register button above and navigate to Register Now button to register either as an Applicant if you want to apply for any of our courses or to Register as a Tutor if you have the requisite qualification to be an instructor on any of our skilled areas.
        <br />
        <strong>OR </strong><br />
        Simply click on this <a href="https://trainings.experthubllc.com/auth/signup">link</a>  to start your Registration immediately:

      </p>,
    },
  ];

  const [courses, setCourses] = useState<CourseType | []>([])
  const [course, setCourse] = useState<CourseType | null>(null)
  const [open, setOpen] = useState(false)

  const getCourses = async () => {
    apiService.get("courses/all")
      .then(function (response) {
        console.log(response.data)
        setCourses(response.data.courses)
      }).catch(e => {
        console.log(e)
      })
  }

  const coursesSectionRef = useRef<HTMLElement | null>(null);
  const [shouldScroll, setShouldScroll] = useState(false)

  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#courses') {
      setShouldScroll(true)
    }
  }, [])

  useEffect(() => {
    if (shouldScroll && coursesSectionRef.current) {
      coursesSectionRef.current.scrollIntoView({ behavior: 'instant' })
      setShouldScroll(false)
    }
  }, [shouldScroll, courses])
  useEffect(() => {
    getCourses()
  }, [])

  return (
    <Fragment>
      <HeaderNav />
      <main className="landing">
        <section>
          <img className="h-[89vh] w-full object-cover" src="/images/hero.png" alt="" />
          <div className="absolute lg:w-[30%] left-0 text-white right-0 mx-auto text-center bottom-32">
            <h1 className="font-bold text-3xl my-4">Start Your Journey to Become
              a Digital Nomad</h1>
            <p className="my-4">Learn how to become a trained professional and gain the
              financial freedom that you want!</p>
            <Link href={"#auth"}><button className="bg-primary text-black font-medium w-52 p-2 rounded-sm">Register</button></Link>
          </div>
        </section>
        <section id="about" className="lg:flex justify-between lg:mx-20 mx-4 my-20">
          <div className="lg:w-[43%] my-auto lg:order-1">
            <h3 className="text-xl mb-3 font-medium">About Experthub Trainings</h3>
            <p>We are determine to raise the next generation of global leaders and
              empower youths to harness the immense power of technology to
              overcome the challenges our planet faces, including its dwindling
              economy. Our platform is more than just a website; it's a thriving
              community of like-minded individuals who share a passion for change.
              Together, we learn, grow, and collaborate to make a tangible impact
              on our communities and planet.</p>
          </div>
          <img className="sm:mt-6 lg:order-0" src="/images/about-img.png" alt="" />

        </section>
        <section id="patners" className="lg:m-0 m-4">
          <h3 className="lg:text-2xl text-xl my-10 mb-3 font-medium text-center">Improve Skills & Earn Through Our  Partners</h3>
          <div className="flex lg:w-1/2 mx-auto my-10 justify-between">
            <div>
              <img className="lg:w-20 w-10 object-cover lg:h-20 mx-auto" src="/images/expat.png" alt="" />
              <p className="lg:text-base text-xs font-medium">EXPERTHUB LLC</p>
            </div>
            <div>
              <img className="lg:w-20 w-10 mx-auto" src="/images/peoples-pow.png" alt="" />
              <p className="lg:text-base text-xs  font-medium">PEOPLES POWER</p>
            </div>
            <div>
              <img className="lg:w-20 w-10 mx-auto" src="/images/edf.png" alt="" />
              <p className="lg:text-base text-xs font-medium">ED FOUNDATION</p>
            </div>
          </div>
        </section>
        <section id="courses" className="lg:mx-20 mx-4 py-10 bg-[#F9F7FFE5]">
          <div className="lg:w-1/2 py-10 mx-auto text-center">
            <h3 className="text-2xl font-medium">Explore Courses</h3>
            <p>Experthub Trainings is a training provider that specialises in accredited and
              bespoke training courses, We crush the barriers to getting a degree</p>
          </div>
          <div className="flex justify-between flex-wrap">
            {courses.slice(0, 9).map((course: any) =>
              <div className="card-container group lg:w-[32%]">
                <div key={course._id} className="card-front p-2 my-3 sm:w-full rounded-sm bg-white">
                  <img className="rounded-sm w-full h-40 object-cover" src={course.thumbnail} alt="" />
                  <div className="p-3">
                    <h3 className="font-medium my-3">{course.title}</h3>
                    <div className="flex justify-between">
                      <div className="flex">
                        <img className="w-6 h-6 rounded-full" src={course.instructorImage || "/images/user.png"} alt="" />
                        <p className="text-sm font-medium ml-3">{course.instructorName}</p>
                      </div>
                      {/* <p className="text-sm font-medium">45 Lessons</p> */}
                    </div>
                    <button onClick={() => { setCourse(course); setOpen(true) }} className="mt-4 inline-flex items-center px-5 py-2.5 border border-transparent text-sm leading-4 hover:scale-105 font-medium duration-300   bg-yellow-500  ">
                      Enroll Now
                    </button>
                  </div>

                </div>
                {/* Back Side */}
                <div className="card-back bg-gray p-4 rounded-md absolute top-0 left-0 w-full !h-full opacity-0 transform rotate-y-180 group-hover:opacity-100 group-hover:rotate-y-0">
                  <h3 className="font-medium text-lg mb-2">Course Benefits</h3>
                  <ul className="list-disc ml-5">
                    {course.benefits?.map((benefit: string, index: number) => (
                      <li key={index} className="text-sm">
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => { setCourse(course); setOpen(true) }} className="mt-4 inline-flex items-center px-5 py-2.5 border border-transparent text-sm leading-4 hover:scale-105 font-medium duration-300   bg-yellow-500  ">
                    Enroll Now
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="text-center my-10">
            <button className="bg-primary p-3 rounded-sm px-10">View More Courses</button>
          </div>
        </section>
        <section className="">
          <div className="lg:w-[35%] py-10 mx-auto text-center">
            <h3 className="text-2xl font-medium">Get To Your Success In 3 Simple Steps</h3>
            <p>Here's a glimpse into the 3 stages we'll adopt to execute this
              transformative training initiative</p>
          </div>
          <div className="lg:flex justify-between my-10 lg:px-20 px-4 border-t border-[#1E1E1EA6]">
            <div className="lg:-mt-6 mt-6 lg:w-[32%]">
              <div className="bg-[#DC9F08] w-12 h-12 text-xl pt-[10px] text-white font-mediun text-center rounded-full">1</div>
              <div className="mt-4">
                <h3 className="mb-3 font-medium">Needs Assessment and Skill Profiling</h3>
                <p>Before embarking on any journey, it's crucial to understand
                  the terrain. We will start by conducting a comprehensive
                  needs assessment to identify the specific digital skills in
                  demand. Our experts will also profile the existing skillsets
                  of aspiring learners to tailor our training programs effectively.
                  This stage ensures that each participant's learning path is
                  personalized, setting them up for success.</p>
              </div>
            </div>
            <div className="lg:-mt-6 mt-6 lg:w-[32%]">
              <div className="bg-[#1E1E1E] w-12 h-12 text-xl pt-[10px] text-white font-mediun text-center rounded-full">2</div>
              <div className="mt-4">
                <h3 className="mb-3 font-medium">Specialized Training Modules</h3>
                <p>Expert Hub Tranings is committed to offering a diverse
                  range of training modules that cater to the digital
                  ecosystem's multifaceted needs. Whether it's coding
                  data analysis, digital marketing, cybersecurity, or any
                  other tech domain, our training programs are designed
                  to foster expertise. We will bring in industry professionals
                  and subject matter experts to provide real-world insights
                  ensuring that our participants receive the most relevant
                  and up-to-date knowledge.</p>
              </div>
            </div>
            <div className="lg:-mt-6 mt-6 lg:w-[32%]">
              <div className="bg-[#1E1E1E] w-12 h-12 text-xl pt-[10px] text-white font-mediun text-center rounded-full">3</div>
              <div className="mt-4">
                <h3 className="mb-3 font-medium">Hands-On Experience and Placement</h3>
                <p>Learning by doing is our mantra. We believe in the power
                  of practical experience. In this stage, our participants will
                  work on real-world projects, gaining hands-on skills in a
                  supervised environment. Additionally, we'll collaborate with
                  leading tech companies to offer internship opportunities and
                  support in job placement through our platform 'ExpertHub Trainings'
                  an International Company Registered in the state of New York,
                  USA. Our ultimate goal is to facilitate the placement of 30,000
                  technical talents across Nigeria (and beyond) in this first phase.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="auth" className=" bg-[#F9F7FFE5]">
          <div className="lg:w-1/2 py-10 mx-auto text-center">
            <h3 className="text-2xl font-medium">Shape the future workforce</h3>
            <p>We invite individuals and trainers all over the world to submit applications for the initial phase of the training</p>
          </div>
          <div className="lg:flex justify-between">
            <div className="lg:w-[49%] relative">
              <img className="w-full lg:h-[80vh] object-cover" src="/images/fellow.png" alt="" />
              <div className="absolute w-[80%] left-0 text-white right-0 mx-auto text-center bottom-10">
                <h1 className="font-bold text-2xl my-4">Become A Fellow</h1>
                <p className="text-sm my-4">You don't need any previous knowledge just great English
                  speaking skills. It's easy fill and submit the form.</p>
                <Link href={"/auth/signup"}><button className="bg-primary text-black font-medium w-52 p-2 rounded-sm">Register Now</button></Link>
              </div>
            </div>

            <div className="lg:w-[49%] relative">
              <img className="w-full lg:h-[80vh] object-cover" src="/images/trainer.png" alt="" />
              <div className="absolute w-[80%] left-0 text-white right-0 mx-auto text-center bottom-10">
                <h1 className="font-bold text-2xl my-4">Become A Trainer</h1>
                <p className="text-sm my-4">Organizations & Individuals interested in becoming part of our network of
                  trainers to educate African fellows throughout as we develop
                  an effective strategy for training and deploying technical talents
                </p>
                <Link href={"/auth/signup?role=tutor"}><button className="bg-primary text-black font-medium w-52 p-2 rounded-sm">Register Now</button></Link>
              </div>
            </div>
          </div>
        </section>
        {/* <section id="instructors">
          <div className="lg:w-[35%] py-10 sm:px-4 mx-auto text-center">
            <h3 className="text-2xl font-medium">Our Instructors</h3>
            <p>Connect with top instructors that are sound and see the future in teaching</p>
          </div>
          <SliderComp />
        </section> */}
        <section className="my-20 relative">
          <img className="sm:h-[100vh]" src="/images/trainings-bg.png" alt="" />
          <div className="flex justify-between absolute lg:top-8 top-6 lg:left-20 sm:p-4">
            <div className="lg:w-[40%]">
              <h3 className="font-medium mb-5 text-2xl">Experthub Trainings Is Going To</h3>
              <ul>
                <li className="p-2">Provide comprehensive training programs that cover a wide
                  spectrum of tech skills, ensuring that you receive a well-rounded
                  education in your chosen field.</li>
                <li className="p-2">Provide insights, guidance, and practical expertise based on real
                  world experience from experienced and knowledgeable instructors.</li>
                <li className="p-2">Highly increase your confidence level to undertake bolder projects
                  in your industry and even in others</li>
                <li className="p-2">Tailor their training programs to suit your individual learning needs
                  ensuring that you receive a personalized education that matches
                  your pace and style.</li>
                <li className="p-2">Offer career placement services, helping you secure employment
                  or internships.</li>
                <li className="p-2">Teach you hands-on projects and exercises to reinforce your learning</li>
              </ul>
            </div>
            <img className="lg:block hidden" src="/images/trainings.png" alt="" />
          </div>
        </section>
        <section className="lg:mx-20 mx-4">
          <div className="lg:w-[70%] py-10 mx-auto text-center">
            <h3 className="text-2xl font-medium">JOIN OUR NETWORKS</h3>
            <p>We're not just a training provider; we're a career accelerator. We are dedicated to helping you
              not only become an expert in your field but also to apply that expertise to meaningful and financially rewarding work.</p>
          </div>
          <div className="lg:flex justify-between">
            <div className="lg:w-[32%] my-3 relative">
              <img src="/images/network_1.png" className="w-full" alt="" />
              <div className="absolute p-3 left-0 right-0 top-0">
                <div className="flex mb-3 text-white justify-between">
                  <p className="text-xl font-medium uppercase">Mentorship Beyond <br />
                    Training</p>
                  <img src="/images/icons/mic.svg" alt="" />
                </div>
                <p className="text-white text-sm">Expert Hub Trainings is the cornerstone of success in any field, and at Expert Hub LLC, we understand its importance. As you complete your training, we don't leave you hanging. We provide mentorship to guide you through your career path. Our mentors are seasoned professionals with a wealth of experience in their respective fields. They will offer insights, advice, and support to help you navigate the complexities of your chosen industry.</p>
              </div>
            </div>
            <div className="lg:w-[32%] my-3 relative">
              <img src="/images/network_2.png" className="w-full" alt="" />
              <div className="absolute p-3 left-0 right-0 top-0">
                <div className="flex mb-3 text-white justify-between">
                  <p className="text-xl font-medium uppercase w-[60%]">Opportunities to Make Money</p>
                  <img src="/images/icons/mic.svg" alt="" />
                </div>
                <p className="text-white text-sm">At Expert Hub Trainings, we're not just about learning; we're about application. As soon as you complete your training, we're thrilled to enlist you into our prestigious network of experts. What does this mean for you? It means you gain access to a diverse pool of businesses and clients looking for your expertise</p>
              </div>
            </div>
            <div className="lg:w-[32%] my-3 relative">
              <img src="/images/network_1.png" className="w-full" alt="" />
              <div className="absolute p-3 left-0 right-0 top-0">
                <div className="flex mb-3 text-white justify-between">
                  <p className="text-xl font-medium uppercase w-[60%]">Join Our Network of Experts</p>
                  <img src="/images/icons/mic.svg" alt="" />
                </div>
                <p className="text-white text-sm">Our platform is a marketplace of opportunity. As a member of our expert network, you can browse through a wide range of job listings and projects that align with your skills and interests. Whether you're a tech guru, a virtual assistant, or a journalist, there are opportunities waiting for you. Your journey doesn't stop at learning – it continues with earning.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20">
          <div className="text-center">
            <h3 className="text-2xl font-medium">Frequently Asked Questions</h3>
            <div className="w-20 my-6 mx-auto h-1 bg-primary"></div>
          </div>
          <div className="lg:w-[60%] sm:mx-4 mx-auto">
            <Collapse items={items} defaultActiveKey={['1']} expandIconPosition={"end"} ghost={true} size={"large"} />
          </div>
        </section>
      </main>
      <FooterNav />
      {
        course && <CourseDetails course={course} open={open} action={"Course"} type='enroll' call={getCourses} handleClick={() => setOpen(false)} />
      }
    </Fragment>
  )
}
