import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/profile/edit", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let isAuthenticated = Boolean(accessToken);

 
  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();

      if (!response) {
        throw new Error("No response from checkSession");
      }

      isAuthenticated = true;

      const res = NextResponse.next();

     
      const setCookie = response.headers["set-cookie"];

      if (setCookie) {
        if (Array.isArray(setCookie)) {
          setCookie.forEach((cookie) => {
            res.headers.append("set-cookie", cookie);
          });
        } else {
          res.headers.set("set-cookie", setCookie);
        }
      }

      return res;
    } catch {
      isAuthenticated = false;
    }
  }

  
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};