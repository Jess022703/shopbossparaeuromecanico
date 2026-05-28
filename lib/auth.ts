import { cookies } from "next/headers";

const COOKIE_NAME = "shop_auth";

function expectedToken(): string {
  // Lightweight server-side token derived from the configured PIN.
  const pin = process.env.SHOP_PIN ?? "2229";
  return `ok:${pin}`;
}

export function isPinValid(pin: string): boolean {
  return pin === (process.env.SHOP_PIN ?? "2229");
}

export async function isAuthenticated(): Promise<boolean> {
  const token = cookies().get(COOKIE_NAME)?.value;
  return token === expectedToken();
}

export function authCookie() {
  return {
    name: COOKIE_NAME,
    value: expectedToken(),
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours
    },
  };
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
