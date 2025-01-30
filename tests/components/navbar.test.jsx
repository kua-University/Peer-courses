import { render, screen, fireEvent, within } from '@testing-library/react';
import { ClerkProvider, useAuth, UserButton } from '@clerk/clerk-react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock Next.js router properly
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
    })),
    usePathname: jest.fn(() => "/"), // Ensure `usePathname` is also mocked
}));

// Correctly mock useAuth from Clerk
jest.mock('@clerk/clerk-react', () => ({
    ClerkProvider: jest.fn(({ children }) => <>{children}</>),
    useAuth: jest.fn(), // Mock useAuth instead of useClerk
    UserButton: jest.fn(() => <div data-testid="user-button">User</div>),
}));

// Function to render Navbar inside ClerkProvider
const renderWithClerk = (ui) => {
    return render(
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'test_key'}>
            {ui}
        </ClerkProvider>
    );
};

// Test unauthenticated user
test('renders the navbar with "Sign In" button when user is not authenticated', () => {
    useAuth.mockReturnValue({ isLoaded: true, userId: null }); // Properly mock useAuth
    renderWithClerk(<Navbar />);

    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();

    // Find the correct "Courses" link by its href
    const coursesLinks = screen.getAllByText(/Courses/i);
    expect(coursesLinks.some(link => link.getAttribute('href') === '/sign-in')).toBe(true);

    const myCoursesLinks = screen.getAllByText(/My Courses/i);
    expect(myCoursesLinks.some(link => link.getAttribute('href') === '/sign-in')).toBe(true);
});

// Test authenticated user
test('renders the navbar with user information when authenticated', () => {
    useAuth.mockReturnValue({ isLoaded: true, userId: 'user_123' }); // Properly mock useAuth

    renderWithClerk(<Navbar />);

    expect(screen.getByTestId('user-button')).toBeInTheDocument();

    // Ensure correct href values for logged-in users
    const coursesLinks = screen.getAllByText(/Courses/i);
    expect(coursesLinks.some(link => link.getAttribute('href') === '/courses')).toBe(true);

    const myCoursesLinks = screen.getAllByText(/My Courses/i);
    expect(myCoursesLinks.some(link => link.getAttribute('href') === '/my-courses')).toBe(true);
});

// Test navigation clicks
test('redirects to the correct URLs when links are clicked', () => {
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush, replace: jest.fn(), prefetch: jest.fn() });

    useAuth.mockReturnValue({ isLoaded: true, userId: 'user_123' });

    renderWithClerk(<Navbar />);

    // Find the first "Courses" link and click it
    const coursesLink = screen.getAllByText(/Courses/i).find(link => link.getAttribute('href') === '/courses');
    fireEvent.click(coursesLink);
    expect(mockPush).toHaveBeenCalledWith('/courses');

    const myCoursesLink = screen.getAllByText(/My Courses/i).find(link => link.getAttribute('href') === '/my-courses');
    fireEvent.click(myCoursesLink);
    expect(mockPush).toHaveBeenCalledWith('/my-courses');
});

// Test User Avatar Rendering
test('shows the user avatar when authenticated', () => {
    useAuth.mockReturnValue({ isLoaded: true, userId: 'user_123' });

    renderWithClerk(<Navbar />);

    expect(screen.getByTestId('user-button')).toBeInTheDocument();
});
