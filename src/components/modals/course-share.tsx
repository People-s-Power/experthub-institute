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
        <div className="flex flex-col  items-center mt-1 ">
            <div className='flex items-center gap-3    w-full'>
                <button
                    onClick={copyToClipboard}
                    className="flex  text-center items-center gap-1 text-xs w-fit   border-black/40 rounded-md bg-muted hover:bg-muted/80 transition"
                >
                    {copied ? <Check className="w-5 h-5 text-green-500" />
                        : <Copy className="w-4 h-4" />
                    }
                    {copied ? 'Copied!' : 'Copy'}
                </button>

                <button
                    onClick={handleShare}
                    className="flex items-center gap-1 text-xs  rounded-md  duration-300"
                >
                    <Share2 className="w-4 h-4" />
                    Share
                </button>
            </div>
        </div>
    )
}
