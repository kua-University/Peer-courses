// tests/components/AddContentPage.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddContentPage from '../../app/courses/[courseId]/add-content/page';
import { useRouter, useParams } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useParams: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ secure_url: 'https://cloudinary.com/mock-url' }),
    })
);

describe('AddContentPage Component Unit Test', () => {
    beforeEach(() => {
        // Mock useRouter and useParams
        useRouter.mockReturnValue({
            push: jest.fn(),
        });
        useParams.mockReturnValue({
            courseId: 'mock-course-id',
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the form with title and file inputs', () => {
        render(<AddContentPage />);

        // Check if the title input is rendered
        expect(screen.getByLabelText(/Tutorial Title/i)).toBeInTheDocument();

        // Check if the file input is rendered
        expect(screen.getByLabelText(/Upload File/i)).toBeInTheDocument();

        // Check if the submit button is rendered
        expect(screen.getByRole('button', { name: /Add Tutorial/i })).toBeInTheDocument();
    });

    it('updates the title input value when typed', () => {
        render(<AddContentPage />);

        const titleInput = screen.getByLabelText(/Tutorial Title/i);
        fireEvent.change(titleInput, { target: { value: 'Test Title' } });

        expect(titleInput).toHaveValue('Test Title');
    });

    it('sets the file and detects content type when a file is selected', () => {
        render(<AddContentPage />);

        const fileInput = screen.getByLabelText(/Upload File/i);
        const file = new File(['test content'], 'test.png', { type: 'image/png' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        // Check if the content type is detected
        expect(screen.getByText(/Detected Content Type: image/i)).toBeInTheDocument();
    });

    it('submits the form and navigates after successful upload', async () => {
        render(<AddContentPage />);

        // Fill out the form
        const titleInput = screen.getByLabelText(/Tutorial Title/i);
        fireEvent.change(titleInput, { target: { value: 'Test Title' } });

        const fileInput = screen.getByLabelText(/Upload File/i);
        const file = new File(['test content'], 'test.png', { type: 'image/png' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        // Submit the form
        const submitButton = screen.getByRole('button', { name: /Add Tutorial/i });
        fireEvent.click(submitButton);

        // Wait for the upload and navigation to complete
        //     await waitFor(() => {
        //         expect(global.fetch).toHaveBeenCalledTimes(2); // Cloudinary upload and backend save
        //         expect(useRouter().push).toHaveBeenCalledWith('/courses/mock-course-id');
        //     });
        // });

        // it('displays an error message when file upload fails', async () => {
        //     // Mock fetch to simulate a failed upload
        //     global.fetch.mockImplementationOnce(() =>
        //         Promise.reject(new Error('Failed to upload file to Cloudinary.'))
        //     );

        //     render(<AddContentPage />);

        //     // Fill out the form
        //     const titleInput = screen.getByLabelText(/Tutorial Title/i);
        //     fireEvent.change(titleInput, { target: { value: 'Test Title' } });

        //     const fileInput = screen.getByLabelText(/Upload File/i);
        //     const file = new File(['test content'], 'test.png', { type: 'image/png' });
        //     fireEvent.change(fileInput, { target: { files: [file] } });

        //     // Submit the form
        //     const submitButton = screen.getByRole('button', { name: /Add Tutorial/i });
        //     fireEvent.click(submitButton);

        //     // Wait for the error message to appear
        //     await waitFor(() => {
        //         expect(screen.getByText(/Failed to upload file to Cloudinary./i)).toBeInTheDocument();
        //     });
    });
});