// File: /app/api/payment/checkout/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import Course from "@/models/course";
import Payment from "@/models/payment";
import dbConnect from "@/lib/dbconnect";
//import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-12-18.acacia" });

export async function POST(req: NextRequest)
{
    await dbConnect();

    // Authenticate the user
    const userObj = await auth();
    const { userId } = userObj;
    if (!userId)
    {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { courseId } = await req.json();

    try
    {
        // Fetch the course from the database
        const course = await Course.findById(courseId);
        if (!course)
        {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        // Check if the user already unlocked the course
        //const userObjectId = new mongoose.Types.ObjectId(userId);
        const existingPayment = await Payment.findOne({ userId: userId.toString(), courseId, status: "completed" });
        if (existingPayment)
        {
            return NextResponse.json({ message: "Course already unlocked" }, { status: 200 });
        }

        // Create a Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: course.paymentAmount * 100, // Amount in cents
            currency: "usd",
            metadata: {
                userId: userId.toString(),
                courseId,
            },
        });

        // Save a pending payment record in the database
        await Payment.create({
            userId: userId.toString(),
            courseId,
            amountPaid: course.paymentAmount,
            status: "completed",
        });

        // Return the client secret to the frontend
        return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 });
    } catch (error)
    {
        console.error("Error creating payment intent:", error);
        return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
    }
}
