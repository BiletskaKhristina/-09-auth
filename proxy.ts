import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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



  if (!accessToken && refreshToken) {
    try {

      const response = await checkSession();


      isAuthenticated = true;


      const res = NextResponse.next();


      const setCookie = response.headers["set-cookie"];


      if (setCookie) {

        const cookiesArray = Array.isArray(setCookie)
          ? setCookie
          : [setCookie];


        cookiesArray.forEach((cookie) => {

          const [cookieNameValue] = cookie.split(";");

          const [name, value] =
            cookieNameValue.split("=");


          if (name && value) {
            cookieStore.set(
              name.trim(),
              value.trim()
            );
          }

        });
      }


      return res;


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