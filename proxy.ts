import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";

import { checkSession } from "@/lib/api/serverApi";


const privateRoutes = [
  "/profile",
  "/profile/edit",
  "/notes",
];


const publicRoutes = [
  "/sign-in",
  "/sign-up",
];


export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;


  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );


  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );


  const cookieStore = await cookies();


  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;


  let isAuthenticated = Boolean(accessToken);


  const response = NextResponse.next();



  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();


      const setCookie = sessionResponse.headers["set-cookie"];


      if (setCookie) {
        const cookiesArray = Array.isArray(setCookie)
          ? setCookie
          : [setCookie];


        let hasNewTokens = false;


        cookiesArray.forEach((cookieString) => {
          const parsed = parseSetCookie(cookieString);


          if (parsed.name && parsed.value) {

            response.cookies.set({
              name: parsed.name,
              value: parsed.value,

              ...(parsed.expires && {
                expires: parsed.expires,
              }),

              ...(parsed.maxAge && {
                maxAge: parsed.maxAge,
              }),

              ...(parsed.domain && {
                domain: parsed.domain,
              }),

              ...(parsed.path && {
                path: parsed.path,
              }),

              ...(parsed.httpOnly && {
                httpOnly: parsed.httpOnly,
              }),

              ...(parsed.secure && {
                secure: parsed.secure,
              }),

              ...(parsed.sameSite && {
                sameSite: parsed.sameSite,
              }),
            });


            if (
              parsed.name === "accessToken" ||
              parsed.name === "refreshToken"
            ) {
              hasNewTokens = true;
            }
          }
        });


        isAuthenticated = hasNewTokens;
      }


    } catch {
      isAuthenticated = false;
    }
  }



  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }



  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }



  return response;
}



export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};