import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbconnect";
import Payment from "@/models/payment";

export async function GET()
{
    await dbConnect();

    // Authenticate the user
    const userObj = await auth();
    const { userId } = userObj;

    if (!userId)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try
    {
        // Fetch payments where the user has completed payment
        const payments = await Payment.find({ userId: userId.toString(), status: "completed" }).populate("courseId");
        const unlockedCourses = payments.map((payment) => payment.courseId);

        return NextResponse.json({ courses: unlockedCourses }, { status: 200 });
    } catch (error)
    {
        console.error("Error fetching unlocked courses:", error);
        return NextResponse.json({ error: "Failed to fetch courses." }, { status: 500 });
    }
}
