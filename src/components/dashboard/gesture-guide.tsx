"use client";

/**
 * GestureGuide — shown on the PatientView (top panel) at the start of every session.
 * The radiographer tilts the phone toward the patient to show these 4 cards.
 */
export function GestureGuide() {
    const cards = [
        {
            emoji: "👍",
            gesture: "Thumbs Up",
            meaning: "I am okay",
            bg: "bg-green-50",
            border: "border-green-300",
            text: "text-green-800",
            badge: "bg-green-200 text-green-900",
        },
        {
            emoji: "✋",
            gesture: "Open Palm",
            meaning: "Please stop or wait",
            bg: "bg-yellow-50",
            border: "border-yellow-300",
            text: "text-yellow-800",
            badge: "bg-yellow-200 text-yellow-900",
        },
        {
            emoji: "✌️",
            gesture: "Peace Sign",
            meaning: "I am in pain",
            bg: "bg-orange-50",
            border: "border-orange-300",
            text: "text-orange-800",
            badge: "bg-orange-200 text-orange-900",
        },
        {
            emoji: "👇",
            gesture: "Point Down",
            meaning: "I need to reposition",
            bg: "bg-blue-50",
            border: "border-blue-300",
            text: "text-blue-800",
            badge: "bg-blue-200 text-blue-900",
        },
    ];

    return (
        <div className="h-full flex flex-col bg-white overflow-y-auto">
            {/* Header */}
            <div className="bg-medical-green-700 px-4 py-3 text-center shrink-0">
                <p className="text-white font-black text-base uppercase tracking-widest">
                    Hand Gestures Guide
                </p>
                <p className="text-medical-green-200 text-xs mt-0.5">
                    Show the radiographer how you feel
                </p>
            </div>

            {/* 2 × 2 Grid */}
            <div className="grid grid-cols-2 gap-3 p-3 flex-1">
                {cards.map((card) => (
                    <div
                        key={card.gesture}
                        className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 gap-1.5 ${card.bg} ${card.border}`}
                    >
                        {/* Gesture emoji — very large for visibility */}
                        <span
                            className="leading-none select-none"
                            style={{ fontSize: "clamp(2.5rem, 10vw, 4.5rem)" }}
                            role="img"
                            aria-label={card.gesture}
                        >
                            {card.emoji}
                        </span>

                        {/* Gesture name */}
                        <p
                            className={`font-black text-center leading-tight ${card.text}`}
                            style={{ fontSize: "clamp(0.9rem, 3.5vw, 1.25rem)" }}
                        >
                            {card.gesture}
                        </p>

                        {/* Meaning badge */}
                        <span
                            className={`px-2.5 py-1 rounded-full font-semibold text-center leading-snug ${card.badge}`}
                            style={{ fontSize: "clamp(0.7rem, 2.5vw, 0.9rem)" }}
                        >
                            {card.meaning}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
