//components/checkoutForm
"use client";
import React from 'react';

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import Stripe from "@stripe/stripe-js";
interface CheckoutFormProps
{
    courseId: string;
    paymentAmount: number;
    onClose: () => void;
}

export default function CheckoutForm({ courseId, paymentAmount, onClose }: CheckoutFormProps)
{
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCardValid, setIsCardValid] = useState(false);  // Track card validity

    // UseEffect to listen for changes in the CardElement
    useEffect(() =>
    {
        const cardElement = elements?.getElement(CardElement);
        if (cardElement)
        {
            cardElement.on("change", (event: Stripe.StripeElementChangeEvent) =>
            {
                setIsCardValid(event.complete);  // Check if the card input is complete
            });
        }
    }, [elements]);

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!stripe || !elements)
        {
            setError("Stripe is not properly initialized.");
            setLoading(false);
            return;
        }

        if (!isCardValid)
        {
            setError("Please enter valid card details.");
            setLoading(false);
            return;
        }

        try
        {
            // Fetch the client secret from the backend
            const response = await fetch("/api/payment/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId }),
            });

            const { clientSecret, error: backendError } = await response.json();
            if (!response.ok || backendError)
            {
                throw new Error(backendError || "Failed to create payment intent");
            }

            // Confirm the payment on the frontend
            const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                },
            });

            if (stripeError)
            {
                throw stripeError;
            }

            alert("Payment successful!");
            onClose();
        } catch (error)
        {
            setError((error as Error).message || "Payment failed. Please try again.");
        } finally
        {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" role="form">
            {error && <p className="text-red-500">{error}</p>}
            <CardElement className="border p-2 rounded-md" />
            <button
                type="submit"
                disabled={loading || !stripe || !isCardValid} // Disable if not complete
                className="bg-blue-500 text-white py-2 px-4 rounded-md w-full"
            >
                {loading ? "Processing..." : `Pay $${paymentAmount}`}
            </button>
        </form>
    );
}







// Visa: 4242 4242 4242 4242
// MasterCard: 5555 5555 5555 4444
// American Express: 3782 8224 6310 005
// Discover: 6011 1111 1111 1117
// JCB: 3530 1113 3330 0000