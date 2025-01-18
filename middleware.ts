import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public and protected route matchers
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);
const isProtectedRoute = createRouteMatcher(["/courses(.*)", "/my-courses(.*)", "/api/courses"]);

export default clerkMiddleware(async (auth, req) =>
{
    try
    {
        if (isPublicRoute(req))
        {
            return NextResponse.next();
        }
        const authObject = await auth();

        // Check if the current route is public
        if (!isPublicRoute(req))
        {
            // Protect all non-public routes
            await auth.protect();
        }

        // Redirect to sign-in if accessing a protected route without authentication
        if (!authObject.userId && isProtectedRoute(req))
        {
            console.error("Unauthorized access attempt to protected route:", req.url);
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }
    } catch (error)
    {
        // Handle NEXT_REDIRECT separately to avoid unnecessary 500 errors
        const errors = error as Error;
        if (errors.message === "NEXT_REDIRECT")
        {
            console.warn("Clerk triggered a redirect to the sign-in page:", req.url);
            return;
        }

        // Log all other unexpected errors
        console.error("Error in Clerk Middleware:", {
            error: errors.message,
            stack: errors.stack,
            requestUrl: req.url,
        });

        // Return a structured JSON response for internal server errors
        return new Response(
            JSON.stringify({
                error: "Internal Server Error in authentication middleware.",
                message: errors.message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
});

export const config = {
    matcher: [
        "/courses/:path*",
        "/my-courses/:path*",
        "/api/courses",
        '/(api|trpc)(.*)',
    ],
};
