import { AboutUs } from "./components/about-us";
import Partner from "./components/partner";
import CourseCategories from "./components/categories";
import Contact from "./components/contact";
import CallToAction from "./components/cta";
import { FAQ } from "./components/faq";
import Features from "./components/features";
import Footer from "./components/footer";
import { Hero } from "./components/hero";
import { Navigation } from "./components/nav";
import Testimonials from "./components/testimonials";
import Team from "./components/team";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  return (
    <main className={`min-h-screen bg-white `} >
      <Navigation />
      <Hero />
      {/* <AboutUs /> */}
      <Features />
      <CourseCategories />
      <Partner />
      <Testimonials />
      <CallToAction />
      {/* <Team /> */}
      <Contact />
      <FAQ />
      <Footer />
    </main>
  )
}
