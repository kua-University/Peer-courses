import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClerkProvider } from '@clerk/nextjs';
import CoursesPage from '../../app/courses/page';
import { useRouter } from 'next/navigation';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import nextRouterMock from 'next-router-mock'; // Correct import

// Mock Next.js router and usePathname
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn().mockReturnValue('/mock-path'), // Mock with default return value
}));

// Custom render function with Clerk and Router Context
const renderWithClerkAndRouter = (ui, { route = '/' } = {}) => {
    nextRouterMock.setCurrentUrl(route); //Set the current route

    const mockRouter = {
        ...nextRouterMock,
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
    };

    useRouter.mockReturnValue(mockRouter); // Ensure `useRouter()` returns the mock

    return render(
        <ClerkProvider publishableKey="pk_test_c3RhYmxlLWdyb3VwZXItMTYuY2xlcmsuYWNjb3VudHMuZGV2JA">
            <RouterContext.Provider value={mockRouter}>
                {ui}
            </RouterContext.Provider>
        </ClerkProvider>
    );
};

describe('Courses Page Integration Test', () => {
    it('renders the Courses page with Navbar and AddCourseForm', async () => {
        renderWithClerkAndRouter(<CoursesPage />);

        // Wait for the "Loading..." text to disappear and ensure the Navbar is rendered
        await waitFor(() => {
            expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
        });

        // Ensure the Navbar is rendered by using findByText (waits for async rendering)
        const navbarElement = await screen.findByText(/Navbar/i);
        expect(navbarElement).toBeInTheDocument();

        // Ensure AddCourseForm is rendered by checking its form role
        const addCourseForm = screen.getByRole('form', { name: /add course/i });
        expect(addCourseForm).toBeInTheDocument();
    });

    it('should navigate when a course is clicked', async () => {
        nextRouterMock.setCurrentUrl('/courses'); //  Correct router setup

        const mockRouter = {
            ...nextRouterMock,
            push: jest.fn(),
        };

        useRouter.mockReturnValue(mockRouter);
        renderWithClerkAndRouter(<CoursesPage />, { route: '/courses' });

        // Wait for courses to load and be visible
        await waitFor(() => {
            expect(screen.getByText(/course 1/i)).toBeInTheDocument();
        });

        // Simulate clicking on a course link
        const courseLink = screen.getByText(/course 1/i); // Adjust text as needed
        fireEvent.click(courseLink);

        // Check if router's push method is called for navigation
        expect(mockRouter.push).toHaveBeenCalledWith('/courses/1');
    });
});
