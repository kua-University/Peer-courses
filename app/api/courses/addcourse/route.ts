//api/courses/addcourse/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import Course from "@/models/course";

export async function POST(req: NextRequest)
{
    await dbConnect(); // Connect to MongoDB

    try
    {
        // Parse the request body as JSON
        const { imageUrl, title, description, paymentAmount } = await req.json();

        // Validate the request body to ensure all fields are provided
        if (!imageUrl || !title || !description || !paymentAmount)
        {
            return NextResponse.json(
                { message: "All fields are required." },
                { status: 400 }
            );
        }

        // Create a new course instance
        const course = new Course({
            imageUrl,
            title,
            description,
            paymentAmount,
        });

        // Save the new course to the database
        const savedCourse = await course.save();

        // Send the response back to the client
        return NextResponse.json(
            { message: "Course added successfully", course: savedCourse },
            { status: 201 }
        );
    } catch (error)
    {
        // Handle any errors that occur during the save process
        console.error("Error adding course:", error);
        return NextResponse.json(
            { message: "Failed to add course", error },
            { status: 500 }
        );
    }
}

