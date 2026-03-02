"use client";

/**
 * Global Error Boundary — Root-level safety net.
 * Catches errors that escape the [locale] layout's error.tsx,
 * preventing the raw Next.js "Application error" screen.
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    fontFamily: "system-ui, sans-serif",
                    backgroundColor: "#f8f9fa",
                    padding: "2rem",
                    textAlign: "center",
                    margin: 0,
                }}
            >
                <div
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        padding: "2.5rem",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                        maxWidth: "480px",
                        width: "100%",
                    }}
                >
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
                    <h1
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            color: "#1a1a2e",
                            marginBottom: "0.75rem",
                        }}
                    >
                        Something went wrong
                    </h1>
                    <p
                        style={{
                            color: "#6b7280",
                            fontSize: "0.95rem",
                            marginBottom: "1.5rem",
                            lineHeight: 1.5,
                        }}
                    >
                        A system error has occurred. Your data is safe.
                        Please try again or contact support if the problem persists.
                    </p>
                    {error.digest && (
                        <p
                            style={{
                                color: "#9ca3af",
                                fontSize: "0.8rem",
                                marginBottom: "1rem",
                                fontFamily: "monospace",
                            }}
                        >
                            Error ID: {error.digest}
                        </p>
                    )}
                    <button
                        onClick={reset}
                        style={{
                            backgroundColor: "#2E7D32",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "0.75rem 2rem",
                            fontSize: "1rem",
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
