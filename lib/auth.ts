/**
 * Auth helper utilities:
 *  - signToken: creates a signed JWT
 *  - verifyToken: validates a JWT
 *  - getUserFromRequest: extracts user payload from incoming request cookies
 */
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  throw new Error("Please define the JWT_SECRET environment variable in .env.local");
}

export interface TokenPayload {
  username: string;
  fullName: string;
  email: string;
  profileImage?: string;
}

/** Sign a JWT with the user payload */
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

/** Verify a JWT and return the decoded payload or null */
export function verifyToken(token: string): (TokenPayload & JwtPayload) | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload & JwtPayload;
  } catch {
    return null;
  }
}

/** Extract user from the HTTP-only cookie in a Next.js request */
export function getUserFromRequest(req: NextRequest): (TokenPayload & JwtPayload) | null {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
