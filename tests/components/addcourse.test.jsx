import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddCourse from "../../components/AddCourse";
import '@testing-library/jest-dom';

// Mocking the fetch API to simulate the backend response
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Course added successfully!" }),
    })
);

describe("AddCourse Component", () => {
    beforeEach(() => {
        // Reset the mock before each test
        fetch.mockClear();
    });

    test("renders the form and handles input changes", () => {
        render(<AddCourse />);

        // Check if form fields are rendered
        expect(screen.getByLabelText(/Image URL/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Payment Amount/i)).toBeInTheDocument();

        // Simulate typing into the form fields
        fireEvent.change(screen.getByLabelText(/Image URL/i), {
            target: { value: "http://example.com/image.jpg" },
        });
        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: "Test Course" },
        });
        fireEvent.change(screen.getByLabelText(/Description/i), {
            target: { value: "Test course description" },
        });
        fireEvent.change(screen.getByLabelText(/Payment Amount/i), {
            target: { value: "100" },
        });

        // Check if the inputs reflect the changes
        expect(screen.getByLabelText(/Image URL/i).value).toBe("http://example.com/image.jpg");
        expect(screen.getByLabelText(/Title/i).value).toBe("Test Course");
        expect(screen.getByLabelText(/Description/i).value).toBe("Test course description");
        expect(screen.getByLabelText(/Payment Amount/i).value).toBe("100");
    });

    test("submits the form and displays success message", async () => {
        render(<AddCourse />);

        // Fill in the form fields
        fireEvent.change(screen.getByLabelText(/Image URL/i), {
            target: { value: "http://example.com/image.jpg" },
        });
        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: "Test Course" },
        });
        fireEvent.change(screen.getByLabelText(/Description/i), {
            target: { value: "Test course description" },
        });
        fireEvent.change(screen.getByLabelText(/Payment Amount/i), {
            target: { value: "100" },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/Add Course/i));

        // Wait for the success message
        await waitFor(() => expect(screen.getByText(/Course added successfully!/i)).toBeInTheDocument());

        // Check if fetch was called with the correct data
        expect(fetch).toHaveBeenCalledWith(
            "/api/courses/addcourse",
            expect.objectContaining({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageUrl: "http://example.com/image.jpg",
                    title: "Test Course",
                    description: "Test course description",
                    paymentAmount: "100",
                }),
            })
        );
    });

    test("displays an error message when the API call fails", async () => {
        // Mock the fetch to simulate an error
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: "Failed to add course." }),
            })
        );

        render(<AddCourse />);

        // Fill in the form fields
        fireEvent.change(screen.getByLabelText(/Image URL/i), {
            target: { value: "http://example.com/image.jpg" },
        });
        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: "Test Course" },
        });
        fireEvent.change(screen.getByLabelText(/Description/i), {
            target: { value: "Test course description" },
        });
        fireEvent.change(screen.getByLabelText(/Payment Amount/i), {
            target: { value: "100" },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/Add Course/i));

        // Wait for the error message
        await waitFor(() => expect(screen.getByText(/Failed to add course/i)).toBeInTheDocument());
    });

    test("displays loading state when submitting", async () => {
        render(<AddCourse />);

        // Fill in the form fields
        fireEvent.change(screen.getByLabelText(/Image URL/i), {
            target: { value: "http://example.com/image.jpg" },
        });
        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: "Test Course" },
        });
        fireEvent.change(screen.getByLabelText(/Description/i), {
            target: { value: "Test course description" },
        });
        fireEvent.change(screen.getByLabelText(/Payment Amount/i), {
            target: { value: "100" },
        });

        // Submit the form and check for loading state
        fireEvent.click(screen.getByText(/Add Course/i));
        expect(screen.getByText(/Adding.../i)).toBeInTheDocument();
    });
});
