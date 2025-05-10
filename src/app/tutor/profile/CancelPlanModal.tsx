'use client';

import { useEffect, useRef } from 'react';

type CancelPlanModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    planName: string;
    isLoading: boolean;
};

export default function CancelPlanModal({
    isOpen,
    onClose,
    onConfirm,
    planName,
    isLoading
}: CancelPlanModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden transform transition-all"
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Cancel {planName} Plan</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-4">
                        <div className="bg-yellow-50 p-4 rounded-md mb-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>By canceling your {planName} plan, you will lose access to:</p>
                                        <ul className="list-disc pl-5 mt-1 space-y-1">
                                            {planName === "standard" && (
                                                <>
                                                    <li>Creating up to 20 courses and events</li>
                                                    <li>Live streaming courses</li>
                                                    <li>Email sending tools</li>
                                                    <li>Team member management</li>
                                                </>
                                            )}
                                            {planName === "enterprise" && (
                                                <>
                                                    <li>Unlimited courses and events</li>
                                                    <li>Live streaming courses</li>
                                                    <li>Email sending tools</li>
                                                    <li>Team member management</li>
                                                    <li>Staff support</li>
                                                    <li>AI tools for course creation</li>
                                                </>
                                            )}
                                        </ul>
                                        {/* <p className="mt-2">Your plan will remain active until the end of your current billing period.</p> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                            Keep My Plan
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Processing...
                                </div>
                            ) : (
                                "Cancel Plan"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
