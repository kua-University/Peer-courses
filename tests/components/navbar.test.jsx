import { render, screen, fireEvent } from '@testing-library/react';
import { ClerkProvider, useAuth, UserButton } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock Next.js router and pathname
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
        href: '/courses',
    })),
    usePathname: jest.fn(() => "/courses"), // Ensure `usePathname` is mocked correctly
}));

// Mock Clerk's useAuth and UserButton components
jest.mock('@clerk/clerk-react', () => ({
    ClerkProvider: jest.fn(({ children }) => <>{children}</>),
    useAuth: jest.fn(), // Mock useAuth
    UserButton: jest.fn(() => <div data-testid="user-button">User</div>), // Mock UserButton
}));

// Helper function to render the Navbar within ClerkProvider
const renderWithClerk = (ui) => {
    return render(
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'test_key'}>
            {ui}
        </ClerkProvider>
    );
};

// Test case for unauthenticated user
test('renders the navbar with "Sign In" button when user is not authenticated', () => {
    useAuth.mockReturnValue({ isLoaded: true, userId: null }); // Mocking unauthenticated user

    renderWithClerk(<Navbar />);

    // Check if "Sign In" button is rendered
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();

    // Ensure "Courses" link points to /sign-in for unauthenticated users
    const coursesLinks = screen.getAllByText(/Courses/i);
    expect(coursesLinks.some(link => link.getAttribute('href') === '/sign-in')).toBe(true);

    // Ensure "My Courses" link does not exist for unauthenticated users
    const myCoursesLinks = screen.getAllByText(/My Courses/i);
    expect(myCoursesLinks.some(link => link.getAttribute('href') === '/sign-in')).toBe(false);
});

// Test case for authenticated user
test('renders the navbar with user information when authenticated', () => {
    useAuth.mockReturnValue({ isLoaded: true, userId: 'user_123' }); // Mocking authenticated user

    renderWithClerk(<Navbar />);

    // Ensure the user avatar button is rendered when authenticated
    expect(screen.getByTestId('user-button')).toBeInTheDocument();

    // Ensure "Courses" and "My Courses" links point to correct paths for authenticated users
    const coursesLinks = screen.getAllByText(/Courses/i);
    expect(coursesLinks.some(link => link.getAttribute('href') === '/courses')).toBe(true);

    const myCoursesLinks = screen.getAllByText(/My Courses/i);
    expect(myCoursesLinks.some(link => link.getAttribute('href') === '/my-courses')).toBe(true);
});

// Test navigation behavior on link click
test('redirects to the correct URLs when links are clicked', () => {
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush, replace: jest.fn(), prefetch: jest.fn() });

    useAuth.mockReturnValue({ isLoaded: true, userId: 'user_123' }); // Mocking authenticated user

    renderWithClerk(<Navbar />);

    // Ensure links are rendered with correct href values
    const coursesLinks = screen.getAllByText(/Courses/i);
    const myCoursesLinks = screen.getAllByText(/My Courses/i);

    expect(coursesLinks.length).toBeGreaterThan(0); // Ensure "Courses" link is rendered
    expect(myCoursesLinks.length).toBeGreaterThan(0); // Ensure "My Courses" link is rendered

    // Ensure correct href attributes for links
    coursesLinks.forEach(link => {
        expect(link.getAttribute('href')).toBe('/courses');
    });
    myCoursesLinks.forEach(link => {
        expect(link.getAttribute('href')).toBe('/my-courses');
    });

    // Simulate click on "Courses" link and check if push is called
    fireEvent.click(coursesLinks[0]);
    expect(mockPush).toHaveBeenCalledWith('/courses');

    // Simulate click on "My Courses" link and check if push is called
    fireEvent.click(myCoursesLinks[0]);
    expect(mockPush).toHaveBeenCalledWith('/my-courses');
});

// Test for User Avatar rendering when authenticated
test('shows the user avatar when authenticated', () => {
    useAuth.mockReturnValue({ isLoaded: true, userId: 'user_123' }); // Mocking authenticated user

    renderWithClerk(<Navbar />);

    // Check if the user button/avatar is rendered when authenticated
    expect(screen.getByTestId('user-button')).toBeInTheDocument();
});
