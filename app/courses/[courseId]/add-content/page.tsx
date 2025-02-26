'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Upload, FileText, Loader2 } from 'lucide-react';

export default function AddContentPage() {
    const params = useParams();
    const [courseId, setCourseId] = useState<string>('');
    const [title, setTitle] = useState('');
    const [contentType, setContentType] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (params?.courseId) {
            setCourseId(Array.isArray(params.courseId) ? params.courseId[0] : params.courseId);
        }
    }, [params]);

    const determineContentType = (mimeType: string): string => {
        if (mimeType.includes('video')) return 'video';
        if (mimeType === 'application/pdf') return 'pdf';
        if (mimeType.includes('image')) return 'image';
        if (mimeType.includes('audio')) return 'audio';
        if (mimeType.includes('text')) return 'text';
        return 'raw';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setContentType(determineContentType(selectedFile.type));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload a file.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

            const uploadResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
                { method: 'POST', body: formData }
            );

            const uploadData = await uploadResponse.json();
            if (!uploadResponse.ok) throw new Error('Failed to upload file to Cloudinary.');

            const contentUrl = uploadData.secure_url;
            const response = await fetch('/api/tutorial/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, courseId, contentType, contentUrl }),
            });

            if (!response.ok) throw new Error('Failed to save tutorial.');
            router.push(`/courses/${courseId}`);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    Add Tutorial
                </h2>
                {error && <p className="text-red-500 text-center mb-2">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            className="border p-2 rounded-md w-full focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Upload File</label>
                        <div className="border-dashed border-2 border-gray-300 p-4 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50">
                            <label htmlFor="file" className="flex flex-col items-center gap-2">
                                <Upload className="h-8 w-8 text-gray-500" />
                                <span className="text-sm text-gray-500">Click to upload a file</span>
                                <input
                                    id="file"
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    required
                                />
                            </label>
                        </div>
                        {file && (
                            <div className="mt-2 flex items-center gap-2 text-gray-700">
                                <FileText className="h-5 w-5" />
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-gray-500">({contentType})</span>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-md w-full transition-all hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" /> Uploading...
                            </>
                        ) : (
                            'Add Tutorial'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
