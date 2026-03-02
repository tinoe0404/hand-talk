import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const getSecret = () => {
    const secret = process.env.AUTH_SECRET;
    // Only throw if in production and NOT in the build phase
    if (!secret && process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
        throw new Error("AUTH_SECRET environment variable is required in production");
    }
    return new TextEncoder().encode(
        secret || "clinical-safety-secret-default-key-12345"
    );
};

const SECRET = getSecret();

const COOKIE_NAME = "hand_talk_session";

/**
 * Authentication Utilities
 * Clinical justification: Secure access control for radiographers 
 * to ensure only authorized personnel can trigger patient instructions.
 */

export async function hashPin(pin: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(pin, salt);
}

export async function verifyPin(pin: string, hashedPin: string): Promise<boolean> {
    return bcrypt.compare(pin, hashedPin);
}

export async function createSession(radiographerId: string) {
    const expires = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8-hour clinical shift
    const session = await new SignJWT({ radiographerId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("8h")
        .sign(SECRET);

    cookies().set(COOKIE_NAME, session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    });
}

export async function getSession() {
    const session = cookies().get(COOKIE_NAME)?.value;
    if (!session) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(session, SECRET, {
            algorithms: ["HS256"],
        });
        return payload as { radiographerId: string };
    } catch {
        return null;
    }
}

export async function deleteSession() {
    cookies().delete(COOKIE_NAME);
}
