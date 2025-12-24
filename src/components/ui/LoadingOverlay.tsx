"use client";

import React from 'react';

interface LoadingOverlayProps {
    isOpen: boolean;
    text?: string;
}

export default function LoadingOverlay({ isOpen, text = "Cargando..." }: LoadingOverlayProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
            <div className="relative flex flex-col items-center">
                {/* Spinner */}
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

                {/* Logo or Icon (Optional, can be added later) */}
                {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="text-xl">🦷</span>
                </div> */}

                {/* Text */}
                <div className="mt-4 text-center">
                    <p className="text-lg font-semibold text-gray-700 animate-pulse">{text}</p>
                </div>
            </div>
        </div>
    );
}
