"use client";

import { useState } from "react";

export default function AddCourse()
{
    const [formData, setFormData] = useState({
        imageUrl: "",
        title: "",
        description: "",
        paymentAmount: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try
        {
            const response = await fetch("/api/courses/addcourse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok)
            {
                setMessage("Course added successfully!");
                setFormData({ imageUrl: "", title: "", description: "", paymentAmount: "" });
            } else
            {
                setMessage(data.message || "Failed to add course.");
            }
        } catch (error)
        {
            setMessage(`An error occurred while adding the course: ${error}`);
        } finally
        {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">Add a Course</h2>
            {message && (
                <p className="text-green-500 mb-4 text-center font-semibold">
                    {message}
                </p>
            )}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL:
                </label>
                <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    required
                    placeholder="Enter image URL"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title:
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter course title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description:
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Enter course description"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Amount:
                </label>
                <input
                    type="number"
                    name="paymentAmount"
                    value={formData.paymentAmount}
                    onChange={handleChange}
                    required
                    placeholder="Enter payment amount in USD"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
            >
                {isLoading ? "Adding..." : "Add Course"}
            </button>
        </form>

    );
}
