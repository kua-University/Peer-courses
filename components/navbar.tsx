"use client";
import React from 'react';

import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar()
{
    const { isLoaded, userId } = useAuth();

    return (
        <nav className="flex items-center justify-between bg-blue-500 p-4 shadow-md">
            {/* Logo */}
            <div className="text-white text-lg font-bold tracking-wide">
                <Link href="/">PeerCourses</Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
                <Link
                    href={isLoaded && userId ? "/courses" : "/sign-in"}
                    className="text-white text-sm font-medium hover:text-blue-200 transition-colors duration-300"
                >
                    Courses
                </Link>
                <Link
                    href="/my-courses"
                    className="text-white text-sm font-medium hover:text-blue-200 transition-colors duration-300"
                >
                    My Courses
                </Link>
                {/* User Button (Visible only when authenticated) */}
                {isLoaded && userId ? (
                    <div className="flex items-center">
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-8 h-8",
                                },
                            }}
                            showName />
                    </div>
                ) : (
                    <Link
                        href="/sign-in"
                        className="bg-white text-blue-500 py-1 px-4 rounded-md font-semibold shadow hover:bg-blue-100 transition-colors duration-300"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}
