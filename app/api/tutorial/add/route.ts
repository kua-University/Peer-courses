import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import Tutorial from '@/models/titourial'; // Ensure this matches your actual model file name

export async function POST(req: Request)
{
    try
    {
        const { title, courseId, contentType, contentUrl } = await req.json();

        // Validate required fields
        if (!title || !courseId || !contentType || !contentUrl)
        {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Connect to the database
        await dbConnect();

        // Save tutorial metadata to the database
        const tutorial = await Tutorial.create({
            title,
            courseId,
            contentType,
            contentUrl,
            createdAt: new Date(),
        });

        return NextResponse.json(
            { message: 'Tutorial added successfully', tutorialId: tutorial._id },
            { status: 200 }
        );
    } catch (error: any)
    {
        console.error('Error adding tutorial:', error.message || error);
        return NextResponse.json(
            { error: error.message || 'Failed to add tutorial' },
            { status: 500 }
        );
    }
}
