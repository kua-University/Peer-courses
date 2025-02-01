import { render, screen, fireEvent } from '@testing-library/react';
import { ClerkProvider } from '@clerk/nextjs';
import CoursesPage from '../../app/courses/page';
import { useRouter } from 'next/navigation'; // App Router requires `next/navigation`
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import nextRouterMock from 'next-router-mock'; // ✅ Correct import

// Mock Next.js router and usePathname
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn().mockReturnValue('/mock-path'), // Mock with default return value
}));

// Custom render function with Clerk and Router Context
const renderWithClerkAndRouter = (ui, { route = '/' } = {}) => {
    nextRouterMock.setCurrentUrl(route); // ✅ Set the current route

    const mockRouter = {
        ...nextRouterMock,
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
    };

    useRouter.mockReturnValue(mockRouter); // ✅ Ensure `useRouter()` returns the mock

    return render(
        <ClerkProvider publishableKey="your-publishable-key-here">
            <RouterContext.Provider value={mockRouter}>
                {ui}
            </RouterContext.Provider>
        </ClerkProvider>
    );
};

describe('Courses Page Integration Test', () => {
    it('renders the Courses page with Navbar and AddCourseForm', () => {
        renderWithClerkAndRouter(<CoursesPage />);

        // Ensure the Navbar and AddCourseForm are rendered
        expect(screen.getByText(/Navbar/i)).toBeInTheDocument();
        expect(screen.getByRole('form', { name: /add course/i })).toBeInTheDocument();
    });

    it('should navigate when a course is clicked', () => {
        nextRouterMock.setCurrentUrl('/courses'); // ✅ Correct router setup

        const mockRouter = {
            ...nextRouterMock,
            push: jest.fn(),
        };

        useRouter.mockReturnValue(mockRouter);
        renderWithClerkAndRouter(<CoursesPage />, { route: '/courses' });

        // Simulate clicking on a course link
        const courseLink = screen.getByText(/course 1/i); // Adjust text as needed
        fireEvent.click(courseLink);

        // Check if router's push method is called for navigation
        expect(mockRouter.push).toHaveBeenCalledWith('/courses/1');
    });
});
