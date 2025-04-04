import NextAuth from "next-auth";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import authConfig from "./auth.config";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./route";

// Define supported locales
const locales = ["en", "id"];
const defaultLocale = "en";

// Create the internationalization middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
});

const { auth } = NextAuth(authConfig);

function setLocaleCookie(request: NextRequest): void {
  const locale =
    request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
    defaultLocale;

  if (locale && locales.includes(locale)) {
    request.cookies.set("NEXT_LOCALE", locale);
  }
}

// Function to handle CORS - Add this new function
function handleCORS(request: NextRequest) {
  // Check if it's a CORS preflight request
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "https://app.flashai.site",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, OPTIONS, PATCH",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-CSRF-Token",
        "Access-Control-Max-Age": "86400", // 24 hours
      },
    });
  }

  // For normal requests, continue processing but prep for CORS headers
  return null;
}

// Add CORS headers to any response
function addCORSHeaders(response: NextResponse) {
  response.headers.set(
    "Access-Control-Allow-Origin",
    "https://app.flashai.site",
  ); // Sebaiknya batasi ke domain tertentu di production
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  return response;
}

export default auth((req) => {
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  setLocaleCookie(req);

  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.includes(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (nextUrl.pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    return addCORSHeaders(response);
  }

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute || isPublicRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/sign-in", nextUrl));
  }
  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico)).*)",
  ],
};
