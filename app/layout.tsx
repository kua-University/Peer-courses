//app/layout.tsx
"use client";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
  return (
    <ClerkProvider afterSignOutUrl={"/"} routerDebug={true}>
      <html lang="en">
        <body >
          <Elements stripe={stripePromise}>
            {children}
          </Elements>
        </body>
      </html>
    </ClerkProvider >
  );
}
