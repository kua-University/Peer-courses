// tests/components/checkoutForm.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckoutForm from "../../components/checkoutForm";
import { useStripe, useElements } from "@stripe/react-stripe-js";

// Mock Stripe hooks and components
jest.mock("@stripe/react-stripe-js", () => ({
  useStripe: jest.fn(),
  useElements: jest.fn(),
  CardElement: jest.fn(() => <div data-testid="CardElement" />),
}));

// Mock fetch API
global.fetch = jest.fn();

describe("CheckoutForm", () =>
{
  const mockOnClose = jest.fn();

  beforeEach(() =>
  {
    jest.clearAllMocks();
    (useStripe as jest.Mock).mockReturnValue({
      confirmCardPayment: jest.fn(),
    });
    (useElements as jest.Mock).mockReturnValue({
      getElement: jest.fn().mockReturnValue({ on: jest.fn() }),
    });
  });

  it("renders correctly with provided props", () =>
  {
    render(
      <CheckoutForm courseId="123" paymentAmount={100} onClose={mockOnClose} />
    );

    expect(screen.getByText("Pay $100")).toBeInTheDocument();
    expect(screen.getByTestId("CardElement")).toBeInTheDocument();
  });

  it("shows error if Stripe is not initialized", async () =>
  {
    (useStripe as jest.Mock).mockReturnValue(null);

    render(
      <CheckoutForm courseId="123" paymentAmount={100} onClose={mockOnClose} />
    );

    fireEvent.click(screen.getByRole("button", { name: /pay/i }));

    await waitFor(() =>
    {
      expect(screen.getByText("Stripe is not properly initialized.")).toBeInTheDocument();
    });
  });

  it("displays an error for incomplete card details", async () =>
  {
    (useElements as jest.Mock).mockReturnValue({
      getElement: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) =>
        {
          if (event === "change") callback({ complete: false });
        }),
      }),
    });

    render(
      <CheckoutForm courseId="123" paymentAmount={100} onClose={mockOnClose} />
    );

    fireEvent.click(screen.getByRole("button", { name: /pay/i }));

    await waitFor(() =>
    {
      expect(screen.getByText("Please enter valid card details.")).toBeInTheDocument();
    });
  });

  it("handles a successful payment", async () =>
  {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ clientSecret: "test_secret" }),
    });

    (useStripe as jest.Mock).mockReturnValue({
      confirmCardPayment: jest.fn().mockResolvedValue({ error: null }),
    });

    render(
      <CheckoutForm courseId="123" paymentAmount={100} onClose={mockOnClose} />
    );

    fireEvent.click(screen.getByRole("button", { name: /pay/i }));

    await waitFor(() =>
    {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("handles payment failure", async () =>
  {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ clientSecret: "test_secret" }),
    });

    (useStripe as jest.Mock).mockReturnValue({
      confirmCardPayment: jest.fn().mockResolvedValue({
        error: { message: "Payment failed." },
      }),
    });

    render(
      <CheckoutForm courseId="123" paymentAmount={100} onClose={mockOnClose} />
    );

    fireEvent.click(screen.getByRole("button", { name: /pay/i }));

    await waitFor(() =>
    {
      expect(screen.getByText("Payment failed.")).toBeInTheDocument();
    });
  });

  it("handles backend error during payment intent creation", async () =>
  {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({
        error: "Failed to create payment intent",
      }),
    });

    render(
      <CheckoutForm courseId="123" paymentAmount={100} onClose={mockOnClose} />
    );

    fireEvent.click(screen.getByRole("button", { name: /pay/i }));

    await waitFor(() =>
    {
      expect(screen.getByText("Failed to create payment intent")).toBeInTheDocument();
    });
  });
});
