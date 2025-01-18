import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import Tutorial from '@/models/titourial'; // Ensure correct import of the model

export async function GET(req: Request)
{
    try
    {
        const url = new URL(req.url);
        const courseId = url.searchParams.get('courseId');

        if (!courseId)
        {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        await dbConnect(); // Ensure DB connection
        const tutorials = await Tutorial.find({ courseId }).lean(); // Use Mongoose to query

        return NextResponse.json(tutorials);
    } catch (error)
    {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch tutorials' }, { status: 500 });
    }
}
