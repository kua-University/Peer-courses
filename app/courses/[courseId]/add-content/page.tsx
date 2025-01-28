'use client';
import React from 'react';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function AddContentPage()
{
    const params = useParams(); // Fetch params for courseId
    const [courseId, setCourseId] = useState<string>('');
    const [title, setTitle] = useState('');
    const [contentType, setContentType] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() =>
    {
        if (params?.courseId)
        {
            setCourseId(Array.isArray(params.courseId) ? params.courseId[0] : params.courseId);
        }
    }, [params]);

    // Helper function to dynamically determine content type
    const determineContentType = (mimeType: string): string =>
    {
        if (mimeType.includes('video')) return 'video';
        if (mimeType === 'application/pdf') return 'pdf';
        if (mimeType.includes('image')) return 'image';
        if (mimeType.includes('audio')) return 'audio';
        if (mimeType.includes('text')) return 'text';
        return 'raw'; // Default type
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const selectedFile = e.target.files?.[0];
        if (selectedFile)
        {
            setFile(selectedFile);
            setContentType(determineContentType(selectedFile.type)); // Dynamically set content type
        }
    };

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();

        if (!file)
        {
            setError('Please upload a file.');
            return;
        }

        setLoading(true);
        setError(null);

        try
        {
            // Upload file to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

            const uploadResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const uploadData = await uploadResponse.json();
            if (!uploadResponse.ok)
            {
                throw new Error('Failed to upload file to Cloudinary.');
            }

            const contentUrl = uploadData.secure_url;

            // Save tutorial metadata in the backend
            const response = await fetch('/api/tutorial/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, courseId, contentType, contentUrl }),
            });

            if (!response.ok)
            {
                throw new Error('Failed to save tutorial.');
            }

            router.push(`/courses/${courseId}`); // Redirect back to the course page
        } catch (err)
        {
            setError((err as Error).message);
        } finally
        {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Tutorial Title
                </label>
                <input
                    id="title"
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 rounded-md w-full"
                    required
                />
            </div>
            <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                    Upload File
                </label>
                <input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="border p-2 rounded-md w-full"
                    required
                />
                {contentType && (
                    <p className="text-sm text-gray-500 mt-1">Detected Content Type: {contentType}</p>
                )}
            </div>
            <button
                type="submit"
                disabled={loading}
                className={`bg-blue-500 text-white py-2 px-4 rounded-md w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {loading ? 'Uploading...' : 'Add Tutorial'}
            </button>
        </form>
    );
}
