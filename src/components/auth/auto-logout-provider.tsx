"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { logoutAction } from "@/lib/auth-actions";
import { Modal } from "@/components/ui/modal";
import { AlertTriangle, Loader2 } from "lucide-react";

// 15 minutes of inactivity triggers the warning
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
// 60 seconds to respond to the warning before forced logout
const WARNING_TIMEOUT_SECONDS = 60;

export function AutoLogoutProvider({ children }: { children: React.ReactNode }) {
    const [showWarning, setShowWarning] = useState(false);
    const [countdown, setCountdown] = useState(WARNING_TIMEOUT_SECONDS);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
    const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = useCallback(() => {
        // If the warning is currently showing, do not passively reset it from background events.
        // The user MUST explicitly click the "Stay Logged In" button to prove they are present.
        if (showWarning) {
            return;
        }

        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }

        inactivityTimerRef.current = setTimeout(() => {
            // Trigger the warning state
            setShowWarning(true);
            setCountdown(WARNING_TIMEOUT_SECONDS);
        }, INACTIVITY_TIMEOUT_MS);
    }, [showWarning]);

    useEffect(() => {
        // Initial timer start
        resetTimer();

        // Listen for user interaction events across the entire document
        const events = [
            "mousemove",
            "keydown",
            "wheel",
            "mousedown",
            "touchstart",
            "touchmove",
        ];

        events.forEach((event) => {
            window.addEventListener(event, resetTimer, { passive: true });
        });

        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
        };
    }, [resetTimer]);

    useEffect(() => {
        if (showWarning && countdown > 0) {
            // Start the countdown interval
            countdownIntervalRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownIntervalRef.current!);
                        handleForceLogout();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (!showWarning && countdownIntervalRef.current) {
            // Clean up if closed
            clearInterval(countdownIntervalRef.current);
        }

        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showWarning]);

    const handleForceLogout = async () => {
        setIsLoggingOut(true);
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
        }
        // Execute server action to destroy session cookie securely
        await logoutAction();
    };

    const handleStayLoggedIn = () => {
        setShowWarning(false);
        setCountdown(WARNING_TIMEOUT_SECONDS);
        // Need to wait until next tick so `showWarning` is false in the dependency array
        setTimeout(resetTimer, 0);
    };

    return (
        <>
            {children}

            <Modal
                isOpen={showWarning}
                onClose={() => { }} // Disable closing via backdrop or escape key to enforce a decision
                title="Session Expiring"
            >
                <div className="space-y-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-zinc-600 font-medium">
                                For security and HIPAA compliance, your session is about to expire due to inactivity.
                            </p>
                            <div className="text-4xl font-black text-red-600 tracking-tighter tabular-nums">
                                00:{countdown.toString().padStart(2, "0")}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleForceLogout}
                            disabled={isLoggingOut}
                            className="flex-1 h-12 rounded-xl border-2 border-zinc-200 text-zinc-600 font-bold text-sm hover:bg-zinc-50 transition-all active:scale-95 disabled:opacity-50"
                        >
                            Log Out Now
                        </button>
                        <button
                            onClick={handleStayLoggedIn}
                            disabled={isLoggingOut}
                            className="flex-1 h-12 rounded-xl bg-medical-green-600 text-white font-black text-sm shadow-clinical-md hover:bg-medical-green-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isLoggingOut ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Logging out...
                                </>
                            ) : (
                                "Stay Logged In"
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
