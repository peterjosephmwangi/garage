// hooks/useStripePayment.ts
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export interface PaymentProduct {
  id: string;
  title: string;
  price: string;
  description: string;
  imageUrl?: string;
  supplier: string;
  serviceType: string;
}

export interface PaymentSession {
  id: string;
  url: string;
}

interface UseStripePaymentReturn {
  initiatePayment: (product: PaymentProduct, quantity?: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useStripePayment = (): UseStripePaymentReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const initiatePayment = async (product: PaymentProduct, quantity: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product,
          quantity,
          successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/services/${product.serviceType}/${product.id}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId }: { sessionId: string } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment redirection failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initiatePayment,
    isLoading,
    error,
    clearError,
  };
};