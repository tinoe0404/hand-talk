export default function Loading() {
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
            }}
        >
            <div
                style={{
                    width: "48px",
                    height: "48px",
                    border: "4px solid #e5e7eb",
                    borderTopColor: "#2E7D32",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                }}
            />
            <p
                style={{
                    marginTop: "1rem",
                    color: "#6b7280",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                }}
            >
                Loading…
            </p>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
