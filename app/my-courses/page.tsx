//app/my-courses/page.tsx
"use client";
import React from 'react';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import { useAuth, RedirectToSignIn } from "@clerk/nextjs";

interface Course
{
    _id: string;
    imageUrl: string;
    title: string;
    paymentAmount: number;
}

export default function MyCoursesPage()
{
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { isLoaded, userId, getToken } = useAuth();

    useEffect(() =>
    {
        async function fetchMyCourses()
        {
            try
            {
                setLoading(true);
                setError(null);

                if (!isLoaded || !userId)
                {
                    throw new Error("Authentication not loaded or user not signed in.");
                }

                const token = await getToken();
                if (!token)
                {
                    throw new Error("Missing session token.");
                }

                const response = await fetch("/api/my-courses", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok)
                {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch courses.");
                }

                const data = await response.json();
                setCourses(data.courses);
            } catch (err)
            {
                console.error("Error fetching my courses:", err);
                setError((err as Error).message || "An error occurred.");
            } finally
            {
                setLoading(false);
            }
        }

        fetchMyCourses();
    }, [isLoaded, userId]);

    if (!isLoaded)
    {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold">Loading authentication...</p>
            </div>
        );
    }

    if (!userId)
    {
        return <RedirectToSignIn redirectUrl="/my-courses" />;
    }

    if (loading)
    {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold">Loading your courses...</p>
            </div>
        );
    }

    if (error)
    {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-lg font-semibold">Error: {error}</p>
            </div>
        );
    }

    if (courses.length === 0)
    {
        return (
            <div className="  items-col ">
                <div> <Navbar /></div>
                <p className="text-lg font-semibold my-8 text-center animate-pulse">You haven not unlocked any courses yet.</p>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <h1 className="text-2xl font-bold text-center mt-8">My Courses</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {courses.map((course) => (
                    <div key={course._id} className="bg-white p-4 rounded-lg shadow-md">
                        <Image
                            width={400}
                            height={300}
                            src={course.imageUrl}
                            alt={course.title}
                            className="w-full h-64 object-cover rounded-lg"
                        />
                        <h2 className="mt-4 text-xl font-semibold">{course.title}</h2>
                        <p className="text-lg text-gray-600 mt-2">${course.paymentAmount}</p>

                        <Link
                            href={`/courses/${course._id}`}
                            className="block mt-4 text-center bg-blue-500 text-white py-2 rounded-md"
                        >
                            View Course
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
