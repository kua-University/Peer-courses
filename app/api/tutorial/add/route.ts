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
    } catch (error: unknown)
    {
        console.error('Error adding tutorial:', error);

        // Ensure error is an instance of Error before accessing its message
        if (error instanceof Error)
        {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to add tutorial' },
            { status: 500 }
        );
    }

}
