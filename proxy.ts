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


  const accessToken =
    cookieStore.get("accessToken")?.value;


  const refreshToken =
    cookieStore.get("refreshToken")?.value;



  let isAuthenticated = Boolean(accessToken);



  const res = NextResponse.next();



  if (!accessToken && refreshToken) {

    try {

      const response = await checkSession();


      isAuthenticated = true;



      const setCookie =
        response.headers["set-cookie"];



      if (setCookie) {

        const cookiesArray = Array.isArray(setCookie)
          ? setCookie
          : [setCookie];



        cookiesArray.forEach((cookie) => {

          const parsed = parseSetCookie(cookie);


          if (parsed.value) {

            res.cookies.set(
              parsed.name,
              parsed.value,
              {
                path: "/",
              }
            );

          }

        });

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



  return res;

}



export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};