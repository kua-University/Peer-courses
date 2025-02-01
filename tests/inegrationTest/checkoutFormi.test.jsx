import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClerkProvider } from '@clerk/nextjs';
import { StripeProvider, Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../../components/checkoutForm';
import { useRouter } from 'next/navigation';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import nextRouterMock from 'next-router-mock';
import { handlers } from './msw';
import { setupServer } from 'msw/node';

// Mock Next.js router and usePathname
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn().mockReturnValue('/mock-path'), // Mock with default return value
}));

// Set up the mock server to handle API requests
const server = setupServer(...handlers);

// Start the server before tests
beforeAll(() => server.listen());
// Reset handlers after each test
afterEach(() => server.resetHandlers());
// Close server after tests
afterAll(() => server.close());

// Mock Router Context
const renderWithStripeAndRouter = (ui) => {
    nextRouterMock.setCurrentUrl('/checkout');

    return render(
        <StripeProvider stripe={Stripe('your-stripe-public-key')}>
            <Elements>
                <RouterContext.Provider value={{ push: jest.fn() }}>
                    {ui}
                </RouterContext.Provider>
            </Elements>
        </StripeProvider>
    );
};

describe('CheckoutForm Integration Test', () => {
    it('renders the checkout form and submits payment', async () => {
        renderWithStripeAndRouter(<CheckoutForm courseId="123" paymentAmount={50} onClose={() => { }} />);

        // Check if CardElement is rendered
        const cardElement = screen.getByRole('form');
        expect(cardElement).toBeInTheDocument();

        // Find and fill the CardElement with test data (e.g., Visa)
        const cardInput = screen.getByRole('textbox');
        fireEvent.change(cardInput, { target: { value: '4242 4242 4242 4242' } });

        // Simulate form submission
        const submitButton = screen.getByRole('button', { name: /pay \$/i });
        fireEvent.click(submitButton);

        // Wait for API call to complete and check success
        await waitFor(() => {
            expect(screen.queryByText('Payment successful!')).toBeInTheDocument();
        });
    });

    it('shows an error when the card is invalid', async () => {
        renderWithStripeAndRouter(<CheckoutForm courseId="123" paymentAmount={50} onClose={() => { }} />);

        // Simulate submitting without valid card details
        const submitButton = screen.getByRole('button', { name: /pay \$/i });
        fireEvent.click(submitButton);

        // Check for error message
        await waitFor(() => {
            expect(screen.getByText('Please enter valid card details.')).toBeInTheDocument();
        });
    });
});
