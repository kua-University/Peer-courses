//app/api/courses/route.ts
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbconnect";
import Course from "@/models/course";
import Payment from "@/models/payment";

export async function GET()
{
    try
    {
        // Step 1: Authenticate the user
        const userAuth = await auth();
        const { userId } = userAuth;
        if (!userId)
        {
            return new Response(
                JSON.stringify({ error: "Unauthorized. Please sign in." }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }
        // Step 2: Connect to the database
        await dbConnect();
        // Step 3: Fetch all courses
        const courses = await Course.find();
        // Step 4: Fetch payments for the user
        const userPayments = await Payment.find({
            userId: userId,
            status: "completed",
        }).select("courseId");

        const paidCourseIds = userPayments.map(payment => payment.courseId.toString());

        // Step 5: Enrich courses with unlock status
        const enrichedCourses = courses.map((course) => ({
            ...course.toObject(),
            unlocked: paidCourseIds.includes(course._id.toString()),
        }));

        // Step 6: Return enriched courses
        return new Response(JSON.stringify({ courses: enrichedCourses }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error)
    {
        console.error("Unexpected error in /api/courses:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error: An unexpected error occurred." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
