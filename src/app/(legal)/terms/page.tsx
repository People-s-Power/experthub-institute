import { ChevronRight, Mail } from "lucide-react"
import HeaderNav from "../components/header-nav"
import FooterNav from "@/components/FooterNav"
import Link from "next/link"


export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
            {/* Header */}
                <HeaderNav />

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Title Section */}
                    <div className="bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-300 px-6 py-8 sm:px-4">
                        <h1 className="text-3xl font-bold ">Terms and Conditions</h1>
                        <p className="mt-2 text-zinc-700">Last Updated: April 2025</p>
                    </div>

                    {/* Introduction */}
                    <div className="p-6 sm:p-4 border-b border-zinc-100">
                        <p className="text-zinc-700 leading-relaxed">
                            Welcome to Experthub Trainings. By using our platform and services, including the creation of online
                            courses, participation in physical or online training events, and subscribing to our courses, you agree to
                            be bound by these Terms and Conditions. Please read these terms carefully before using our platform. If
                            you do not agree to these terms, you should not use our platform or services.
                        </p>
                    </div>

                    {/* Table of Contents */}
                    <div className="p-6 sm:p-4 bg-zinc-50 border-b border-zinc-100">
                        <h2 className="text-xl font-semibold text-zinc-800 mb-4">Contents</h2>
                        <ul className="space-y-2">
                            {[
                                { id: "introduction", title: "Introduction" },
                                { id: "services", title: "Services Provided" },
                                { id: "eligibility", title: "Eligibility" },
                                { id: "account", title: "Account Creation and Security" },
                                { id: "content", title: "Course Creation and Content" },
                                { id: "subscriptions", title: "Subscriptions and Payments" },
                                { id: "platform", title: "Use of the Platform" },
                                { id: "events", title: "Events and Physical Trainings" },
                                { id: "ip", title: "Intellectual Property" },
                                { id: "termination", title: "Termination and Suspension" },
                                { id: "liability", title: "Limitation of Liability" },
                                { id: "indemnification", title: "Indemnification" },
                                { id: "privacy", title: "Privacy" },
                                { id: "changes", title: "Changes to Terms" },
                                { id: "law", title: "Governing Law" },
                                { id: "contact", title: "Contact Us" },
                            ].map((item) => (
                                <li key={item.id} className="flex items-center">
                                    <ChevronRight className="h-4 w-4 text-primary mr-2" />
                                    <a href={`#${item.id}`} className="text-zinc-700 hover:text-primary transition-colors">
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Main Content Sections */}
                    <div className="p-6 sm:p-4 space-y-8">
                        {/* Section 1 */}
                        <section id="introduction" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">1</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Introduction</h2>
                            </div>
                            <div className="pl-11">
                                <p className="text-zinc-700 leading-relaxed">
                                    Experthub Trainings ("we", "us", "our") provides a platform that enables individuals to create, share,
                                    and access online courses and training materials. We offer both an online platform for creating and
                                    selling courses, as well as physical training events and online subscriptions for course
                                    participation. By accessing or using the Experthub Trainings platform, you agree to comply with these
                                    Terms and Conditions, as well as our Privacy Policy.
                                </p>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section id="services" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">2</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Services Provided</h2>
                            </div>
                            <div className="pl-11">
                                <p className="text-zinc-700 leading-relaxed mb-4">
                                    Experthub Trainings provides the following services:
                                </p>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-zinc-200">
                                        <h3 className="font-semibold text-zinc-800 border-b border-zinc-100 pb-2 mb-2">
                                            Course Creation and Sales
                                        </h3>
                                        <p className="text-zinc-700 text-sm">
                                            Users may create and upload their own courses to be sold or shared through our platform.
                                        </p>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-zinc-200">
                                        <h3 className="font-semibold text-zinc-800 border-b border-zinc-100 pb-2 mb-2">
                                            Course Subscription
                                        </h3>
                                        <p className="text-zinc-700 text-sm">
                                            Users can subscribe to access various online courses created by other instructors.
                                        </p>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-zinc-200">
                                        <h3 className="font-semibold text-zinc-800 border-b border-zinc-100 pb-2 mb-2">
                                            Physical Trainings and Events
                                        </h3>
                                        <p className="text-zinc-700 text-sm">
                                            We offer in-person training and events for users who wish to participate in hands-on learning
                                            experiences.
                                        </p>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-zinc-200">
                                        <h3 className="font-semibold text-zinc-800 border-b border-zinc-100 pb-2 mb-2">
                                            Course Management
                                        </h3>
                                        <p className="text-zinc-700 text-sm">
                                            Instructors can manage, edit, and track the progress of their courses and student interactions on
                                            the platform.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section id="eligibility" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">3</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Eligibility</h2>
                            </div>
                            <div className="pl-11">
                                <p className="text-zinc-700 leading-relaxed mb-4">To use Experthub Trainings, you must:</p>

                                <div className="bg-zinc-50 p-5 rounded-lg border border-zinc-200">
                                    <ul className="space-y-3">
                                        <li className="flex">
                                            <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center mt-0.5 mr-3">
                                                <span className="text-white text-xs font-bold">✓</span>
                                            </div>
                                            <p className="text-zinc-700">
                                                Be at least 18 years of age or the legal age of majority in your jurisdiction.
                                            </p>
                                        </li>
                                        <li className="flex">
                                            <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center mt-0.5 mr-3">
                                                <span className="text-white text-xs font-bold">✓</span>
                                            </div>
                                            <p className="text-zinc-700">Have the legal capacity to enter into these Terms and Conditions.</p>
                                        </li>
                                        <li className="flex">
                                            <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center mt-0.5 mr-3">
                                                <span className="text-white text-xs font-bold">✓</span>
                                            </div>
                                            <p className="text-zinc-700">
                                                Provide accurate and complete registration information if required.
                                            </p>
                                        </li>
                                    </ul>
                                    <p className="mt-4 text-zinc-700">
                                        By using the platform, you confirm that you meet the eligibility requirements.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section id="account" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">4</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Account Creation and Security</h2>
                            </div>
                            <div className="pl-11">
                                <div className="bg-zinc-50 p-4 rounded-lg border-l-4 border-primary">
                                    <p className="text-zinc-700 leading-relaxed">
                                        To access certain features of Experthub Trainings, you may need to create an account. You agree to
                                        provide accurate and current information when registering and to keep your account details up to
                                        date. You are responsible for maintaining the confidentiality of your login credentials and for all
                                        activities under your account.
                                    </p>
                                    <p className="mt-4 text-zinc-700 leading-relaxed">
                                        You agree to notify Experthub Trainings immediately if you suspect any unauthorized access to your
                                        account.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section id="content" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">5</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Course Creation and Content</h2>
                            </div>
                            <div className="pl-11">
                                <div className="space-y-4">
                                    <div className="rounded-lg overflow-hidden border border-zinc-200">
                                        <div className="bg-zinc-800 px-4 py-2">
                                            <h3 className="text-white font-medium">Ownership</h3>
                                        </div>
                                        <div className="p-4 bg-white">
                                            <p className="text-zinc-700">
                                                As a course creator, you retain ownership of the content you upload to the platform. However, by
                                                uploading your content, you grant Experthub Trainings a non-exclusive, royalty-free license to
                                                use, display, and distribute your content through the platform.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg overflow-hidden border border-zinc-200">
                                        <div className="bg-zinc-800 px-4 py-2">
                                            <h3 className="text-white font-medium">Content Guidelines</h3>
                                        </div>
                                        <div className="p-4 bg-white">
                                            <p className="text-zinc-700">
                                                You agree that any course or content you upload does not infringe upon the intellectual property
                                                rights of others. You are solely responsible for ensuring that your content complies with
                                                applicable laws and regulations.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg overflow-hidden border border-zinc-200">
                                        <div className="bg-zinc-800 px-4 py-2">
                                            <h3 className="text-white font-medium">Quality Standards</h3>
                                        </div>
                                        <div className="p-4 bg-white">
                                            <p className="text-zinc-700">
                                                Experthub Trainings reserves the right to review and remove any content that does not meet our
                                                quality standards or violates these Terms and Conditions.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 6 */}
                        <section id="subscriptions" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">6</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Subscriptions and Payments</h2>
                            </div>
                            <div className="pl-11">
                                <div className="space-y-4">
                                    <div className="bg-zinc-50 p-4 rounded-lg border-l-4 border-primary">
                                        <h3 className="font-semibold text-zinc-800">Subscriptions</h3>
                                        <p className="mt-2 text-zinc-700">
                                            Users may subscribe to courses for a fee or participate in paid events. All payments are processed
                                            through our secure payment system, and fees will be clearly communicated at the time of
                                            subscription.
                                        </p>
                                    </div>

                                    <div className="bg-zinc-50 p-4 rounded-lg border-l-4 border-primary">
                                        <h3 className="font-semibold text-zinc-800">Pricing</h3>
                                        <p className="mt-2 text-zinc-700">
                                            We reserve the right to change the pricing for courses and events at any time, but any changes
                                            will not affect your current subscription until the next billing cycle.
                                        </p>
                                    </div>

                                    <div className="bg-zinc-50 p-4 rounded-lg border-l-4 border-primary">
                                        <h3 className="font-semibold text-zinc-800">Refunds</h3>
                                        <p className="mt-2 text-zinc-700">
                                            We may offer refunds under specific circumstances, such as in the case of faulty or inaccessible
                                            course content. Refund requests must be submitted according to our Refund Policy.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 7 */}
                        <section id="platform" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">7</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Use of the Platform</h2>
                            </div>
                            <div className="pl-11">
                                <p className="text-zinc-700 leading-relaxed mb-4">You agree to:</p>

                                <div className="bg-white p-5 rounded-lg shadow-sm border border-zinc-200">
                                    <ul className="space-y-3">
                                        <li className="flex">
                                            <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center mt-0.5 mr-3">
                                                <span className="text-white text-xs font-bold">✓</span>
                                            </div>
                                            <p className="text-zinc-700">Use the platform only for lawful purposes.</p>
                                        </li>
                                        <li className="flex">
                                            <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center mt-0.5 mr-3">
                                                <span className="text-white text-xs font-bold">✓</span>
                                            </div>
                                            <p className="text-zinc-700">
                                                Not engage in any activity that may disrupt or interfere with the functionality of the platform.
                                            </p>
                                        </li>
                                        <li className="flex">
                                            <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center mt-0.5 mr-3">
                                                <span className="text-white text-xs font-bold">✓</span>
                                            </div>
                                            <p className="text-zinc-700">
                                                Not engage in any fraudulent or deceptive practices when using our services.
                                            </p>
                                        </li>
                                        <li className="flex">
                                            <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center mt-0.5 mr-3">
                                                <span className="text-white text-xs font-bold">✓</span>
                                            </div>
                                            <p className="text-zinc-700">Not upload any viruses or malicious code to the platform.</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Section 8 */}
                        <section id="events" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">8</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Events and Physical Trainings</h2>
                            </div>
                            <div className="pl-11">
                                <p className="text-zinc-700 leading-relaxed mb-4">
                                    Experthub Trainings offers physical events, seminars, and training sessions. You acknowledge and agree
                                    that:
                                </p>

                                <div className="bg-zinc-50 p-5 rounded-lg border border-zinc-200">
                                    <ul className="space-y-3">
                                        <li className="flex">
                                            <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center mt-0.5 mr-3">
                                                <span className="text-white text-xs font-bold">✓</span>
                                            </div>
                                            <p className="text-zinc-700">
                                                You are responsible for any travel or lodging expenses associated with attending physical
                                                training events.
                                            </p>
                                        </li>
                                        <li className="flex">
                                            <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center mt-0.5 mr-3">
                                                <span className="text-white text-xs font-bold">✓</span>
                                            </div>
                                            <p className="text-zinc-700">
                                                Experthub Trainings reserves the right to cancel or reschedule events as necessary, in which
                                                case we will notify you as soon as possible.
                                            </p>
                                        </li>
                                        <li className="flex">
                                            <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center mt-0.5 mr-3">
                                                <span className="text-white text-xs font-bold">✓</span>
                                            </div>
                                            <p className="text-zinc-700">
                                                Any in-person training events may be subject to separate terms, which you will be required to
                                                accept upon registering.
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Section 9 */}
                        <section id="ip" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">9</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Intellectual Property</h2>
                            </div>
                            <div className="pl-11">
                                <div className="bg-zinc-800 text-white p-5 rounded-lg">
                                    <p className="leading-relaxed">
                                        All content, software, logos, trademarks, and materials provided by Experthub Trainings are the
                                        intellectual property of Experthub Trainings and its licensors, and are protected by copyright and
                                        other intellectual property laws. You may not reproduce, distribute, or otherwise use any of our
                                        intellectual property without prior written consent.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 10 */}
                        <section id="termination" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">10</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Termination and Suspension</h2>
                            </div>
                            <div className="pl-11">
                                <div className="bg-zinc-50 p-4 rounded-lg border-l-4 border-primary">
                                    <p className="text-zinc-700 leading-relaxed">
                                        Experthub Trainings reserves the right to suspend or terminate your access to the platform at our
                                        sole discretion if we believe you have violated these Terms and Conditions. Upon termination, you
                                        must immediately cease using the platform and may lose access to any content or data associated with
                                        your account.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 11 */}
                        <section id="liability" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">11</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Limitation of Liability</h2>
                            </div>
                            <div className="pl-11">
                                <div className="bg-zinc-50 p-4 rounded-lg border-l-4 border-primary">
                                    <p className="text-zinc-700 leading-relaxed">
                                        To the fullest extent permitted by law, Experthub Trainings is not liable for any indirect,
                                        incidental, special, or consequential damages arising out of your use of the platform or any course
                                        you create or take, even if we have been advised of the possibility of such damages.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 12 */}
                        <section id="indemnification" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">12</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Indemnification</h2>
                            </div>
                            <div className="pl-11">
                                <div className="bg-zinc-50 p-4 rounded-lg border-l-4 border-primary">
                                    <p className="text-zinc-700 leading-relaxed">
                                        You agree to indemnify, defend, and hold harmless Experthub Trainings, its affiliates, officers,
                                        employees, and agents from any claim, liability, loss, damage, or expense (including reasonable
                                        attorneys' fees) arising out of your use of the platform or any violation of these Terms and
                                        Conditions.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 13 */}
                        <section id="privacy" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">13</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Privacy</h2>
                            </div>
                            <div className="pl-11">
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-zinc-200">
                                    <p className="text-zinc-700 leading-relaxed">
                                        Your use of Experthub Trainings is governed by our Privacy Policy, which outlines how we collect,
                                        use, and protect your personal information. By using the platform, you consent to the collection and
                                        use of your information as described in the Privacy Policy.
                                    </p>
                                    <div className="mt-4">
                                        <Link href="/privacy" className="inline-flex items-center text-primary hover:underline">
                                            View our Privacy Policy
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 14 */}
                        <section id="changes" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">14</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Changes to Terms</h2>
                            </div>
                            <div className="pl-11">
                                <div className="bg-zinc-50 p-4 rounded-lg border-l-4 border-primary">
                                    <p className="text-zinc-700 leading-relaxed">
                                        We may update these Terms and Conditions from time to time. Any changes will be effective when
                                        posted on the platform. You are encouraged to review these Terms regularly to stay informed of any
                                        updates.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 15 */}
                        <section id="law" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">15</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Governing Law</h2>
                            </div>
                            <div className="pl-11">
                                <div className="bg-zinc-50 p-4 rounded-lg border-l-4 border-primary">
                                    <p className="text-zinc-700 leading-relaxed">
                                        These Terms and Conditions are governed by and construed in accordance with the laws of the United
                                        States. Any dispute arising out of or in connection with these Terms shall be subject to the
                                        exclusive jurisdiction of the courts located in the United States.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 16 */}
                        <section id="contact" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">16</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Contact Us</h2>
                            </div>
                            <div className="pl-11">
                                <p className="text-zinc-700 leading-relaxed">
                                    If you have any questions or concerns about these Terms and Conditions, please contact us at:
                                </p>

                                <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                                    <h3 className="text-xl font-bold text-zinc-800 mb-4">Experthub Trainings</h3>
                                    <div className="space-y-3">
                                        <Link href={"mailto:support@experthubllc.com"} className="flex items-center">
                                            <Mail className="h-5 w-5 text-primary mr-3" />
                                            <span className="text-zinc-700">support@experthubllc.com</span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                                    <p className="text-zinc-700 italic">
                                        By using the Experthub Trainings platform, you acknowledge that you have read, understood, and agree
                                        to these Terms and Conditions.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <FooterNav />
        </div>
    )
}
