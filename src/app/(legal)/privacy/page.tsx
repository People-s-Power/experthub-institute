import Link from 'next/link'
import { ChevronRight, Mail, Phone } from 'lucide-react'
import FooterNav from '@/components/FooterNav'
import HeaderNav from '../components/header-nav'

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
            {/* Header */}
            {/* Header */}
                <HeaderNav />


            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Title Section */}
                    <div className="bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-300 px-6 py-8 sm:px-4">
                        <h1 className="text-3xl font-bold ">Privacy Policy</h1>
                        <p className="mt-2 text-zinc-700">Last Updated: April, 2025</p>
                    </div>

                    {/* Introduction */}
                    <div className="p-6 sm:p-4 border-b border-zinc-100">
                        <p className="text-zinc-700 leading-relaxed">
                            Our aim is to encourage people anywhere in the world to speak out in order to make the change they want for their communities and the world at large. This platform enables you to use our technology with adequate protection of your privacy and security.
                        </p>
                        <p className="mt-4 text-zinc-700 leading-relaxed">
                            Our privacy policy deals with the information that we collect from you while you are using our platform and how we make use of those information. It also covers your privacy setting as you are allowed to set your privacy the way you want it.
                        </p>
                    </div>

                    {/* Table of Contents */}
                    <div className="p-6 sm:p-4 bg-zinc-50 border-b border-zinc-100">
                        <h2 className="text-xl font-semibold text-zinc-800 mb-4">Contents</h2>
                        <ul className="space-y-2">
                            {[
                                { id: "information", title: "What Kind of Information Do We Collect?" },
                                { id: "use", title: "How Do We Use This Information?" },
                                { id: "sharing", title: "How Is This Information Shared?" },
                                { id: "manage", title: "How Can I Manage or Edit My Privacy?" },
                                { id: "retention", title: "Data Retention and Security" },
                                { id: "changes", title: "How Experthub Shall Notify You of Changes" },
                                { id: "contact", title: "Contacting Us" }
                            ].map((item) => (
                                <li key={item.id} className="flex items-center">
                                    <ChevronRight className="h-4 w-4 text-primary mr-2" />
                                    <a
                                        href={`#${item.id}`}
                                        className="text-zinc-700 hover:text-primary transition-colors"
                                    >
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Main Content Sections */}
                    <div className="p-6 sm:p-4 space-y-8">
                        {/* Section 1 */}
                        <section id="information" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">1</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">What Kind of Information Do We Collect?</h2>
                            </div>
                            <div className="pl-11">
                                <p className="text-zinc-700 leading-relaxed">
                                    In order to give you the best service that you may need, we must process information about you. When you register with us as a user through our platform, you are creating an account with us and all your activities on our platform are then tied to your account.
                                </p>

                                <div className="mt-4 space-y-4">
                                    <div className="bg-zinc-50 p-4 rounded-lg border-l-4 border-primary">
                                        <h3 className="font-semibold text-zinc-800">Information and Content You Provide</h3>
                                        <p className="mt-2 text-zinc-700">
                                            We collect the content, communications and other information you provide when you use our platform, sign up for an account, create or share content, and message or communicate with others.
                                        </p>
                                    </div>

                                    <div className="bg-zinc-50 p-4 rounded-lg border-l-4 border-primary">
                                        <h3 className="font-semibold text-zinc-800">Network and Connections</h3>
                                        <p className="mt-2 text-zinc-700">
                                            We collect information about the people, pages, accounts, hashtags and groups you are connected to and how you interact with them across our platform.
                                        </p>
                                    </div>

                                    <div className="bg-zinc-50 p-4 rounded-lg border-l-4 border-primary">
                                        <h3 className="font-semibold text-zinc-800">Your Usage</h3>
                                        <p className="mt-2 text-zinc-700">
                                            We collect information about how you use our platform such as the type of content you view or engage with; the features you use; the actions you take; the people or account you interact with.
                                        </p>
                                    </div>

                                    <div className="bg-zinc-50 p-4 rounded-lg border-l-4 border-primary">
                                        <h3 className="font-semibold text-zinc-800">Device Information</h3>
                                        <p className="mt-2 text-zinc-700">
                                            We collect information from and about the computers, phones, connected TV and other connected devices you use.
                                        </p>
                                        <ul className="mt-2 list-disc list-inside text-zinc-700 space-y-1">
                                            <li>Device attributes (OS, hardware versions, battery level, etc.)</li>
                                            <li>Device operations and behaviors</li>
                                            <li>Data from device settings</li>
                                            <li>Network and connection information</li>
                                            <li>Cookie data</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section id="use" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">2</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">How Do We Use This Information?</h2>
                            </div>
                            <div className="pl-11">
                                <p className="text-zinc-700 leading-relaxed">
                                    We use the information you provide to run our platform to support you with our services in the following ways:
                                </p>

                                <div className="mt-4 space-y-6">
                                    <div className="rounded-lg overflow-hidden border border-zinc-200">
                                        <div className="bg-zinc-800 px-4 py-2">
                                            <h3 className="text-white font-medium">Personalize & Improve Our Technology</h3>
                                        </div>
                                        <div className="p-4 bg-white">
                                            <p className="text-zinc-700">
                                                We use the information we receive to personalize features and content and make suggestions for you such as the course or event you may be interested in enrolling or participating.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg overflow-hidden border border-zinc-200">
                                        <div className="bg-zinc-800 px-4 py-2">
                                            <h3 className="text-white font-medium">Promote Safety, Integrity and Security</h3>
                                        </div>
                                        <div className="p-4 bg-white">
                                            <p className="text-zinc-700">
                                                We use the information you provide to run a verification of accounts and activities, fight harmful conduct, detect and prevent spam or other bad experiences.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg overflow-hidden border border-zinc-200">
                                        <div className="bg-zinc-800 px-4 py-2">
                                            <h3 className="text-white font-medium">Communicate With You</h3>
                                        </div>
                                        <div className="p-4 bg-white">
                                            <p className="text-zinc-700">
                                                We use the information you provide to send to you marketing and promoting communications, communicate with you about your campaign and also to let you know of our policies and terms of service.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg overflow-hidden border border-zinc-200">
                                        <div className="bg-zinc-800 px-4 py-2">
                                            <h3 className="text-white font-medium">Research and Innovation</h3>
                                        </div>
                                        <div className="p-4 bg-white">
                                            <p className="text-zinc-700">
                                                We further use your information to conduct and support research and innovation on topics of general social policy, human rights and campaign, improvement on our technology, public interest, health and well-being.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section id="sharing" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">3</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">How Is This Information Shared?</h2>
                            </div>
                            <div className="pl-11">
                                <p className="text-zinc-700 leading-relaxed">
                                    Your information is shared with others in the following ways:
                                </p>

                                <div className="mt-4 grid md:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-zinc-200">
                                        <h3 className="font-semibold text-zinc-800 border-b border-zinc-100 pb-2 mb-2">Our Community</h3>
                                        <p className="text-zinc-700 text-sm">
                                            Your information on our platform such as the course and events that you create will all be shown to other users on the platform.
                                        </p>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-zinc-200">
                                        <h3 className="font-semibold text-zinc-800 border-b border-zinc-100 pb-2 mb-2">Sharing on Social Media</h3>
                                        <p className="text-zinc-700 text-sm">
                                            When you choose to use third party Apps, websites or other services that use, or are integrated with our products, they can receive information about your post, courses and events that you share.
                                        </p>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-zinc-200">
                                        <h3 className="font-semibold text-zinc-800 border-b border-zinc-100 pb-2 mb-2">Third Party Sharing</h3>
                                        <p className="text-zinc-700 text-sm">
                                            We work with third party partners who help us provide and improve our products which makes it possible for us to operate our companies and provide free services to people around the world.
                                        </p>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-zinc-200">
                                        <h3 className="font-semibold text-zinc-800 border-b border-zinc-100 pb-2 mb-2">Legal Requests</h3>
                                        <p className="text-zinc-700 text-sm">
                                            We may share your information with the law enforcement Agents or in response to legal requests or upon an order by a court of competent jurisdiction.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section id="manage" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">4</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">How Can I Manage or Edit My Privacy?</h2>
                            </div>
                            <div className="pl-11">
                                <p className="text-zinc-700 leading-relaxed">
                                    Our platform provides you with the ability to either edit, manage, port, access or delete your data.
                                </p>

                                <div className="mt-4 bg-zinc-50 p-5 rounded-lg border border-zinc-200">
                                    <ul className="space-y-3">
                                        <li className="flex">
                                            <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center mt-0.5 mr-3">
                                                <span className="text-white text-xs font-bold">✓</span>
                                            </div>
                                            <p className="text-zinc-700">
                                                When you enrol for a course or event through our platform, a profile is being created to enable you take learn and participate in the course or event.
                                            </p>
                                        </li>
                                        <li className="flex">
                                            <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center mt-0.5 mr-3">
                                                <span className="text-white text-xs font-bold">✓</span>
                                            </div>
                                            <p className="text-zinc-700">
                                                You can at any time manage your account settings through our privacy settings provided.
                                            </p>
                                        </li>
                                        <li className="flex">
                                            <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center mt-0.5 mr-3">
                                                <span className="text-white text-xs font-bold">✓</span>
                                            </div>
                                            <p className="text-zinc-700">
                                                We also send you marketing emails in respect to campaigns you started and endorsed. You may as well manage your privacy and preferences in respect to those mails.
                                            </p>
                                        </li>
                                        <li className="flex">
                                            <div className="flex-shrink-0 h-5 w-5 bg-primary rounded-full flex items-center justify-center mt-0.5 mr-3">
                                                <span className="text-white text-xs font-bold">✓</span>
                                            </div>
                                            <p className="text-zinc-700">
                                                You may as well choose to delete your account with us. When you delete your account, we delete certain information you have provided.
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section id="retention" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">5</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Data Retention and Security</h2>
                            </div>
                            <div className="pl-11">
                                <div className="bg-zinc-50 p-5 rounded-lg border border-zinc-200">
                                    <h3 className="font-semibold text-zinc-800 mb-3">How Do We Operate and Transfer Data?</h3>
                                    <p className="text-zinc-700 leading-relaxed">
                                        We share information globally, both internally within the Experthub group of companies, and externally with our partners and with those you connect and share with around the world in accordance with this policy.
                                    </p>
                                    <p className="mt-3 text-zinc-700 leading-relaxed">
                                        Your information may for example, be transferred or transmitted to, or stored and processed in the United Kingdom, the United States, Singapore or other countries outside where you live for the purposes as described in this policy.
                                    </p>
                                    <p className="mt-3 text-zinc-700 leading-relaxed">
                                        These data transfers are necessary to provide the services stipulated in the our terms of service and to globally operate and provide our products to you. We use standard contract clauses, rely on the European Commission's adequacy decisions about certain countries, as applicable, and obtain your consent for these data transfers to Africa, the United States and other countries.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 6 */}
                        <section id="changes" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 min-h-8 min-w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">6</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">How Experthub Shall Notify You of Changes</h2>
                            </div>
                            <div className="pl-11">
                                <div className="bg-zinc-800 text-white p-5 rounded-lg">
                                    <p className="leading-relaxed">
                                        Before making any changes to our privacy policy, we will ensure that you are first notified of those changes and give you the opportunity to review any purported changes in order for you to decide if you should continue using our platform.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 7 */}
                        <section id="contact" className="scroll-mt-20">
                            <div className="flex items-center mb-4">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <span className="text-white font-bold">7</span>
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-800">Contacting Us</h2>
                            </div>
                            <div className="pl-11">
                                <p className="text-zinc-700 leading-relaxed">
                                    You are free and highly welcome to contact us at any time as regards any question, concern, feedback regarding our privacy policy. Please feel free to contact our Data Protection team at the following address:
                                </p>

                                <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                                    <h3 className="text-xl font-bold text-zinc-800 mb-4">DATA PROTECTION UNIT</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <Phone className="h-5 w-5 text-primary mr-3" />
                                            <span className="text-zinc-700">+17372101130 – USA</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Mail className="h-5 w-5 text-primary mr-3" />
                                            <span className="text-zinc-700">INFO@EXPERTHUBLLC.COM</span>
                                        </div>
                                    </div>
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
