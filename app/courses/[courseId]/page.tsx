//app/courses/[courseId]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';

interface Tutorial
{
    _id: string;
    title: string;
    contentType: string;
    contentUrl: string;
}
interface CoursePageProps
{
    params: Promise<{ courseId: string }>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CoursePage({ params }: CoursePageProps)
{
    const [courseId, setCourseId] = useState<string | null>(null);
    const router = useRouter();

    // Resolve the `params` promise using useEffect
    useEffect(() =>
    {
        const getCourseId = async () =>
        {
            try
            {
                const resolvedParams = await params;
                setCourseId(resolvedParams.courseId);
            } catch (err)
            {
                console.error('Error resolving params:', err);
            }
        };
        getCourseId();
    }, [params]);

    // Make sure to only trigger the fetch when courseId is available
    const { data: tutorials, error } = useSWR(
        courseId ? `/api/tutorial/getByCourseId?courseId=${courseId}` : null,
        fetcher
    );

    if (error) return <p className="text-red-500">Failed to load tutorials.</p>;
    if (!tutorials) return <p>Loading tutorials...</p>;

    return (
        <div className="container mx-auto p-6">
            <Navbar />
            <h1 className="text-3xl font-bold mb-6">Tutorials</h1>

            {tutorials.length === 0 && (
                <p className="text-gray-500 text-lg">No tutorials available for this course.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorials.map((tutorial: Tutorial) => (
                    <div
                        key={tutorial._id}
                        className="border rounded-lg shadow-lg p-4 bg-white hover:shadow-xl transition duration-300"
                    >
                        <h3 className="text-lg font-semibold mb-2">{tutorial.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">Type: {tutorial.contentType}</p>
                        <a
                            href={tutorial.contentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            View Content
                        </a>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={() => router.push(`/courses/${courseId}/add-content`)}
                    className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300"
                >
                    Add New Tutorial
                </button>
            </div>
        </div>
    );
}
