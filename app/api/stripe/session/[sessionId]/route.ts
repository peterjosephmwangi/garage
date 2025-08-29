// app/api/stripe/session/[sessionId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil', // Updated to match TypeScript definitions
});

interface RouteParams {
  params: Promise<{
    sessionId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Await params before accessing properties (Next.js 15+ requirement)
    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Extract product name from line items
    const lineItems = session.line_items?.data || [];
    const productName = lineItems.length > 0 ? lineItems[0].description : 'Unknown Product';

    // Prepare response data
    const paymentDetails = {
      sessionId: session.id,
      customerEmail: session.customer_email,
      amount: session.amount_total,
      currency: session.currency,
      productName,
      status: session.payment_status,
      metadata: session.metadata,
      created: session.created,
    };

    return NextResponse.json(paymentDetails);
  } catch (error) {
    console.error('Error retrieving session details:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


// // app/api/stripe/session/[sessionId]/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-06-20',
// });

// interface RouteParams {
//   params: {
//     sessionId: string;
//   };
// }

// export async function GET(request: NextRequest, { params }: RouteParams) {
//   try {
//     const { sessionId } = params;

//     if (!sessionId) {
//       return NextResponse.json(
//         { error: 'Session ID is required' },
//         { status: 400 }
//       );
//     }

//     // Retrieve the checkout session
//     const session = await stripe.checkout.sessions.retrieve(sessionId, {
//       expand: ['line_items', 'payment_intent'],
//     });

//     if (!session) {
//       return NextResponse.json(
//         { error: 'Session not found' },
//         { status: 404 }
//       );
//     }

//     // Extract product name from line items
//     const lineItems = session.line_items?.data || [];
//     const productName = lineItems.length > 0 ? lineItems[0].description : 'Unknown Product';

//     // Prepare response data
//     const paymentDetails = {
//       sessionId: session.id,
//       customerEmail: session.customer_email,
//       amount: session.amount_total,
//       currency: session.currency,
//       productName,
//       status: session.payment_status,
//       metadata: session.metadata,
//       created: session.created,
//     };

//     return NextResponse.json(paymentDetails);
//   } catch (error) {
//     console.error('Error retrieving session details:', error);
    
//     if (error instanceof Stripe.errors.StripeError) {
//       return NextResponse.json(
//         { error: error.message },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }