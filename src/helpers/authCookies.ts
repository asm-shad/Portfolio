// helpers/authCookies.ts
export function setAuthCookies(accessToken: string, refreshToken: string) {
  // Set access token cookie (short-lived)
  document.cookie = `accessToken=${accessToken}; path=/; max-age=${
    60 * 60 * 24
  }; sameSite=lax; ${process.env.NODE_ENV === "production" ? "secure;" : ""}`;

  // Set refresh token cookie (long-lived)
  document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${
    60 * 60 * 24 * 7
  }; sameSite=lax; ${process.env.NODE_ENV === "production" ? "secure;" : ""}`;
}

export function getAuthCookies() {
  const cookies = document.cookie.split("; ");
  const accessToken = cookies
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];
  const refreshToken = cookies
    .find((row) => row.startsWith("refreshToken="))
    ?.split("=")[1];
  return { accessToken, refreshToken };
}

export function clearAuthCookies() {
  document.cookie =
    "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie =
    "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
