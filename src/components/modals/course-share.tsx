'use client'

import { useState } from 'react'
import { Check, CheckCircle, ClipboardCopy, Copy, Share2 } from 'lucide-react'


export default function ShareSection({ marketLink, courseTitle, courseDescription }: { marketLink: string, courseTitle: string, courseDescription: string }) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(marketLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: courseTitle,
                    text: courseDescription,
                    url: marketLink,
                })
            } catch (err) {
                copyToClipboard()
            }
        } else {
            copyToClipboard()
        }
    }

    return (
        <div className="flex flex-col gap-3 items-center mt-8 md:absolute bottom-4 right-4 rounded-lg border px-4 py-3 shadow-md bg-white dark:bg-accent">
            <p className='w-full '>Share this Course</p>
            <div className='flex items-center gap-3  w-full'>
                <button
                    onClick={copyToClipboard}
                    className="flex w-[90px] text-center items-center gap-1 text-sm px-3 py-1.5 border hover:border-black border-black/50 rounded-md bg-muted hover:bg-muted/80 transition"
                >
                    {copied ? <Check className="w-5 h-5 text-green-500" />
                        : <Copy className="w-5 h-5" />
                    }
                    {copied ? 'Copied!' : 'Copy'}
                </button>

                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md bg-primary  hover:bg-primary/70 transition"
                >
                    <Share2 className="w-5 h-5" />
                    Share Market Link
                </button>
            </div>
        </div>
    )
}
