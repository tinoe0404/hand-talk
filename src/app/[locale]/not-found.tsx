import Link from "next/link";

export default function NotFound() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                backgroundColor: "#f8f9fa",
                padding: "2rem",
                textAlign: "center",
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
                <div style={{ fontSize: "4rem", marginBottom: "0.5rem", fontWeight: 700, color: "#2E7D32" }}>
                    404
                </div>
                <h1
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: "#1a1a2e",
                        marginBottom: "0.75rem",
                    }}
                >
                    Page Not Found
                </h1>
                <p
                    style={{
                        color: "#6b7280",
                        fontSize: "0.95rem",
                        marginBottom: "1.5rem",
                        lineHeight: 1.5,
                    }}
                >
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    href="/dashboard"
                    style={{
                        display: "inline-block",
                        backgroundColor: "#2E7D32",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.75rem 2rem",
                        fontSize: "1rem",
                        fontWeight: 600,
                        textDecoration: "none",
                        transition: "background-color 0.2s",
                    }}
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}
