"use client";

import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
}

/**
 * Accessible Modal Component
 * - Focus trap keeps keyboard navigation inside the modal
 * - role="dialog" + aria-modal for screen readers
 * - Escape key and backdrop click to close
 * - Restores focus to trigger element on close
 */
export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Focus trap: cycle Tab focus within the modal
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }

            if (e.key !== "Tab" || !modalRef.current) {
                return;
            }

            const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstEl = focusableElements[0];
            const lastEl = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl?.focus();
                }
            } else {
                if (document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl?.focus();
                }
            }
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            // Store previously focused element to restore on close
            previousFocusRef.current = document.activeElement as HTMLElement;
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);

            // Focus the modal itself on open
            requestAnimationFrame(() => {
                modalRef.current?.focus();
            });
        }
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);

            // Restore focus to the element that opened the modal
            if (!isOpen && previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) {
        return null;
    }

    const titleId = "modal-title";
    const descId = description ? "modal-description" : undefined;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
            role="presentation"
        >
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descId}
                tabIndex={-1}
                className="bg-white w-full max-w-md max-w-[calc(100vw-2rem)] rounded-2xl border-2 border-medical-green-100 shadow-clinical-xl overflow-hidden animate-in zoom-in-95 duration-200 outline-none"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-medical-green-50 flex justify-between items-center bg-medical-green-50/30">
                    <div>
                        <h2 id={titleId} className="text-xl font-black text-medical-green-900">{title}</h2>
                        {description && <p id={descId} className="text-xs text-medical-green-600 font-medium mt-0.5">{description}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-medical-green-100 rounded-full transition-colors text-medical-green-700"
                        aria-label="Close dialog"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
