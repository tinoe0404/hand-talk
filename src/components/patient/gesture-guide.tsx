"use client";

import React from "react";
import Image from "next/image";

export function GestureGuide() {
    return (
        <div className="fixed inset-0 z-30 bg-medical-green-950 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-widest mb-12">
                Your Safety Gestures
            </h1>

            <div className="grid grid-cols-2 gap-8 w-full max-w-5xl">
                {/* Thumbs Up */}
                <div className="bg-medical-green-900 border-4 border-medical-green-600 rounded-3xl p-8 flex flex-col items-center justify-center transition-transform hover:scale-105 shadow-clinical-lg">
                    <div className="w-32 h-32 md:w-48 md:h-48 relative mb-6">
                        <Image src="/icons/thumbs-up.svg" alt="Thumbs Up" fill className="object-contain" priority />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Thumbs Up</h2>
                    <p className="text-xl md:text-2xl text-medical-green-300 font-bold">I am okay</p>
                </div>

                {/* Open Palm */}
                <div className="bg-medical-green-900 border-4 border-medical-green-600 rounded-3xl p-8 flex flex-col items-center justify-center transition-transform hover:scale-105 shadow-clinical-lg">
                    <div className="w-32 h-32 md:w-48 md:h-48 relative mb-6">
                        <Image src="/icons/open-palm.svg" alt="Open Palm" fill className="object-contain" priority />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Open Palm</h2>
                    <p className="text-xl md:text-2xl text-medical-green-300 font-bold">Please stop or wait</p>
                </div>

                {/* Peace Sign */}
                <div className="bg-medical-green-900 border-4 border-medical-green-600 rounded-3xl p-8 flex flex-col items-center justify-center transition-transform hover:scale-105 shadow-clinical-lg">
                    <div className="w-32 h-32 md:w-48 md:h-48 relative mb-6">
                        <Image src="/icons/peace-sign.svg" alt="Peace Sign" fill className="object-contain" priority />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Peace Sign</h2>
                    <p className="text-xl md:text-2xl text-medical-green-300 font-bold">I am in pain</p>
                </div>

                {/* Point Down */}
                <div className="bg-medical-green-900 border-4 border-medical-green-600 rounded-3xl p-8 flex flex-col items-center justify-center transition-transform hover:scale-105 shadow-clinical-lg">
                    <div className="w-32 h-32 md:w-48 md:h-48 relative mb-6">
                        <Image src="/icons/point-down.svg" alt="Point Down" fill className="object-contain" priority />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Point Down</h2>
                    <p className="text-xl md:text-2xl text-medical-green-300 font-bold">I need to reposition</p>
                </div>
            </div>
        </div>
    );
}
