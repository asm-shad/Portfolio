import { NextRequest } from "next/server";

// helpers/auth.ts
export async function verifyAuth(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      return { isAuthenticated: true, user: data.user };
    }
  } catch (error) {
    console.error("Auth verification failed:", error);
  }

  return { isAuthenticated: false, user: null };
}
