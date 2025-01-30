import { render, screen, fireEvent } from '@testing-library/react';
import { ClerkProvider } from '@clerk/nextjs';
import CoursesPage from '../../app/courses/page';  // Adjust to correct path
import { createMockRouter } from 'next-router-mock'; // Use next-router-mock

// Create a custom render function with Clerk and Router Context
const renderWithClerk = (ui) => {
    const mockRouter = createMockRouter(); // Mock the Next.js router
    return render(
        <ClerkProvider frontendApi="pk_test_c3RhYmxlLWdyb3VwZXItMTYuY2xlcmsuYWNjb3VudHMuZGV2JA">
            {/* Use the mock router here directly */}
            {ui}
        </ClerkProvider>
    );
};

describe('Courses Page Integration Test', () => {
    it('renders the Courses page with Navbar and AddCourseForm', () => {
        renderWithClerk(<CoursesPage />);

        // Ensure the Navbar and AddCourseForm are rendered
        expect(screen.getByText(/Navbar/i)).toBeInTheDocument();
        expect(screen.getByRole('form', { name: /add course/i })).toBeInTheDocument();
    });

    it('should navigate when a course is clicked', () => {
        const mockRouter = createMockRouter();
        renderWithClerk(<CoursesPage />);

        // Simulate clicking on a course link
        const courseLink = screen.getByText(/course 1/i); // Adjust to match the course name
        fireEvent.click(courseLink);

        // Check if router's push method is called for navigation
        expect(mockRouter.push).toHaveBeenCalledWith('/courses/[id]', '/courses/1');
    });

    // Additional tests for other components or functionalities...
});
