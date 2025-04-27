'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ShareButton({ urlToShare, title, about }: { urlToShare: string, title: string, about: string }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: about,
                    url: urlToShare,
                });
            } catch (error) {
                console.error('Share cancelled or failed:', error);
            }
        } else {
            await navigator.clipboard.writeText(urlToShare);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex mt-6 mb-4 mx-auto w-[200px] justify-center items-center gap-2 px-4 py-2 bg-white border border-primary rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
            {copied ? (
                <Check size={20} className="" />
            ) : (
                <Share2 size={20} className="" />
            )}
            <span className="font-medium">{copied ? 'Copied!' : 'Share'}</span>
        </button>
    );
}
