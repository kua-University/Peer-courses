import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../../components/checkoutForm";

jest.mock("@stripe/react-stripe-js", () => {
  const actual = jest.requireActual("@stripe/react-stripe-js");
  return {
    ...actual,
    useStripe: jest.fn(),
    useElements: jest.fn(),
  };
});

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

describe("CheckoutForm", () => {
  const mockClose = jest.fn();
  let mockStripe, mockElements;

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks(); // Clear mocks before each test

    mockStripe = {
      confirmCardPayment: jest.fn(),
    };

    mockElements = {
      getElement: jest.fn(() => ({
        on: jest.fn((event, callback) => {
          if (event === "change") {
            callback({ complete: true }); // Simulating a valid card input
          }
        }),
        complete: true,
      })),
    };

    (require("@stripe/react-stripe-js").useStripe).mockReturnValue(mockStripe);
    (require("@stripe/react-stripe-js").useElements).mockReturnValue(mockElements);
  });

  it("renders without crashing", () => {
    render(
      <Elements stripe={stripePromise}>
        <CheckoutForm courseId="1" paymentAmount={100} onClose={mockClose} />
      </Elements>
    );
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("shows error when Stripe is not initialized", async () => {
    (require("@stripe/react-stripe-js").useStripe).mockReturnValue(null);

    render(
      <Elements stripe={stripePromise}>
        <CheckoutForm courseId="1" paymentAmount={100} onClose={mockClose} />
      </Elements>
    );

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(
        screen.getByText("Stripe is not properly initialized.")
      ).toBeInTheDocument();
    });
  });

  it("shows error when card details are invalid", async () => {
    mockElements.getElement.mockReturnValue({
      on: jest.fn(),
      complete: false,
    });

    render(
      <Elements stripe={stripePromise}>
        <CheckoutForm courseId="1" paymentAmount={100} onClose={mockClose} />
      </Elements>
    );

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(screen.getByText("Please enter valid card details.")).toBeInTheDocument();
    });
  });

  it("submits payment when card details are valid", async () => {
    const clientSecret = "test-secret";

    mockElements.getElement.mockReturnValue({
      on: jest.fn(),
      complete: true,
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ clientSecret }),
    });

    mockStripe.confirmCardPayment.mockResolvedValue({ paymentIntent: { status: "succeeded" } });

    render(
      <Elements stripe={stripePromise}>
        <CheckoutForm courseId="1" paymentAmount={100} onClose={mockClose} />
      </Elements>
    );

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      // Debugging log to check if confirmCardPayment was called and with correct arguments
      console.log("Confirm Card Payment Call:", mockStripe.confirmCardPayment.mock.calls);
      expect(mockStripe.confirmCardPayment).toHaveBeenCalledWith(clientSecret, expect.anything());
      expect(mockClose).toHaveBeenCalled();
    });
  });

  it("shows error message when payment fails", async () => {
    const clientSecret = "test-secret";

    mockElements.getElement.mockReturnValue({
      on: jest.fn(),
      complete: true,
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ clientSecret }),
    });

    mockStripe.confirmCardPayment.mockRejectedValue(new Error("Payment failed"));

    render(
      <Elements stripe={stripePromise}>
        <CheckoutForm courseId="1" paymentAmount={100} onClose={mockClose} />
      </Elements>
    );

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
    });
  });

  it("disables the submit button when loading or invalid", () => {
    mockElements.getElement.mockReturnValue({
      on: jest.fn(),
      complete: false,
    });

    render(
      <Elements stripe={stripePromise}>
        <CheckoutForm courseId="1" paymentAmount={100} onClose={mockClose} />
      </Elements>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("calls onClose after successful payment", async () => {
    const clientSecret = "test-secret";

    mockElements.getElement.mockReturnValue({
      on: jest.fn(),
      complete: true,
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ clientSecret }),
    });

    mockStripe.confirmCardPayment.mockResolvedValue({ paymentIntent: { status: "succeeded" } });

    render(
      <Elements stripe={stripePromise}>
        <CheckoutForm courseId="1" paymentAmount={100} onClose={mockClose} />
      </Elements>
    );

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(mockClose).toHaveBeenCalledTimes(1);
    });
  });
});
