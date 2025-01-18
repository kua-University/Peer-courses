//app/courses/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";
import { useAuth, RedirectToSignIn } from "@clerk/nextjs";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/components/checkoutForm";


// Load Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Define the course type interface
interface Course
{
    _id: string;
    imageUrl: string;
    title: string;
    paymentAmount: number;
    unlocked: boolean;
}

export default function CoursesPage()
{
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    // Fetch authentication info using Clerk
    const { isLoaded, userId, getToken } = useAuth();

    useEffect(() =>
    {
        async function fetchCourses()
        {
            try
            {
                setLoading(true);
                setError(null);
                if (!isLoaded || !userId)
                {
                    return <RedirectToSignIn redirectUrl="/courses" />;
                    throw new Error("Authentication not loaded or user not signed in.");

                }
                const token = await getToken();
                console.log(`Token: ${token}`); // Add this line to log the tokentoken);
                if (!token)
                {
                    throw new Error("Missing session token.");
                }

                const response = await fetch("/api/courses", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok)
                {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch courses.");
                }

                const data: { courses: Course[] } = await response.json();
                setCourses(data.courses);
            } catch (err)
            {
                console.error("Error fetching courses:", err);
                setError((err as Error).message || "An error occurred.");
            } finally
            {
                setLoading(false);
            }
        }

        fetchCourses();
    }, [isLoaded, userId]);

    if (!isLoaded)
    {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold"> Loading...</p>
            </div>
        );
    }

    if (!userId)
    {
        return <RedirectToSignIn redirectUrl="/courses" />;
    }

    if (loading)
    {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold">Loading courses...</p>
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

    return (
        <div>
            <Navbar />
            <h1 className="text-2xl font-bold text-center mt-8 animate-bounce">Courses</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {courses.map((course) => (
                    <div key={course._id} className="bg-white p-4 rounded-lg shadow-md">
                        <Image
                            width={400}
                            height={300}
                            src={course.imageUrl}
                            alt={course.title}
                            className="w-full h-64 object-cover rounded-full animate-bounce"
                        />
                        <h2 className="mt-4 text-xl font-semibold">{course.title}</h2>
                        <p className="text-lg text-gray-600 mt-2">${course.paymentAmount}</p>

                        {course.unlocked ? (
                            <div>
                                <Link
                                    href={`/courses/${course._id}`}
                                    className="block mt-4 text-center bg-blue-500 text-white py-2 rounded-md"
                                >
                                    View Course
                                </Link>
                                <Link
                                    href={`/courses/${course._id}/add-content`}
                                    className="block mt-4 text-center bg-blue-500 text-white py-2 rounded-md"
                                >
                                    Add-Content
                                </Link>
                            </div>
                        ) : (
                            <button
                                disabled
                                className="block mt-4 text-center bg-gray-400 text-white py-2 rounded-md cursor-not-allowed"
                            >
                                Unlock to View
                            </button>
                        )}

                        {course.unlocked ? (
                            <button
                                disabled
                                className="block mt-4 text-center bg-gray-400 text-white py-2 rounded-md cursor-not-allowed"
                            >
                                Unlocked
                            </button>
                        ) : (
                            <button
                                onClick={() => setSelectedCourse(course)} // Open Stripe form modal
                                className="block mt-4 text-center bg-green-500 text-white py-2 rounded-md"
                            >
                                Unlock Course
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Stripe Checkout Modal */}
            {selectedCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
                        <h2 className="text-xl font-bold mb-4">
                            Unlock {selectedCourse.title} - ${selectedCourse.paymentAmount}
                        </h2>
                        <Elements stripe={stripePromise}>
                            <CheckoutForm
                                courseId={selectedCourse._id}
                                paymentAmount={selectedCourse.paymentAmount}
                                onClose={() => setSelectedCourse(null)} // Close modal
                            />
                        </Elements>
                    </div>
                </div>
            )}
        </div>
    );
}
